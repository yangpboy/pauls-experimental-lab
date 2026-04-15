# 更新既有 Cloudflare Pages：`pauls-experimental-lab`

此資料夾的 `wrangler.toml` 已設為 **`name = "pauls-experimental-lab"`**，與你帳號裡**既有**的 Pages 專案同名；本機執行 `npm run deploy` 時也會對應到該專案。

採用 **Dashboard → Connect to Git** 時，請讓 Cloudflare **連到會收到本專案程式碼的同一個 GitHub 儲存庫**，這樣 push 後會自動建置並更新 **pauls-experimental-lab**。

## 一、把本資料夾推上 GitHub（你本機執行）

在 **`paul…-experimental-lab (2)`** 目錄：

```powershell
npm install
npm run build
git init
git branch -M main
git add -A
git commit -m "feat: update site (v2 content) for pauls-experimental-lab"
```

**若你已有**連到 Cloudflare 的 repo（例如 `https://github.com/你/pauls-experimental-lab.git`），不要新建空 repo，改為：

```powershell
git remote add origin https://github.com/你/既有repo.git
git fetch origin
# 若遠端已有歷史且你要以本機覆蓋 main（請先確認遠端沒有要保留的未備份變更）：
# git push -u origin main --force
# 若遠端是空的或同意合併，則：
git pull origin main --rebase
git push -u origin main
```

依你實際分支名稱調整（Cloudflare 上設定的「Production branch」須與你 push 的分支一致，常見為 `main`）。

## 二、Cloudflare Dashboard（方法二：Connect to Git）

1. 登入 [Cloudflare Dashboard](https://dash.cloudflare.com) → **Workers & Pages**。
2. 點進現有專案 **pauls-experimental-lab**（不要新建另一個專案）。
3. 開啟 **Settings**（或 **Builds & deployments** / **Connected Git repository`，依介面為準）。
4. **Connect to Git**（若尚未連線）→ 授權 GitHub → 選取**上面 push 的那個 repo**。
5. 建置設定：
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Root directory:** `/`
6. **Production branch** 設成你實際部署分支（例如 `main`）。
7. 儲存；可手動 **Retry deployment** 或再 push 一次觸發建置。

若專案**已經**連過 Git，只需把本資料夾內容 push 到**同一個 repo／同一分支**，Cloudflare 會自動建新部署，**不需**在 Dashboard 再建一個專案。

## 三、本機 Wrangler 直接上傳（與 Git 無關時）

```powershell
npx wrangler login
npm run deploy
```

此方式也會更新 **`pauls-experimental-lab`**（與 `wrangler.toml` 的 `name` 一致）。

## 四、備註

- SPA 路由依賴 **`public/_redirects`**（已包含在此專案中）。
- 建置成功後請將 **`package-lock.json`** 一併 commit，方便重現依賴版本。
