import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root = fileURLToPath(new URL('../../../', import.meta.url));
const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim();
const dependencies = {};
for (const name of ['react', 'react-dom', 'react-router-dom', 'vite', 'typescript', 'tailwindcss']) {
  const pkg = JSON.parse(await readFile(path.join(root, 'node_modules', name, 'package.json'), 'utf8'));
  dependencies[name] = { version: pkg.version, engines: pkg.engines ?? null };
}
const npmCli = path.join(path.dirname(process.execPath), 'node_modules/npm/bin/npm-cli.js');
const npm = execFileSync(process.execPath, [npmCli, '--version'], { encoding: 'utf8' }).trim();
const report = {
  collectedAt: new Date().toISOString(), sha: git('rev-parse', 'HEAD'), branch: git('branch', '--show-current'),
  commitDate: git('show', '-s', '--format=%cI', 'HEAD'), node: process.version, npm,
  platform: process.platform, architecture: process.arch, dependencies,
  lockSha256: createHash('sha256').update(await readFile(path.join(root, 'package-lock.json'))).digest('hex'),
  siteFilesChanged: git('diff', '--name-only', 'HEAD', '--', 'src', 'public', 'index.html', 'package.json', 'package-lock.json', 'vite.config.ts', 'vercel.json'),
  vercelNodeVersion: 'Not verified: dashboard requires login',
};
await writeFile(new URL('../evidence/environment.json', import.meta.url), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));
