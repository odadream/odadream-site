#!/bin/bash
# Deployment Health Check Script (Linux/Mac version)
# Проверка здоровья деплоя ODA.dream

echo -e "\033[1;36m=== ODA.dream Deployment Health Check ===\033[0m"
echo ""

# 1. Check Git Status
echo -e "\033[1;33m[1/5] Checking Git Status...\033[0m"
if [[ -n $(git status --porcelain) ]]; then
    echo -e "⚠️  Uncommitted changes detected:"
    git status --short
else
    echo -e "\033[1;32m✅ Git status clean\033[0m"
fi
echo ""

# 2. Check Last Commit
echo -e "\033[1;33m[2/5] Last Commit Info...\033[0m"
lastCommit=$(git log -1 --pretty=format:"%h - %s (%cr by %an)")
echo -e "📝 $lastCommit"
echo ""

# 3. Test Local Build
echo -e "\033[1;33m[3/5] Testing Local Build...\033[0m"
echo -e "\033[0;37mRunning: npm run build\033[0m"

if npm run build > /dev/null 2>&1; then
    echo -e "\033[1;32m✅ Local build successful\033[0m"
else
    echo -e "\033[1;31m❌ Local build failed!\033[0m"
    echo -e "\033[1;31mRun 'npm run build' manually to see errors\033[0m"
    exit 1
fi
echo ""

# 4. Check TypeScript
echo -e "\033[1;33m[4/5] Checking TypeScript...\033[0m"
if npx tsc --noEmit > /dev/null 2>&1; then
    echo -e "\033[1;32m✅ TypeScript check passed\033[0m"
else
    echo -e "\033[1;31m❌ TypeScript errors found!\033[0m"
    npx tsc --noEmit
fi
echo ""

# 5. Check Site Accessibility
echo -e "\033[1;33m[5/5] Checking Live Site...\033[0m"
statusCode=$(curl -s -o /dev/null -w "%{http_code}" https://odadream.art)
if [[ $statusCode -eq 200 ]]; then
    echo -e "\033[1;32m✅ Site is accessible (HTTP $statusCode)\033[0m"
else
    echo -e "\033[1;31m❌ Site returned HTTP $statusCode\033[0m"
fi
echo ""

# Summary
echo -e "\033[1;36m=== Summary ===\033[0m"
echo "Repository: odadream/odadream-site"
echo "Branch: $(git branch --show-current)"
echo "Last commit: $lastCommit"
echo ""
echo -e "\033[1;33mNext steps:\033[0m"
echo "1. Check GitHub Actions: https://github.com/odadream/odadream-site/actions"
echo "2. View latest workflow run for detailed logs"
echo "3. If build failed locally, fix errors before pushing"
echo ""
