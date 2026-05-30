# Scripts Directory | Директория Скриптов

**ODA.dream Automation Utilities**

---

## Deployment Scripts | Скрипты Деплоя

### check-deployment.ps1 / check-deployment.sh

**Purpose:** Automated deployment health check

**Usage:**
```bash
# Via npm
npm run deploy:check

# Direct (Windows)
powershell -ExecutionPolicy Bypass -File scripts/check-deployment.ps1

# Direct (Linux/Mac)
bash scripts/check-deployment.sh
```

**What it checks:**
1. Git status (uncommitted changes)
2. Last commit info
3. Local build success
4. TypeScript compilation
5. Live site accessibility

**Exit codes:**
- `0` - All checks passed
- `1` - Build or TypeScript errors found

---

## Asset Generation Scripts | Скрипты Генерации Ассетов

### generate-assets.js

**Purpose:** Generate procedural SVG backgrounds for nodes

**Usage:**
```bash
npm run assets:generate
```

**Algorithm:**
- Seeded random based on node ID
- Vibrant Art Engine (cyberpunk aesthetic)
- Consistent output for same ID

**Output:** `public/images/nodes/{node-id}.svg`

### generate-map.js

**Purpose:** Visualize content tree structure

**Usage:**
```bash
npm run assets:map
```

**Output:** ASCII tree showing all nodes and their relationships

**Use cases:**
- Find orphaned nodes
- Verify graph structure
- Debug navigation issues

---

## Version Management Scripts | Скрипты Управления Версиями

### update-version.js

**Purpose:** Synchronize version across all files

**Usage:**
```bash
npm run version:sync
```

**Synchronizes:**
- `package.json` → version
- `src/constants.ts` → SITE_VERSION
- `README.md` → version badge
- `metadata.json` → name, description
- `src/content/changelog.md` → full changelog

**Source of truth:** `versions.json`

### sync-dates.js

**Purpose:** Synchronize dates in content files

**Usage:**
```bash
npm run dates:sync
```

**Updates:**
- Frontmatter `date` fields
- Changelog entries
- Version history

---

## Script Dependencies | Зависимости Скриптов

### Node.js Scripts
- `node` (v20+)
- `fs`, `path` (built-in)
- Project dependencies (from package.json)

### PowerShell Scripts
- PowerShell 5.1+ (Windows)
- `npm` (for build commands)
- `git` (for repository info)
- `curl` or `Invoke-WebRequest` (for site checks)

### Bash Scripts
- Bash 4.0+ (Linux/Mac)
- `npm` (for build commands)
- `git` (for repository info)
- `curl` (for site checks)

---

## Adding New Scripts | Добавление Новых Скриптов

### Guidelines

1. **Name:** Use kebab-case (e.g., `check-deployment.ps1`)
2. **Documentation:** Add header comment with purpose
3. **Error handling:** Exit with non-zero code on failure
4. **Output:** Use clear, colored output
5. **npm script:** Add to `package.json` scripts

### Template (PowerShell)

```powershell
# Script Name
# Purpose: Brief description

Write-Host "=== Script Name ===" -ForegroundColor Cyan

# Your logic here

if ($success) {
    Write-Host "OK: Success message" -ForegroundColor Green
    exit 0
} else {
    Write-Host "ERROR: Error message" -ForegroundColor Red
    exit 1
}
```

### Template (Bash)

```bash
#!/bin/bash
# Script Name
# Purpose: Brief description

echo -e "\033[1;36m=== Script Name ===\033[0m"

# Your logic here

if [ $? -eq 0 ]; then
    echo -e "\033[1;32mOK: Success message\033[0m"
    exit 0
else
    echo -e "\033[1;31mERROR: Error message\033[0m"
    exit 1
fi
```

---

## Troubleshooting | Решение Проблем

### PowerShell Execution Policy

**Error:**
```
cannot be loaded because running scripts is disabled
```

**Fix:**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Script Not Found

**Error:**
```
The term 'script-name' is not recognized
```

**Fix:**
```bash
# Ensure you're in project root
cd /path/to/odadream-site

# Run with explicit path
npm run script-name
```

### Permission Denied (Linux/Mac)

**Error:**
```
Permission denied: ./script.sh
```

**Fix:**
```bash
chmod +x scripts/script.sh
```

---

## Best Practices | Лучшие Практики

### Script Development

1. **Test locally** before committing
2. **Handle errors** gracefully
3. **Provide clear output** with colors
4. **Document usage** in header comments
5. **Add to package.json** for easy access

### Script Execution

1. **Always run from project root**
2. **Check exit codes** in CI/CD
3. **Log output** for debugging
4. **Use npm scripts** when available
5. **Keep scripts idempotent** (safe to run multiple times)

---

## Future Enhancements | Будущие Улучшения

### Planned Scripts

- `validate-content.js` - Validate all markdown files
- `pack-image.js` — WebP master + thumb (`npm run image:pack -- "<file>" -- --out public/images/content/works/name`)
- `check-links.js` - Find broken links
- `generate-sitemap.js` - Generate sitemap.xml
- `analyze-bundle.js` - Analyze build size

### Automation Ideas

- Pre-commit hooks (lint, format, validate)
- Post-deploy smoke tests
- Automated screenshot comparison
- Performance monitoring
- SEO validation

---

**Scripts Directory | ODA.dream**  
**Maintained by Pages Keeper Agent**
