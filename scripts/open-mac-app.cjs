/**
 * Open the packaged macOS .app from dist/ (run from repo root after `npm run dist:mac`).
 * Also prints the real Contents/MacOS executable name (no spaces when executableName is set).
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const root = path.join(__dirname, '..');
const printOnly = process.argv.includes('--print-app') || process.argv.includes('-p');

function findBuiltApp() {
  const dist = path.join(root, 'dist');
  if (!fs.existsSync(dist)) {
    return null;
  }
  for (const sub of ['mac-arm64', 'mac']) {
    const dir = path.join(dist, sub);
    if (!fs.existsSync(dir)) {
      continue;
    }
    const apps = fs.readdirSync(dir).filter((f) => f.endsWith('.app'));
    if (apps.length) {
      return path.join(dir, apps[0]);
    }
  }
  return null;
}

const app = findBuiltApp();
if (!app) {
  console.error('No .app found under dist/mac-arm64 or dist/mac.');
  console.error('From the repository root run:  npm run dist:mac');
  console.error('Current working directory:', process.cwd());
  console.error('Expected project root:', root);
  process.exit(1);
}

const macosDir = path.join(app, 'Contents', 'MacOS');
let bin = '';
if (fs.existsSync(macosDir)) {
  const bins = fs.readdirSync(macosDir).filter((f) => !f.startsWith('.'));
  if (bins.length) {
    bin = path.join(macosDir, bins[0]);
  }
}

if (printOnly) {
  console.log(app);
  if (bin) {
    console.log(bin);
  }
  process.exit(0);
}

console.log('Opening', app);
if (bin) {
  console.log('CLI binary (for console logs):', bin);
}
execSync(`open ${JSON.stringify(app)}`, { stdio: 'inherit' });
