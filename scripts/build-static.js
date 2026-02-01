#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const appDir = path.join(__dirname, '..', 'src', 'app');
const apiDir = path.join(appDir, 'api');
const apiBackup = path.join(appDir, '_api_temp');

try {
  // Временно скрываем api (несовместимо со static export)
  if (fs.existsSync(apiDir)) {
    fs.renameSync(apiDir, apiBackup);
    console.log('API routes temporarily moved');
  }

  execSync('npx next build', {
    env: { ...process.env, STATIC_EXPORT: '1' },
    stdio: 'inherit',
    cwd: path.join(__dirname, '..'),
  });

  console.log('\n✓ Статика в папке out/');
} finally {
  // Восстанавливаем api
  if (fs.existsSync(apiBackup)) {
    fs.renameSync(apiBackup, apiDir);
    console.log('API routes restored');
  }
}
