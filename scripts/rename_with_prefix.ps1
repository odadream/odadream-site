param(
    [Parameter(Mandatory=$false)]
    [string]$Path = "D:\YandexDisk\_ODA2\Благодарности\optimized",
    
    [Parameter(Mandatory=$false)]
    [ValidateSet("add", "remove", "preview")]
    [string]$Action = "preview",
    
    [Parameter(Mandatory=$false)]
    [switch]$Force
)

# Цвета для вывода
$Colors = @{
    Title = "Cyan"
    Success = "Green"
    Error = "Red"
    Warning = "Yellow"
    Info = "Gray"
    Highlight = "Magenta"
}

function Write-Color {
    param(
        [string]$Message,
        [string]$Color = "White"
    )
    Write-Host $Message -ForegroundColor $Color
}

function Show-Header {
    param([string]$Title)
    Write-Color "`n$("=" * 60)" $Colors.Title
    Write-Color "  $Title" $Colors.Title
    Write-Color "$("=" * 60)" $Colors.Title
}

function Show-Example {
    param(
        [string]$OriginalName,
        [string]$NewName,
        [string]$Action
    )
    
    if ($Action -eq "add") {
        Write-Color "  📄 Было: $OriginalName" $Colors.Info
        Write-Color "  ✨ Станет: collab_$OriginalName" $Colors.Highlight
    } else {
        # Убираем префикс collab_
        $newName = $OriginalName -replace '^collab_', ''
        Write-Color "  📄 Было: $OriginalName" $Colors.Info
        Write-Color "  ↩️ Станет: $newName" $Colors.Highlight
    }
}

function Get-FilesToProcess {
    param(
        [string]$FolderPath,
        [string]$Action
    )
    
    $allFiles = Get-ChildItem -Path $FolderPath -File | Sort-Object Name
    
    if ($Action -eq "add") {
        # Для добавления: все файлы без префикса
        return $allFiles | Where-Object { $_.Name -notlike "collab_*" }
    }
    elseif ($Action -eq "remove") {
        # Для удаления: только файлы с префиксом
        return $allFiles | Where-Object { $_.Name -like "collab_*" }
    }
    else {
        # Для preview: показываем все
        return $allFiles
    }
}

function Show-Preview {
    param(
        [array]$Files,
        [string]$Action
    )
    
    if ($Files.Count -eq 0) {
        if ($Action -eq "add") {
            Write-Color "  ⚠️ Нет файлов для добавления префикса (все уже с префиксом?)" $Colors.Warning
        } elseif ($Action -eq "remove") {
            Write-Color "  ⚠️ Нет файлов с префиксом для удаления" $Colors.Warning
        }
        return $false
    }
    
    Write-Color "  Найдено файлов для обработки: $($Files.Count)" $Colors.Info
    Write-Color "  Примеры (первые 5):" $Colors.Info
    
    $count = 0
    foreach ($file in $Files | Select-Object -First 5) {
        Show-Example -OriginalName $file.Name -Action $Action
        $count++
    }
    
    if ($Files.Count -gt 5) {
        Write-Color "  ... и еще $($Files.Count - 5) файлов" $Colors.Info
    }
    
    return $true
}

function Add-Prefix {
    param(
        [string]$FolderPath,
        [bool]$ForceAction
    )
    
    $files = Get-FilesToProcess -FolderPath $FolderPath -Action "add"
    
    Show-Header "ДОБАВЛЕНИЕ ПРЕФИКСА 'collab_'"
    $hasFiles = Show-Preview -Files $files -Action "add"
    
    if (-not $hasFiles) {
        return
    }
    
    if (-not $ForceAction) {
        $confirmation = Read-Host "`n❓ Добавить префикс к $($files.Count) файлам? (y/n)"
        if ($confirmation -ne 'y') {
            Write-Color "  ❌ Операция отменена" $Colors.Error
            return
        }
    }
    
    $renamed = 0
    $errors = 0
    
    Write-Color "`n  Начинаем переименование..." $Colors.Info
    
    foreach ($file in $files) {
        $oldName = $file.Name
        $newName = "collab_" + $oldName
        
        try {
            Rename-Item -Path $file.FullName -NewName $newName -ErrorAction Stop
            Write-Color "  ✅ $oldName" $Colors.Success
            $renamed++
        }
        catch {
            Write-Color "  ❌ $oldName - $($_.Exception.Message)" $Colors.Error
            $errors++
        }
    }
    
    Write-Color "`n  📊 Результат: переименовано $renamed, ошибок $errors" $(if ($errors -eq 0) { $Colors.Success } else { $Colors.Warning })
}

function Remove-Prefix {
    param(
        [string]$FolderPath,
        [bool]$ForceAction
    )
    
    $files = Get-FilesToProcess -FolderPath $FolderPath -Action "remove"
    
    Show-Header "УДАЛЕНИЕ ПРЕФИКСА 'collab_'"
    $hasFiles = Show-Preview -Files $files -Action "remove"
    
    if (-not $hasFiles) {
        return
    }
    
    if (-not $ForceAction) {
        $confirmation = Read-Host "`n❓ Удалить префикс у $($files.Count) файлов? (y/n)"
        if ($confirmation -ne 'y') {
            Write-Color "  ❌ Операция отменена" $Colors.Error
            return
        }
    }
    
    $renamed = 0
    $errors = 0
    
    Write-Color "`n  Начинаем переименование..." $Colors.Info
    
    foreach ($file in $files) {
        $oldName = $file.Name
        $newName = $oldName -replace '^collab_', ''
        
        try {
            Rename-Item -Path $file.FullName -NewName $newName -ErrorAction Stop
            Write-Color "  ✅ $oldName" $Colors.Success
            Write-Color "     ↩️ $newName" $Colors.Info
            $renamed++
        }
        catch {
            Write-Color "  ❌ $oldName - $($_.Exception.Message)" $Colors.Error
            $errors++
        }
    }
    
    Write-Color "`n  📊 Результат: переименовано $renamed, ошибок $errors" $(if ($errors -eq 0) { $Colors.Success } else { $Colors.Warning })
}

function Show-FullPreview {
    param([string]$FolderPath)
    
    $allFiles = Get-FilesToProcess -FolderPath $FolderPath -Action "preview"
    
    Show-Header "ПРЕДПРОСМОТР ВСЕХ ФАЙЛОВ"
    
    $filesWithPrefix = $allFiles | Where-Object { $_.Name -like "collab_*" }
    $filesWithoutPrefix = $allFiles | Where-Object { $_.Name -notlike "collab_*" }
    
    Write-Color "  📊 Статистика:" $Colors.Title
    Write-Color "     Всего файлов: $($allFiles.Count)" $Colors.Info
    Write-Color "     С префиксом: $($filesWithPrefix.Count)" $Colors.Success
    Write-Color "     Без префикса: $($filesWithoutPrefix.Count)" $Colors.Warning
    
    if ($filesWithoutPrefix.Count -gt 0) {
        Write-Color "`n  🔜 Будут переименованы (при добавлении префикса):" $Colors.Highlight
        $count = 0
        foreach ($file in $filesWithoutPrefix | Select-Object -First 5) {
            Write-Color "     $($file.Name) -> collab_$($file.Name)" $Colors.Info
            $count++
        }
        if ($filesWithoutPrefix.Count -gt 5) {
            Write-Color "     ... и еще $($filesWithoutPrefix.Count - 5) файлов" $Colors.Info
        }
    }
    
    if ($filesWithPrefix.Count -gt 0) {
        Write-Color "`n  ↩️ Будут возвращены (при удалении префикса):" $Colors.Highlight
        $count = 0
        foreach ($file in $filesWithPrefix | Select-Object -First 5) {
            $newName = $file.Name -replace '^collab_', ''
            Write-Color "     $($file.Name) -> $newName" $Colors.Info
            $count++
        }
        if ($filesWithPrefix.Count -gt 5) {
            Write-Color "     ... и еще $($filesWithPrefix.Count - 5) файлов" $Colors.Info
        }
    }
}

# Основная логика
Clear-Host
Write-Color "🚀 УПРАВЛЕНИЕ ПРЕФИКСОМ 'collab_' ДЛЯ ФАЙЛОВ" $Colors.Title
Write-Color "   Папка: $Path" $Colors.Info

# Проверяем существование папки
if (-not (Test-Path $Path)) {
    Write-Color "❌ Папка не существует: $Path" $Colors.Error
    exit 1
}

# Выполняем действие
switch ($Action) {
    "add" {
        Add-Prefix -FolderPath $Path -ForceAction $Force
    }
    "remove" {
        Remove-Prefix -FolderPath $Path -ForceAction $Force
    }
    "preview" {
        Show-FullPreview -FolderPath $Path
    }
}

Write-Color "`n$("=" * 60)" $Colors.Title

if (-not $Force) {
    Write-Color "💡 Подсказки:" $Colors.Info
    Write-Color "   • Для добавления префикса: .\manage_collab_prefix.ps1 -Action add" $Colors.Info
    Write-Color "   • Для удаления префикса: .\manage_collab_prefix.ps1 -Action remove" $Colors.Info
    Write-Color "   • Для пропуска подтверждения: добавьте -Force" $Colors.Info
}

Read-Host "`nНажмите Enter для выхода"