#!/usr/bin/env node
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const frontendDir = path.join(rootDir, 'frontend');
const distDir = path.join(frontendDir, 'dist');
const rootPublicDir = path.join(rootDir, 'public');
const backendPublicDir = path.join(rootDir, 'backend', 'public');

console.log('🚀 Starting Voraeclat production build & sync...');
console.log(`Root: ${rootDir}`);
console.log(`Frontend: ${frontendDir}`);

// 1. Install frontend dependencies
console.log('\n📦 Installing frontend dependencies...');
execSync('npm install', { cwd: frontendDir, stdio: 'inherit' });

// 2. Build frontend with Vite
console.log('\n⚡ Building frontend with Vite...');
execSync('npm run build', { cwd: frontendDir, stdio: 'inherit' });

// Helper to copy recursively
function copyDirSync(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// 3. Sync to root public/
console.log('\n📂 Copying dist output to root public/ directory...');
copyDirSync(distDir, rootPublicDir);

// 4. Sync to backend/public if present
if (fs.existsSync(path.join(rootDir, 'backend'))) {
  copyDirSync(distDir, backendPublicDir);
}

console.log('✅ Voraeclat build and assets synchronized successfully!');
