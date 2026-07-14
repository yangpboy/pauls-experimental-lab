# Portfolio CMS architecture and Cloudflare setup

## Repository audit

- Framework: Vite 5 + React 18 + TypeScript + Tailwind CSS. There was no routing library.
- Routing before the CMS change: `src/App.tsx` switched Head, Garage, About, and Sketchbook with React state. There was no routing library. Pages now uses its built-in SPA fallback for `/admin` and `/projects/:slug` (a top-level `404.html` is intentionally not present).
- Portfolio data before the CMS change: five projects were hard-coded in `src/data/garage.ts`. That file has been removed after its content was converted into `migrations/0002_seed_existing_projects.sql`.
- Images: static portfolio media remains in `public/works/**`; shared site media is in `public/**` and `public/icons/**`. The database stores URLs only.
- Deployment: `wrangler.toml` names the existing Pages project `pauls-experimental-lab`; Git-connected Pages builds with `npm run build` and publishes `dist`. `scripts/bundle-pages-functions.mjs` compiles file-based Functions into `dist/_worker.js` plus `dist/_routes.json`, so Git deployments include API routes in Pages advanced mode. `npm run deploy` remains available for a direct Wrangler deploy.
- Server code before the CMS change: none. There was no `functions/` directory and no API.

## New runtime layout

- `migrations/0001_cms_schema.sql`: `projects`, `project_blocks`, and `assets` schema.
- `migrations/0002_seed_existing_projects.sql`: migrates the five current projects and their image sequences into D1.
- `functions/api/projects/**`: published-only public reads.
- `functions/api/admin/**`: Access-protected CRUD, reorder, draft reads, and media upload.
- `functions/_shared/**`: D1 mapping, validation, response, and runtime types.
- `src/types/cms.ts`: shared browser-side project and block shapes.
- `src/lib/api.ts`: same-origin API client; no API token is embedded in the browser bundle.
- `src/admin/AdminApp.tsx`: `/admin` project list, metadata editor, ordered block editor, Save Draft, Publish, delete, reorder, and cover upload.
- `src/components/ProjectRenderer.tsx`: hero, text, image, gallery, video, quote, twoColumn, and process renderer.
- `src/App.tsx`: keeps the existing visual shell, loads published projects from `/api/projects`, and serves project permalinks at `/projects/:slug`.

The required endpoints are:

- `GET /api/projects`
- `GET /api/projects/:slug`
- `POST /api/admin/projects`
- `PUT /api/admin/projects/:id`
- `DELETE /api/admin/projects/:id`
- `PUT /api/admin/projects/reorder`

The editor also uses these protected support endpoints:

- `GET /api/admin/projects`
- `GET /api/admin/projects/:id`
- `POST /api/admin/assets/upload`

The existing like/share controls also persist their counters through these public interaction endpoints:

- `POST /api/projects/:slug/like`
- `DELETE /api/projects/:slug/like`
- `POST /api/projects/:slug/share`

## 1. Create and migrate D1

From the repository root:

```powershell
npx wrangler login
npx wrangler d1 create pauls-portfolio-cms
```

Set the database ID returned by Cloudflare in the active `[[d1_databases]]` section of `wrangler.toml`. Keep the binding name exactly `DB`; deployments should not use a placeholder value.

Apply both migrations to the remote database:

```powershell
npx wrangler d1 migrations apply pauls-portfolio-cms --remote
```

For local Pages Functions development, apply them locally too:

```powershell
npx wrangler d1 migrations apply DB --local
Copy-Item .dev.vars.example .dev.vars
npm run pages:dev
```

Use `pages:dev`, not the Vite-only `npm run dev`, when testing API or D1 behavior.

## 2. Bind D1 in a Git-connected Pages project

If binding through the dashboard, open Workers & Pages → `pauls-experimental-lab` → Settings → Bindings, add a D1 binding named `DB`, select `pauls-portfolio-cms`, save, and redeploy. Keep Dashboard and `wrangler.toml` consistent. Production and preview bindings should be set deliberately; use a separate preview D1 database if preview writes must not touch production content.

## 3. Make `/admin` private with Cloudflare Access

Create Cloudflare Zero Trust Access self-hosted application routes for both:

- `your-domain.example/admin*`
- `your-domain.example/api/admin/*`

Add an Allow policy restricted to your identity/email. The API middleware requires Cloudflare Access's `Cf-Access-Authenticated-User-Email` header and can additionally enforce `ADMIN_ALLOWED_EMAILS` (comma-separated). Do not enable `ADMIN_DEV_BYPASS` in production.

Protecting only `/admin*` is insufficient because the write API must also be behind Access. The middleware is defense in depth; Access must be configured at the edge.

## 4. Environment variables and secrets

Set these in Pages → Settings → Variables and Secrets for Production (and Preview when needed):

| Name | Kind | Required | Purpose |
| --- | --- | --- | --- |
| `ADMIN_ALLOWED_EMAILS` | variable | recommended | Comma-separated Access identities permitted by the API middleware |
| `ADMIN_DEV_BYPASS` | variable | local only | Set `true` only in `.dev.vars`; omit in Cloudflare |
| `ASSET_PROVIDER` | variable | for upload | `r2` or `images`; defaults to `r2` |
| `R2_PUBLIC_BASE_URL` | variable | R2 only | Public custom-domain or `r2.dev` base URL, without trailing slash |
| `CLOUDFLARE_ACCOUNT_ID` | variable | Images only | Cloudflare account that owns Images |
| `CLOUDFLARE_IMAGES_VARIANT` | variable | Images only | Delivery variant; defaults to `public` |
| `CLOUDFLARE_IMAGES_API_TOKEN` | encrypted secret | Images only | Token with Images write permission; server-side only |

No variable beginning with `VITE_` is used for credentials, so these values cannot be compiled into the browser app.

## 5. Optional R2 or Cloudflare Images

### R2

Create a bucket, for example `pauls-portfolio-media`, and add an R2 binding named `MEDIA_BUCKET`. Uncomment `[[r2_buckets]]` in `wrangler.toml` for Wrangler-managed deployment, or add it in Pages Settings → Bindings for Git deployment. Configure an R2 custom domain (recommended) or public development URL and set `R2_PUBLIC_BASE_URL`.

### Cloudflare Images

Set `ASSET_PROVIDER=images`, add `CLOUDFLARE_ACCOUNT_ID`, create an encrypted `CLOUDFLARE_IMAGES_API_TOKEN`, and ensure a delivery variant matching `CLOUDFLARE_IMAGES_VARIANT` exists. Uploads pass through the protected Pages Function; the secret is never sent to the browser.

## 6. Deploy

1. Run `npm run build` and `npm run lint` locally.
2. Commit the source, migrations, and lockfile.
3. Push to the GitHub production branch connected to `pauls-experimental-lab`.
4. Confirm the Pages build command is `npm run build`, output directory is `dist`, and root directory is `/`. The build must finish with `dist/_worker.js`; this is the compiled Functions bundle used by Git deployments.
5. Confirm D1/R2 bindings and variables exist for the environment, then redeploy after any binding change.
6. Visit `/api/projects` publicly, `/admin` through Access, create a draft, publish it, and verify `/projects/<slug>`.

Public API responses use `Cache-Control: no-store`, so publishing is visible on the next front-end fetch without a stale edge cache. Existing static images under `public/works` continue working; new uploads can gradually move to R2 or Images without changing the project schema.
