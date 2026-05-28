# Deployment Quick Guide | Быстрый гайд по деплою

Short operational checklist for agents and maintainers.

## Canonical files

- `.github/workflows/deploy.yml`
- `package.json`
- `scripts/check-deployment.ps1`
- `DEPLOYMENT_GUIDE.md`
- `versions.json`

## Pre-deploy checks

```bash
npm run build
npm run deploy:check
```

## Deployment trigger

- Push to `main` triggers workflow.
- `create-release` job runs only when `versions.json` changed.

## Monitoring

- GitHub Actions UI: [repo actions](https://github.com/odadream/odadream-site/actions)
- Validate production: [odadream.art](https://odadream.art)

## If deployment failed

1. Reproduce locally with `npm run build`
2. Fix root cause in code/config/content
3. Re-run checks
4. Re-trigger workflow only after fix

## Safety constraints

- No `git reset --hard`
- No force push
- No tag deletion
- No commit/push unless user explicitly asked
