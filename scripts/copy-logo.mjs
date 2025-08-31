import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const src = path.join(root, 'assets', 'logo-af.gif');
const destDir = path.join(root, 'web', 'public');
const dest = path.join(destDir, 'logo-af.gif');

try {
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log('Copied logo to web/public/logo-af.gif');
  } else {
    console.warn('Logo not found at assets/logo-af.gif; skipping copy');
  }
} catch (err) {
  console.error('Failed to copy logo:', err);
  process.exitCode = 0; // do not fail install
}


