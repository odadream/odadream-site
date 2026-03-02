# Deployment Automation Guide | Руководство по Автоматизации Деплоя

**ODA.dream Pages Keeper System**  
**Version:** 1.0.0

---

## Quick Start | Быстрый Старт

### Automated Health Check | Автоматическая Проверка

```bash
# Run full deployment health check
npm run deploy:check
```

This command will:
1. ✅ Check git status
2. ✅ Verify last commit
3. ✅ Test local build
4. ✅ Check TypeScript
5. ✅ Verify live site accessibility

---

## GitHub CLI (Optional) | GitHub CLI (Опционально)

### Installation | Установка

**Windows (winget):**
```powershell
winget install --id GitHub.cli
```

**Windows (Scoop):**
```powershell
scoop install gh
```

**Manual Download:**
https://cli.github.com/

### Authentication | Аутентификация

```bash
gh auth login
```

Follow the prompts to authenticate with GitHub.

### Useful Commands | Полезные Команды

```bash
# View recent workflow runs
gh run list --limit 10

# View specific run details
gh run view [run-id]

# View logs for failed run
gh run view [run-id] --log

# Re-run failed workflow
gh run rerun [run-id]

# Watch workflow in real-time
gh run watch

# Trigger manual deployment
gh workflow run deploy.yml
```

---

## Without GitHub CLI | Без GitHub CLI

You can monitor deployments through the web interface:

**GitHub Actions Dashboard:**
https://github.com/odadream/odadream-site/actions

**Latest Workflow Run:**
https://github.com/odadream/odadream-site/actions/workflows/deploy.yml

---

## Deployment Workflow | Рабочий Процесс Деплоя

### Pre-Deployment Checklist | Чеклист Перед Деплоем

```bash
# 1. Check current status
npm run deploy:check

# 2. Test build locally
npm run build

# 3. Preview production build
npm run preview
# Open http://localhost:4173 and test

# 4. If everything works, commit and push
git add .
git commit -m "fix: your changes"
git push origin main
```

### Monitoring Deployment | Мониторинг Деплоя

**Option 1: GitHub CLI (if installed)**
```bash
gh run watch
```

**Option 2: Web Interface**
1. Go to https://github.com/odadream/odadream-site/actions
2. Click on the latest workflow run
3. Monitor each job:
   - ✅ check-version
   - ✅ build-and-deploy
   - ✅ create-release (if version changed)

**Option 3: Automated Script**
```bash
npm run deploy:check
```

### Post-Deployment Verification | Проверка После Деплоя

```bash
# Check site is live
curl -I https://odadream.art

# Or open in browser
start https://odadream.art
```

**Manual checks:**
- [ ] Home page loads
- [ ] Navigation works
- [ ] Images display correctly
- [ ] No console errors (F12)
- [ ] No 404 errors

---

## Troubleshooting | Решение Проблем

### Build Failed | Сборка Провалилась

**Symptom:** GitHub Actions shows red X on build-and-deploy job

**Solution:**
```bash
# 1. Run local health check
npm run deploy:check

# 2. Check TypeScript errors
npx tsc --noEmit

# 3. Fix errors in code

# 4. Test build locally
npm run build

# 5. Commit and push fix
git add .
git commit -m "fix: build errors"
git push origin main
```

### Deployment Failed | Деплой Провалился

**Symptom:** Build succeeded but deployment failed

**Solution:**
1. Check GitHub Pages settings:
   - Settings → Pages
   - Source: GitHub Actions
   - Enforce HTTPS: Enabled

2. Check repository permissions:
   - Settings → Actions → General
   - Workflow permissions: Read and write

3. Re-trigger deployment:
```bash
git commit --allow-empty -m "chore: trigger deployment"
git push origin main
```

### Site Not Updating | Сайт Не Обновляется

**Symptom:** Deployment succeeded but site shows old content

**Solution:**
1. Wait 5-10 minutes (CDN propagation)
2. Hard refresh browser: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
3. Check with cache-busting: https://odadream.art/?v=timestamp
4. Verify deployment timestamp in GitHub Actions

### TypeScript Errors | Ошибки TypeScript

**Common Issue:** Type conflicts after dependency updates

**Solution:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Or on Windows PowerShell
Remove-Item -Recurse -Force node_modules, package-lock.json
npm install

# Test build
npm run build
```

---

## Performance Monitoring | Мониторинг Производительности

### Build Time Metrics | Метрики Времени Сборки

**Target:** < 5 minutes from push to live

**Breakdown:**
- Checkout: ~10 sec
- Setup: ~20 sec
- Cache restore: ~10 sec
- Install (cache hit): ~30 sec
- Build: ~2 min
- Upload: ~30 sec
- Deploy: ~1 min

**Total:** ~4-5 minutes ✅

### Optimization Tips | Советы по Оптимизации

1. **Maximize cache hits:**
   - Don't modify `package-lock.json` unnecessarily
   - Cache is invalidated when lockfile changes

2. **Batch commits:**
   - Group related changes into single push
   - Reduces number of deployments

3. **Test locally first:**
   - Always run `npm run deploy:check` before pushing
   - Prevents failed deployments

---

## Automated Monitoring Setup | Настройка Автоматического Мониторинга

### Option 1: GitHub CLI + Watch Script

Create `scripts/watch-deployment.ps1`:

```powershell
# Watch latest deployment
Write-Host "Watching latest deployment..." -ForegroundColor Cyan
gh run watch

# After completion, check site
Write-Host "Checking live site..." -ForegroundColor Yellow
$response = Invoke-WebRequest -Uri "https://odadream.art" -Method Head
if ($response.StatusCode -eq 200) {
    Write-Host "OK: Site is live!" -ForegroundColor Green
} else {
    Write-Host "WARNING: Site returned HTTP $($response.StatusCode)" -ForegroundColor Yellow
}
```

### Option 2: Status Badge in README

Add to `README.md`:

```markdown
![Deployment Status](https://github.com/odadream/odadream-site/actions/workflows/deploy.yml/badge.svg)
```

### Option 3: External Uptime Monitoring

**Free services:**
- UptimeRobot (https://uptimerobot.com/)
- Pingdom (https://www.pingdom.com/)
- StatusCake (https://www.statuscake.com/)

**Setup:**
1. Create account
2. Add monitor for https://odadream.art
3. Set check interval: 5 minutes
4. Configure email/SMS alerts

---

## Emergency Procedures | Аварийные Процедуры

### Emergency Rollback | Аварийный Откат

**When:** Critical bug in production

**Steps:**
```bash
# 1. Find last working commit
git log --oneline

# 2. Revert to last working state
git revert HEAD

# Or force rollback (DANGEROUS!)
git reset --hard <commit-hash>
git push --force origin main

# 3. Monitor deployment
npm run deploy:check
```

### Site Down | Сайт Недоступен

**Steps:**
1. Check GitHub Status: https://www.githubstatus.com/
2. Check GitHub Pages status:
   ```bash
   gh api repos/odadream/odadream-site/pages
   ```
3. If GitHub issue: Wait for resolution
4. If our issue: Check DNS, CNAME, deployment logs

---

## Best Practices | Лучшие Практики

### Always | Всегда

- ✅ Test build locally before pushing (`npm run deploy:check`)
- ✅ Monitor deployment completion
- ✅ Verify site after deployment
- ✅ Keep workflow file clean
- ✅ Document changes

### Never | Никогда

- ❌ Push directly to main without testing
- ❌ Ignore build warnings
- ❌ Skip post-deployment checks
- ❌ Modify workflow without understanding
- ❌ Force push to main (except emergencies)

---

## Success Metrics | Метрики Успеха

### Deployment Reliability
- **Target:** 99.9% success rate
- **Measure:** Successful deploys / Total deploys

### Deployment Speed
- **Target:** < 5 minutes
- **Measure:** Time from push to live

### Site Uptime
- **Target:** 99.9%
- **Measure:** Uptime monitoring service

### Build Performance
- **Target:** Cache hit rate > 80%
- **Measure:** Cache hits / Total builds

---

## Quick Reference | Быстрая Справка

### Essential Commands

```bash
# Health check
npm run deploy:check

# Build locally
npm run build

# Preview production
npm run preview

# GitHub CLI (if installed)
gh run list           # List recent runs
gh run view           # View latest run
gh run watch          # Watch in real-time
gh workflow run deploy.yml  # Trigger manual deployment
```

### Key URLs

- **Live Site:** https://odadream.art
- **GitHub Actions:** https://github.com/odadream/odadream-site/actions
- **Workflow File:** https://github.com/odadream/odadream-site/blob/main/.github/workflows/deploy.yml
- **GitHub Pages Settings:** https://github.com/odadream/odadream-site/settings/pages

---

## Contact | Контакты

**Pages Keeper Agent**  
**ODA.dream Multi-Agent System**

For critical issues, escalate to DevOps Lead Agent.

---

**"From code to consciousness, seamlessly."**

_The bridge between code and reality._
