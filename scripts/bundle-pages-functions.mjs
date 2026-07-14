import { copyFileSync, mkdirSync, rmSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const root = resolve(import.meta.dirname, '..');
const dist = join(root, 'dist');
const tempDir = join(dist, '.pages-functions');
const wranglerBin = join(root, 'node_modules', 'wrangler', 'bin', 'wrangler.js');

mkdirSync(tempDir, { recursive: true });

const result = spawnSync(process.execPath, [
  wranglerBin,
  'pages',
  'functions',
  'build',
  join(root, 'functions'),
  '--outdir',
  tempDir,
  '--output-config-path',
  join(tempDir, 'config.json'),
  '--output-routes-path',
  join(dist, '_routes.json'),
  '--minify',
], {
  cwd: root,
  stdio: 'inherit',
});

if (result.error) {
  throw result.error;
}

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}

copyFileSync(join(tempDir, 'index.js'), join(dist, '_worker.js'));
rmSync(tempDir, { recursive: true, force: true });
