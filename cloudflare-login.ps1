# Cloudflare Wrangler 互動式登入（會開瀏覽器或顯示授權網址）
# 在專案根目錄執行：
#   powershell -ExecutionPolicy Bypass -File .\cloudflare-login.ps1
$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot
if (-not (Test-Path .\package.json)) {
  Write-Error '請在 paul''s-experimental-lab (2) 根目錄執行此腳本。'
  exit 1
}
if (-not (Test-Path .\node_modules\wrangler)) {
  Write-Host '正在安裝依賴...'
  npm install
}
npx wrangler login
