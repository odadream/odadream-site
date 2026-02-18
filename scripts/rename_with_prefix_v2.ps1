<#
.SYNOPSIS
    Оптимизация, транслитерация и управление префиксами имён файлов.

.DESCRIPTION
    Скрипт поддерживает четыре действия:
      optimize      — транслитерация + нормализация имён файлов
      add-prefix    — добавление префикса (по умолчанию 'collab_')
      remove-prefix — удаление префикса
      rollback      — восстановление имён файлов из точки отката
      preview       — предпросмотр без изменений (действие по умолчанию)

.PARAMETER Path
    Путь к папке с файлами. По умолчанию — текущая директория.

.PARAMETER Action
    Действие: preview | optimize | add-prefix | remove-prefix | rollback

.PARAMETER Prefix
    Префикс для добавления/удаления. По умолчанию — 'collab_'.

.PARAMETER Force
    Пропустить запрос подтверждения.

.PARAMETER DryRun
    Показать изменения без применения.

.EXAMPLE
    .\rename_with_prefix.ps1
    .\rename_with_prefix.ps1 -Action optimize -DryRun
    .\rename_with_prefix.ps1 -Action add-prefix -Force
    .\rename_with_prefix.ps1 -Action rollback
#>

[CmdletBinding(SupportsShouldProcess)]
param(
    [string]$Path   = ".",
    [ValidateSet("optimize", "add-prefix", "optimize-and-prefix", "remove-prefix", "preview", "rollback")]
    [string]$Action = "preview",
    [string]$Prefix = "collab_",
    [switch]$Force,
    [switch]$DryRun
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

# ============================================================
#  КОНФИГУРАЦИЯ
# ============================================================
$Config = @{
    Colors = @{
        Title     = "Cyan"
        Success   = "Green"
        Error     = "Red"
        Warning   = "Yellow"
        Info      = "Gray"
        Highlight = "Magenta"
        Dim       = "DarkGray"
    }

}

# ============================================================
#  ТАБЛИЦА ТРАНСЛИТЕРАЦИИ
#  Используем Dictionary с Ordinal-компаратором, чтобы строчная 'а'
#  и заглавная 'А' хранились как РАЗНЫЕ ключи.
#  Обычный hashtable/@{} в PowerShell регистронезависим — отсюда ошибка
#  "Duplicate keys" при попытке задать оба варианта в литерале.
# ============================================================
$TranslitMap = [System.Collections.Generic.Dictionary[string,string]]::new(
    [System.StringComparer]::Ordinal
)
@(
    'а','a';  'б','b';  'в','v';  'г','g';  'д','d';  'е','e';  'ё','yo'
    'ж','zh'; 'з','z';  'и','i';  'й','y';  'к','k';  'л','l';  'м','m'
    'н','n';  'о','o';  'п','p';  'р','r';  'с','s';  'т','t';  'у','u'
    'ф','f';  'х','kh'; 'ц','ts'; 'ч','ch'; 'ш','sh'; 'щ','sch'
    'ъ','';   'ы','y';  'ь','';   'э','e';  'ю','yu'; 'я','ya'
    'А','A';  'Б','B';  'В','V';  'Г','G';  'Д','D';  'Е','E';  'Ё','Yo'
    'Ж','Zh'; 'З','Z';  'И','I';  'Й','Y';  'К','K';  'Л','L';  'М','M'
    'Н','N';  'О','O';  'П','P';  'Р','R';  'С','S';  'Т','T';  'У','U'
    'Ф','F';  'Х','Kh'; 'Ц','Ts'; 'Ч','Ch'; 'Ш','Sh'; 'Щ','Sch'
    'Ъ','';   'Ы','Y';  'Ь','';   'Э','E';  'Ю','Yu'; 'Я','Ya'
) | ForEach-Object -Begin { $i=0; $buf=$null } -Process {
    if ($i++ % 2 -eq 0) { $buf = $_ } else { $TranslitMap[$buf] = $_ }
}


# ============================================================
#  ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
# ============================================================

function Write-Color {
    param([string]$Message, [string]$Color = "White")
    Write-Host $Message -ForegroundColor $Color
}

function Show-Header {
    param([string]$Title)
    $line = "=" * 70
    Write-Color "`n$line"   $Config.Colors.Title
    Write-Color "  $Title"  $Config.Colors.Title
    Write-Color "$line"     $Config.Colors.Title
}

# ============================================================
#  ТОЧКА ОТКАТА
# ============================================================

function Save-RollbackPoint {
    param([string]$FolderPath)

    $files = Get-ChildItem -Path $FolderPath -File |
             Where-Object { $_.Name -ne (Split-Path $RollbackFile -Leaf) } |
             ForEach-Object { @{ Name = $_.Name; FullName = $_.FullName } }

    [PSCustomObject]@{
        Timestamp = (Get-Date -Format "yyyy-MM-dd HH:mm:ss")
        BasePath  = $FolderPath
        Files     = $files
    } | ConvertTo-Json -Depth 4 | Set-Content -Path $RollbackFile -Encoding UTF8

    Write-Color "  💾 Точка отката сохранена: $RollbackFile" $Config.Colors.Info
}

function Invoke-Rollback {
    param([string]$FolderPath)

    Show-Header "ОТКАТ ИЗМЕНЕНИЙ"

    if (-not (Test-Path $RollbackFile)) {
        Write-Color "  ❌ Файл отката не найден: $RollbackFile" $Config.Colors.Error
        return
    }

    $data = Get-Content $RollbackFile -Encoding UTF8 | ConvertFrom-Json
    Write-Color "  📅 Точка отката от: $($data.Timestamp)" $Config.Colors.Info
    Write-Color "  📊 Файлов в точке отката: $($data.Files.Count)" $Config.Colors.Info

    if (-not $Force) {
        $confirmation = Read-Host "`n❓ Восстановить имена файлов? (y/n)"
        if ($confirmation -ne 'y') {
            Write-Color "  ❌ Операция отменена" $Config.Colors.Warning
            return
        }
    }

    $restored = 0; $errors = 0
    $currentFiles = Get-ChildItem -Path $FolderPath -File |
                    Where-Object { $_.Name -ne (Split-Path $RollbackFile -Leaf) }

    foreach ($entry in $data.Files) {
        # Ищем файл по текущему расположению или подбираем по директории
        $target = @($currentFiles | Where-Object { $_.FullName -eq $entry.FullName }) | Select-Object -First 1
        if (-not $target) {
            # Файл мог быть переименован — ищем по ожидаемому имени в той же папке
            $guessed = Join-Path $FolderPath $entry.Name
            if (Test-Path $guessed) {
                # Уже совпадает — пропускаем
                $restored++
                continue
            }
            Write-Color "  ⚠️ Не найден: $($entry.Name)" $Config.Colors.Warning
            $errors++
            continue
        }
        if ($target.Name -eq $entry.Name) {
            $restored++
            continue  # Уже правильное имя
        }
        try {
            Rename-Item -Path $target.FullName -NewName $entry.Name -ErrorAction Stop
            Write-Color "  ✅ $($target.Name) → $($entry.Name)" $Config.Colors.Success
            $restored++
        }
        catch {
            Write-Color "  ❌ $($target.Name): $($_.Exception.Message)" $Config.Colors.Error
            $errors++
        }
    }

    $color = if ($errors -eq 0) { $Config.Colors.Success } else { $Config.Colors.Warning }
    Write-Color "`n  📊 Восстановлено: $restored, ошибок: $errors" $color
}

# ============================================================
#  ТРАНСЛИТЕРАЦИЯ
# ============================================================

# Определяет, содержит ли строка хотя бы одну кириллическую букву
function Test-HasCyrillic {
    param([string]$Word)
    return $Word -cmatch '[а-яёА-ЯЁ]'
}

# Транслитерирует одно слово посимвольно.
# Слова без кириллицы (латиница, цифры, аббревиатуры вроде NTI/MakerFair)
# возвращаются без изменений — никакой таблицы исключений не нужно.
function Convert-ToLatin {
    param([string]$Word)

    # Нет кириллицы — отдаём как есть
    if (-not (Test-HasCyrillic $Word)) { return $Word }

    $map = $TranslitMap  # Dictionary[string,string] с Ordinal-компаратором
    $sb  = [System.Text.StringBuilder]::new($Word.Length * 2)

    foreach ($ch in $Word.ToCharArray()) {
        $key = [string]$ch
        if ($map.ContainsKey($key)) {
            [void]$sb.Append($map[$key])
        } else {
            # Цифры, дефисы и прочие символы внутри слова — сохраняем
            [void]$sb.Append($ch)
        }
    }

    return $sb.ToString()
}

# ============================================================
#  ОПТИМИЗАЦИЯ ИМЕНИ ФАЙЛА
# ============================================================

function Optimize-Filename {
    param([string]$OriginalName)

    $name = [IO.Path]::GetFileNameWithoutExtension($OriginalName)
    $ext  = [IO.Path]::GetExtension($OriginalName)

    # Защита: пустое имя (файл вида ".gitignore") — возвращаем как есть
    if ([string]::IsNullOrWhiteSpace($name)) { return $OriginalName }

    # Извлекаем год (4 цифры 19xx/20xx)
    $year = ""
    if ($name -match '\b((?:19|20)\d{2})\b') {
        $year = $Matches[1]
        $name = $name -replace ('\b' + [regex]::Escape($year) + '\b'), ''
    }

    # Извлекаем суффикс page_NNN
    $page = ""
    if ($name -match '(page_\d{3})') {
        $page = $Matches[1]
        $name = $name -replace 'page_\d{3}', ''
    }

    # Нормализуем разделители → пробелы
    $name = $name -replace '[-–—_]', ' '
    $name = $name -replace '\s+',    ' '
    $name = $name.Trim()

    # Разбиваем на токены и транслитерируем каждый.
    # Convert-ToLatin автоматически пропускает латиницу/аббревиатуры без изменений.
    $parts = $name -split '\s+' |
             Where-Object { $_ -ne '' } |
             ForEach-Object { Convert-ToLatin -Word $_ }

    # Собираем результат
    $segments = @()
    if ($year)  { $segments += $year }
    $segments  += $parts
    if ($page)  { $segments += $page }

    $newName = ($segments -join '_') -replace '_+', '_'
    $newName = $newName.Trim('_')

    return "$newName$ext"
}

# ============================================================
#  ПОЛУЧЕНИЕ СПИСКА ФАЙЛОВ
# ============================================================

function Get-FilesToProcess {
    param([string]$FolderPath, [string]$ActionName)

    $rollbackLeaf = Split-Path $RollbackFile -Leaf
    $all = Get-ChildItem -Path $FolderPath -File |
           Where-Object { $_.Name -ne $rollbackLeaf } |
           Sort-Object Name

    switch ($ActionName) {
        "add-prefix"    { return @($all | Where-Object { $_.Name -notlike "$Prefix*" }) }
        "remove-prefix" { return @($all | Where-Object { $_.Name -like "$Prefix*" }) }
        "optimize"      { return @($all) }
        default         { return @($all) }
    }
}

# ============================================================
#  ПРЕДПРОСМОТР
# ============================================================

function Show-Preview {
    param([object[]]$Files, [string]$ActionName)

    if (-not $Files -or $Files.Count -eq 0) {
        Write-Color "  ⚠️  Нет файлов для обработки" $Config.Colors.Warning
        return $false
    }

    Write-Color "  📊 Найдено файлов: $($Files.Count)" $Config.Colors.Info
    Write-Color "`n  📝 Примеры (первые 5):" $Config.Colors.Highlight

    $n = 1
    foreach ($file in ($Files | Select-Object -First 5)) {
        $newName = switch ($ActionName) {
            "optimize"             { Optimize-Filename $file.Name }
            "add-prefix"           { "$Prefix$($file.Name)" }
            "optimize-and-prefix"  { "$Prefix$(Optimize-Filename $file.Name)" }
            "remove-prefix"        { $file.Name -replace "^$([regex]::Escape($Prefix))", '' }
        }
        Write-Color "  $n. $($file.Name) → $newName" $Config.Colors.Info
        $n++
    }

    if ($Files.Count -gt 5) {
        Write-Color "  ... и ещё $($Files.Count - 5) файлов" $Config.Colors.Dim
    }
    return $true
}

function Show-FullPreview {
    param([string]$FolderPath)

    $rollbackLeaf = Split-Path $RollbackFile -Leaf
    $all = Get-ChildItem -Path $FolderPath -File |
           Where-Object { $_.Name -ne $rollbackLeaf }

    Show-Header "ПРЕДПРОСМОТР ВСЕХ ФАЙЛОВ"

    $withPrefix    = @($all | Where-Object { $_.Name -like "$Prefix*" })
    $withoutPrefix = @($all | Where-Object { $_.Name -notlike "$Prefix*" })

    Write-Color "  📊 Статистика:" $Config.Colors.Title
    Write-Color "     Всего файлов:          $($all.Count)"            $Config.Colors.Info
    Write-Color "     С префиксом '$Prefix': $($withPrefix.Count)"     $Config.Colors.Success
    Write-Color "     Без префикса:          $($withoutPrefix.Count)"  $Config.Colors.Warning

    if ($withoutPrefix.Count -gt 0) {
        Write-Color "`n  🔄 Примеры оптимизации (optimize):" $Config.Colors.Highlight
        foreach ($file in ($withoutPrefix | Select-Object -First 3)) {
            $opt = Optimize-Filename $file.Name
            Write-Color "     $($file.Name)"  $Config.Colors.Dim
            Write-Color "     → $opt"         $Config.Colors.Success
        }
        Write-Color "`n  🔄 Примеры optimize-and-prefix:" $Config.Colors.Highlight
        foreach ($file in ($withoutPrefix | Select-Object -First 3)) {
            $opt = "$Prefix$(Optimize-Filename $file.Name)"
            Write-Color "     $($file.Name)"  $Config.Colors.Dim
            Write-Color "     → $opt"         $Config.Colors.Success
        }
        if ($withoutPrefix.Count -gt 3) {
            Write-Color "`n  ... и ещё $($withoutPrefix.Count - 3) файлов" $Config.Colors.Info
        }
    }
}

# ============================================================
#  ОБЩАЯ ФУНКЦИЯ ПЕРЕИМЕНОВАНИЯ
# ============================================================

function Invoke-RenameFiles {
    param(
        [string]$FolderPath,
        [string]$ActionName,       # реальное действие — для Show-Preview
        [string]$FilterAction,     # действие для фильтрации файлов (add-prefix / remove-prefix / optimize)
        [string]$HeaderText,
        [string]$ProgressText,
        [scriptblock]$GetNewName
    )

    $files = Get-FilesToProcess -FolderPath $FolderPath -ActionName $FilterAction
    Show-Header $HeaderText
    $hasFiles = Show-Preview -Files $files -ActionName $ActionName
    if (-not $hasFiles) { return }

    if (-not $Force -and -not $DryRun) {
        $confirmation = Read-Host "`n❓ Применить к $($files.Count) файлам? (y/n)"
        if ($confirmation -ne 'y') {
            Write-Color "  ❌ Операция отменена" $Config.Colors.Warning
            return
        }
    }

    if (-not $DryRun) { Save-RollbackPoint -FolderPath $FolderPath }

    $renamed = 0; $errors = 0
    Write-Color "`n  $ProgressText" $Config.Colors.Info

    foreach ($file in $files) {
        $newName = & $GetNewName $file

        if ($DryRun) {
            Write-Color "  🔍 [DRY RUN] $($file.Name) → $newName" $Config.Colors.Highlight
            $renamed++
        } else {
            try {
                Rename-Item -Path $file.FullName -NewName $newName -ErrorAction Stop
                Write-Color "  ✅ $($file.Name) → $newName" $Config.Colors.Success
                $renamed++
            } catch {
                Write-Color "  ❌ $($file.Name): $($_.Exception.Message)" $Config.Colors.Error
                $errors++
            }
        }
    }

    $color = if ($errors -eq 0) { $Config.Colors.Success } else { $Config.Colors.Warning }
    Write-Color "`n  📊 Обработано: $renamed, ошибок: $errors" $color
}

# ============================================================
#  ТОЧКА ВХОДА
# ============================================================

Clear-Host
Write-Color "🚀 ОПТИМИЗАЦИЯ ИМЁН ФАЙЛОВ" $Config.Colors.Title
Write-Color "   Папка : $Path" $Config.Colors.Info
Write-Color "   Режим : $Action"               $Config.Colors.Info
Write-Color "   Префикс: $Prefix"              $Config.Colors.Info
if ($DryRun) { Write-Color "   🔍 РЕЖИМ ПРОСМОТРА (без изменений)" $Config.Colors.Highlight }

if (-not (Test-Path $Path -PathType Container)) {
    Write-Color "❌ Папка не существует: $Path" $Config.Colors.Error
    exit 1
}

# Инициализируем после валидации — теперь $Path гарантированно существует
$Path        = (Resolve-Path $Path).Path
$RollbackFile = Join-Path $Path ".rename_rollback.json"

switch ($Action) {
    "optimize" {
        Invoke-RenameFiles -FolderPath $Path -ActionName "optimize" -FilterAction "optimize" `
            -HeaderText   "ОПТИМИЗАЦИЯ ИМЁН (транслитерация + нормализация)" `
            -ProgressText "Запускаем оптимизацию..." `
            -GetNewName   { param($f) Optimize-Filename $f.Name }
    }
    "add-prefix" {
        Invoke-RenameFiles -FolderPath $Path -ActionName "add-prefix" -FilterAction "add-prefix" `
            -HeaderText   "ДОБАВЛЕНИЕ ПРЕФИКСА '$Prefix'" `
            -ProgressText "Добавляем префикс..." `
            -GetNewName   { param($f) "$Prefix$($f.Name)" }
    }
    "optimize-and-prefix" {
        Invoke-RenameFiles -FolderPath $Path -ActionName "optimize-and-prefix" -FilterAction "add-prefix" `
            -HeaderText   "ОПТИМИЗАЦИЯ + ПРЕФИКС '$Prefix'" `
            -ProgressText "Транслитерируем и добавляем префикс..." `
            -GetNewName   { param($f) "$Prefix$(Optimize-Filename $f.Name)" }
    }
    "remove-prefix" {
        Invoke-RenameFiles -FolderPath $Path -ActionName "remove-prefix" -FilterAction "remove-prefix" `
            -HeaderText   "УДАЛЕНИЕ ПРЕФИКСА '$Prefix'" `
            -ProgressText "Удаляем префикс..." `
            -GetNewName   { param($f) $f.Name -replace "^$([regex]::Escape($Prefix))", '' }
    }
    "rollback" { Invoke-Rollback -FolderPath $Path }
    "preview"  { Show-FullPreview -FolderPath $Path }
}

Write-Color "`n$("=" * 70)" $Config.Colors.Title

if (-not $Force) {
    Write-Color "`n💡 Доступные команды:" $Config.Colors.Info
    Write-Color "   • Предпросмотр         : .\rename_with_prefix.ps1" $Config.Colors.Dim
    Write-Color "   • Оптимизация          : .\rename_with_prefix.ps1 -Action optimize" $Config.Colors.Dim
    Write-Color "   • Добавить префикс     : .\rename_with_prefix.ps1 -Action add-prefix" $Config.Colors.Dim
    Write-Color "   • Оптимизация+префикс  : .\rename_with_prefix.ps1 -Action optimize-and-prefix" $Config.Colors.Dim
    Write-Color "   • Удалить префикс      : .\rename_with_prefix.ps1 -Action remove-prefix" $Config.Colors.Dim
    Write-Color "   • Откат                : .\rename_with_prefix.ps1 -Action rollback" $Config.Colors.Dim
    Write-Color "   • Без изменений        : добавьте -DryRun" $Config.Colors.Dim
    Write-Color "   • Без подтвержд.       : добавьте -Force" $Config.Colors.Dim
}

Read-Host "`nНажмите Enter для выхода"