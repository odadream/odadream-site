# Deployment Quick Guide | Быстрое Руководство

**For Pages Keeper Agent**

---

## Problem: Last Deployment Failed | Проблема: Последний Деплой Провалился

### Immediate Action | Немедленные Действия

```bash
# 1. Run automated health check
npm run deploy:check
```

This will:
- ✅ Check git status
- ✅ Test local build
- ✅ Check TypeScript
- ✅ Verify live site

### Common Issues & Fixes | Частые Проблемы и Решения

#### 1. TypeScript Errors

**Symptom:**
```
error TS2322: Type 'X' is not assignable to type 'Y'
```

**Fix:**
```bash
npx tsc --noEmit  # See all errors
# Fix errors in code
npm run build     # Test
```

#### 2. Dependency Conflicts

**Symptom:**
```
Type conflicts between packages
```

**Fix:**
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

#### 3. Build Succeeds Locally, Fails on GitHub

**Symptom:**
- ✅ Local: `npm run build` works
- ❌ GitHub Actions: build fails

**Fix:**
```bash
# Check for uncommitted files
git status

# Ensure package-lock.json is committed
git add package-lock.json
git commit -m "fix: update lockfile"
git push
```

---

## GitHub CLI (Optional) | GitHub CLI (Опционально)

### Installation

**Windows:**
```powershell
winget install --id GitHub.cli
```

### Quick Commands

```bash
# After installation, authenticate
gh auth login

# View recent deployments
gh run list --limit 5

# Watch current deployment
gh run watch

# View failed run logs
gh run view [run-id] --log

# Re-trigger deployment
gh workflow run deploy.yml
```

---

## Without GitHub CLI | Без GitHub CLI

### Web Monitoring

1. **GitHub Actions Dashboard:**
   https://github.com/odadream/odadream-site/actions

2. **Click latest workflow run**

3. **Check each job:**
   - check-version
   - build-and-deploy
   - create-release

4. **View logs** for failed jobs

---

## Standard Deployment Flow | Стандартный Процесс

```bash
# 1. Check health
npm run deploy:check

# 2. If OK, commit and push
git add .
git commit -m "fix: description"
git push origin main

# 3. Monitor (choose one):
# Option A: GitHub CLI
gh run watch

# Option B: Web interface
# https://github.com/odadream/odadream-site/actions

# Option C: Wait 5 min, then check
npm run deploy:check
```

---

## Emergency Rollback | Аварийный Откат

```bash
# Find last working commit
git log --oneline

# Revert to it
git revert HEAD

# Or force rollback (CAREFUL!)
git reset --hard <commit-hash>
git push --force origin main
```

---

## Key Files | Ключевые Файлы

- `scripts/check-deployment.ps1` - Health check script
- `.github/workflows/deploy.yml` - CI/CD pipeline
- `DEPLOYMENT_GUIDE.md` - Full documentation
- `.cursor/PAGES_KEEPER.md` - Agent instructions

---

## Success Criteria | Критерии Успеха

After deployment:
- [ ] GitHub Actions: all jobs green ✅
- [ ] Site accessible: https://odadream.art
- [ ] Navigation works
- [ ] No console errors
- [ ] Version updated (if applicable)

---

**Pages Keeper Agent | ODA.dream**
