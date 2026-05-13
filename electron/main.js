const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const waitOn = require('wait-on');

const isDev = process.env.NODE_ENV !== 'production';
const serverPort = process.env.PORT || 5001;
const userDataPath = app.getPath('userData');
const dbPath = process.env.DB_STORAGE || path.join(userDataPath, 'radiantroof.sqlite');

process.env.PORT = serverPort;
process.env.DB_DIALECT = process.env.DB_DIALECT || 'sqlite';
process.env.DB_STORAGE = dbPath;
process.env.NODE_ENV = process.env.NODE_ENV || (isDev ? 'development' : 'production');

function normalizeCorsOrigins(value) {
  if (!value) return [];
  return value
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}

const defaultOrigins = normalizeCorsOrigins(process.env.CORS_ORIGIN)
  .concat(['http://localhost:3000', 'app://-']);
process.env.CORS_ORIGIN = [...new Set(defaultOrigins)].join(',');

let nextProcess;
let backendReady = false;

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 820,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });

  const rendererUrl = 'http://localhost:3000';
  win.loadURL(rendererUrl);

  if (isDev) {
    win.webContents.openDevTools({ mode: 'detach' });
  }

  return win;
}

function startBackend() {
  return new Promise((resolve, reject) => {
    try {
      require(path.join(__dirname, '../radiantroof-server/server.js'));
      // In development, backend starts in the same process
      // Wait a moment for the server to be ready
      setTimeout(() => {
        backendReady = true;
        resolve();
      }, 2000);
    } catch (error) {
      console.error('Failed to start backend:', error);
      reject(error);
    }
  });
}

function startFrontendServer() {
  if (isDev) {
    // In development, frontend is already running via concurrently
    return Promise.resolve();
  }

  const clientDir = path.join(__dirname, '../radiantroof-client');
  nextProcess = spawn(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['run', 'start'], {
    cwd: clientDir,
    env: process.env,
    stdio: 'inherit'
  });

  return waitOn({
    resources: ['http://localhost:3000'],
    timeout: 30000,
    interval: 500
  });
}

async function getFrontendPort() {
  const ports = [3000, 3001, 3002];
  for (const port of ports) {
    try {
      const response = await fetch(`http://localhost:${port}`);
      if (response.ok || response.status === 404) {
        console.log(`✅ Frontend detected on port ${port}`);
        return port;
      }
    } catch (error) {
      // Port not ready, try next
    }
  }
  console.warn('⚠️  Frontend not detected, defaulting to port 3000');
  return 3000;
}

async function initApp() {
  try {
    console.log('Starting backend...');
    await startBackend();

    console.log('Waiting for backend to be ready...');
    await waitForBackend();

    console.log('Starting frontend server (production only)...');
    await startFrontendServer();

    console.log('Creating window...');
    createWindow();
  } catch (error) {
    console.error('Failed to initialize app:', error);
    // Continue anyway - app may still work
    createWindow();
  }
}

ipcMain.handle('get-backend-port', () => serverPort);
ipcMain.handle('get-database-path', () => dbPath);
ipcMain.handle('backup-database', async (_, destination) => {
  const target = destination || dialog.showSaveDialogSync({
    title: 'Export database backup',
    defaultPath: path.join(app.getPath('documents'), 'radiantroof-backup.sqlite'),
    filters: [{ name: 'SQLite Database', extensions: ['sqlite'] }]
  });

  if (!target) {
    return { success: false, error: 'Backup cancelled' };
  }

  fs.copyFileSync(dbPath, target);
  return { success: true, path: target };
});

ipcMain.handle('restore-database', async (_, source) => {
  const selected = source || dialog.showOpenDialogSync({
    title: 'Restore database backup',
    properties: ['openFile'],
    filters: [{ name: 'SQLite Database', extensions: ['sqlite'] }]
  });

  if (!selected || selected.length === 0) {
    return { success: false, error: 'Restore cancelled' };
  }

  fs.copyFileSync(selected[0], dbPath);
  return { success: true, path: dbPath };
});

app.whenReady().then(initApp);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
