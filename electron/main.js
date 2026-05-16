const {
  app,
  ipcMain,
  dialog,
  protocol,
  BrowserWindow,
} = require('electron');

protocol.registerSchemesAsPrivileged([
  {
    scheme: 'app',
    privileges: {
      standard: true,
      secure: true,
      supportFetchAPI: true,
      corsEnabled: true,
    },
  },
]);

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const http = require('http');

let mainWindow;
let backendProcess = null;
/** True after the first successful `createWindow()` completes wiring (macOS `activate` guard). */
let initialWindowCreated = false;

const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
  process.exit(0);
}

app.on('second-instance', () => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
  }
});

// ---------------------------------------------
// Environment
// ---------------------------------------------

const isDev = process.env.NODE_ENV === 'development';

const serverPort = process.env.PORT || 5001;

const dbPath = path.join(
  app.getPath('userData'),
  'radiantroof.sqlite'
);

// ---------------------------------------------
// Set Environment Variables
// ---------------------------------------------

process.env.PORT = serverPort;
process.env.DB_DIALECT = 'sqlite';
process.env.DB_STORAGE = dbPath;
process.env.NODE_ENV = isDev ? 'development' : 'production';

process.env.CORS_ORIGIN = 'http://localhost:3000,http://localhost:5001,app://-';

// ---------------------------------------------
// Register Custom Protocol (FIXED - moved to app.whenReady)
// ---------------------------------------------

function registerAppProtocol() {
  protocol.registerFileProtocol('app', (request, callback) => {
    try {
      let requestPath = new URL(request.url).pathname;
      requestPath = decodeURIComponent(requestPath);

      // Remove leading slash
      requestPath = requestPath.replace(/^\//, '');

      // Rewrite nested _next asset requests to the root _next path
      const nextSegmentIndex = requestPath.indexOf('/_next/');
      if (nextSegmentIndex !== -1) {
        requestPath = requestPath.substring(nextSegmentIndex + 1);
      }

      // Default to index.html
      if (!requestPath || requestPath === '') {
        requestPath = 'index.html';
      }

      // Resolve the file path
      let resolvedPath = path.join(__dirname, '../radiantroof-client/out', requestPath);

      // If path is a directory, look for index.html
      if (fs.existsSync(resolvedPath) && fs.statSync(resolvedPath).isDirectory()) {
        resolvedPath = path.join(resolvedPath, 'index.html');
      }

      // Fallback to index.html if a page is missing
      if (!fs.existsSync(resolvedPath)) {
        if (requestPath.startsWith('_next/')) {
          console.error(`Static asset not found: ${resolvedPath}`);
          return callback({ error: -6 });
        }

        console.warn(`Page file not found: ${resolvedPath}, falling back to index.html`);
        resolvedPath = path.join(__dirname, '../radiantroof-client/out/index.html');
      }

      // Determine content type
      const ext = path.extname(resolvedPath).toLowerCase();
      const contentType = {
        '.js': 'application/javascript',
        '.css': 'text/css',
        '.html': 'text/html',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.svg': 'image/svg+xml',
        '.ico': 'image/x-icon',
        '.woff': 'font/woff',
        '.woff2': 'font/woff2',
        '.ttf': 'font/ttf',
      }[ext] || 'text/plain';

      console.log(`📄 Serving: ${resolvedPath} (${contentType})`);
      callback({ path: resolvedPath, headers: { 'Content-Type': contentType } });
    } catch (error) {
      console.error('Protocol error:', error);
      callback({ error: -6 });
    }
  });
}

// ---------------------------------------------
// Create Browser Window
// ---------------------------------------------

function createWindow() {
  if (!app.isReady()) {
    console.warn('createWindow: skipped before app.ready');
    return;
  }

  mainWindow = new BrowserWindow({
    width: 1440,
    height: 950,
    minWidth: 1200,
    minHeight: 800,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // Only open DevTools in development mode
  if (isDev) {
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  }

  if (isDev) {
    console.log('🛠️  Loading development frontend from: http://localhost:3000');
    mainWindow.loadURL('http://localhost:3000');
  } else {
    console.log('📦 Loading production frontend via app:// protocol');
    mainWindow.loadURL('app://-/index.html');
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  initialWindowCreated = true;
}

// ---------------------------------------------
// Start Backend
// ---------------------------------------------

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function pingBackendHealth(port) {
  return new Promise((resolve, reject) => {
    const req = http.get(`http://127.0.0.1:${port}/api/health`, (res) => {
      res.resume();
      if (res.statusCode >= 200 && res.statusCode < 300) {
        resolve();
      } else {
        reject(new Error(`HTTP ${res.statusCode}`));
      }
    });
    req.setTimeout(2000, () => {
      req.destroy();
      reject(new Error('timeout'));
    });
    req.on('error', reject);
  });
}

async function waitForBackendListening(port, childProcess, maxWaitMs = 120000, getStderr = () => '') {
  const deadline = Date.now() + maxWaitMs;
  while (Date.now() < deadline) {
    if (childProcess.exitCode !== null) {
      const tail = (getStderr() || '').trim().slice(-4000);
      throw new Error(
        `The backend stopped unexpectedly (exit code ${childProcess.exitCode}).` +
          (tail ? `\n\n${tail}` : '')
      );
    }
    try {
      await pingBackendHealth(port);
      return;
    } catch {
      await sleep(250);
    }
  }
  throw new Error(
    'The backend did not become ready in time. Another process may be using port 5001.' +
      (() => {
        const t = (getStderr() || '').trim().slice(-4000);
        return t ? `\n\n${t}` : '';
      })()
  );
}

function isPathInsidePlainAppAsar(filePath) {
  return filePath.split(path.sep).indexOf('app.asar') !== -1;
}

function isPathInsideAppAsarUnpacked(filePath) {
  return filePath.split(path.sep).includes('app.asar.unpacked');
}

function getBackendSpawnCwd(backendPath) {
  const dir = path.dirname(backendPath);
  if (isPathInsidePlainAppAsar(dir) && !isPathInsideAppAsarUnpacked(dir)) {
    return process.resourcesPath;
  }
  try {
    if (fs.existsSync(dir) && fs.statSync(dir).isDirectory()) {
      return dir;
    }
  } catch {
    // ignore
  }
  return process.resourcesPath;
}

async function startBackend() {
  let backendStderr = '';
  try {
    if (isDev) {
      console.log('ℹ️  Development mode: backend expected to be running externally on port 5001');
      return { ok: true };
    }

    const possiblePaths = [
      path.join(process.resourcesPath, 'app.asar.unpacked', 'radiantroof-server', 'server.js'),
      path.join(process.resourcesPath, 'radiantroof-server', 'server.js'),
      path.join(__dirname, '..', 'radiantroof-server', 'server.js'),
      path.join(__dirname, '..', '..', 'radiantroof-server', 'server.js'),
    ];

    let backendPath = null;
    for (const testPath of possiblePaths) {
      if (fs.existsSync(testPath)) {
        backendPath = testPath;
        console.log('✅ Found backend at:', backendPath);
        break;
      }
    }

    if (!backendPath) {
      console.error('❌ Could not find server.js in any expected location.');
      return {
        ok: false,
        error:
          'Could not find the bundled backend (server.js). Rebuild or reinstall the application.',
      };
    }

    const backendCwd = getBackendSpawnCwd(backendPath);
    const childEnv = {
      ...process.env,
      ELECTRON_RUN_AS_NODE: '1',
      PORT: String(serverPort),
      DB_STORAGE: dbPath,
      DB_DIALECT: 'sqlite',
      NODE_ENV: 'production',
      CORS_ORIGIN:
        process.env.CORS_ORIGIN ||
        'http://localhost:3000,http://localhost:5001,app://-',
    };
    // Inherited NODE_OPTIONS / NODE_PATH can break the Electron-as-Node child; resolve from server.js path only.
    delete childEnv.NODE_OPTIONS;
    delete childEnv.NODE_PATH;

    const appendStderr = (chunk) => {
      backendStderr += chunk.toString();
      if (backendStderr.length > 16000) {
        backendStderr = backendStderr.slice(-16000);
      }
    };

    backendProcess = spawn(process.execPath, [backendPath], {
      cwd: backendCwd,
      env: childEnv,
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    backendProcess.stdout.on('data', (chunk) => {
      console.log('[backend]', chunk.toString().trimEnd());
    });
    backendProcess.stderr.on('data', (chunk) => {
      appendStderr(chunk);
      console.error('[backend]', chunk.toString().trimEnd());
    });

    await new Promise((resolve, reject) => {
      const onError = (err) => {
        clearTimeout(tid);
        backendProcess.off('spawn', onSpawn);
        reject(err);
      };
      const onSpawn = () => {
        clearTimeout(tid);
        backendProcess.off('error', onError);
        resolve();
      };
      const tid = setTimeout(() => {
        backendProcess.off('error', onError);
        backendProcess.off('spawn', onSpawn);
        reject(new Error('Backend process did not spawn within 15 seconds.'));
      }, 15000);
      backendProcess.once('error', onError);
      backendProcess.once('spawn', onSpawn);
    });

    console.log('✅ Backend process spawned with PID:', backendProcess.pid);

    backendProcess.on('error', (err) => {
      console.error('❌ Backend failed to start:', err);
    });

    backendProcess.on('close', (code) => {
      console.log(`Backend exited with code ${code}`);
    });

    await waitForBackendListening(serverPort, backendProcess, 120000, () => backendStderr);
    console.log('✅ Backend is ready');
    return { ok: true };
  } catch (error) {
    console.error('Failed to start backend:', error);
    if (backendProcess && !backendProcess.killed) {
      backendProcess.kill();
      backendProcess = null;
    }
    const logPath = path.join(app.getPath('userData'), 'backend-crash.log');
    try {
      fs.writeFileSync(
        logPath,
        `${error?.message || error}\n\n--- stderr ---\n${backendStderr}`,
        'utf8'
      );
    } catch {
      // ignore
    }
    return {
      ok: false,
      error: `${error.message || String(error)}\n\nLog: ${logPath}`,
    };
  }
}

// ---------------------------------------------
// Initialize App
// ---------------------------------------------

async function initApp() {
  try {
    const backend = await startBackend();
    if (!isDev && !backend.ok) {
      dialog.showErrorBox(
        'RadiantRoof Realty — server failed to start',
        backend.error || 'Unknown error'
      );
      app.quit();
      return;
    }
  } catch (error) {
    console.error(error);
    if (!isDev) {
      dialog.showErrorBox(
        'RadiantRoof Realty — server failed to start',
        error.message || String(error)
      );
      app.quit();
      return;
    }
  }

  createWindow();
}

// ---------------------------------------------
// IPC Handlers
// ---------------------------------------------

ipcMain.handle('get-backend-port', async () => serverPort);
ipcMain.handle('get-database-path', async () => dbPath);

// ---------------------------------------------
// Backup Database
// ---------------------------------------------

ipcMain.handle('backup-database', async (_, destination) => {
  try {
    const savePath =
      destination ||
      dialog.showSaveDialogSync({
        title: 'Backup Database',
        defaultPath: path.join(app.getPath('documents'), 'radiantroof-backup.sqlite'),
        filters: [{ name: 'SQLite Database', extensions: ['sqlite'] }],
      });

    if (!savePath) {
      return { success: false, error: 'Backup cancelled' };
    }

    if (!fs.existsSync(dbPath)) {
      return { success: false, error: 'Database file does not exist' };
    }

    fs.copyFileSync(dbPath, savePath);
    return { success: true, path: savePath };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// ---------------------------------------------
// Restore Database
// ---------------------------------------------

ipcMain.handle('restore-database', async (_, source) => {
  try {
    const selected =
      source ||
      dialog.showOpenDialogSync({
        title: 'Restore Database',
        properties: ['openFile'],
        filters: [{ name: 'SQLite Database', extensions: ['sqlite'] }],
      });

    if (!selected || selected.length === 0) {
      return { success: false, error: 'Restore cancelled' };
    }

    const restorePath = selected[0];

    if (!fs.existsSync(restorePath)) {
      return { success: false, error: 'Backup file missing' };
    }

    if (fs.existsSync(dbPath)) {
      const backupBeforeRestore = `${dbPath}.backup-${Date.now()}`;
      fs.copyFileSync(dbPath, backupBeforeRestore);
      console.log('Pre-restore backup created:', backupBeforeRestore);
    }

    fs.copyFileSync(restorePath, dbPath);
    return { success: true, path: dbPath };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// ---------------------------------------------
// App Lifecycle
// ---------------------------------------------

app.whenReady().then(() => {
  // Register protocol BEFORE creating window
  if (!isDev) {
    registerAppProtocol();
  }
  initApp();
});

app.on('activate', () => {
  if (!app.isReady()) {
    return;
  }
  if (!initialWindowCreated) {
    return;
  }
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on('window-all-closed', () => {
  if (backendProcess) {
    backendProcess.kill();
  }
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  if (backendProcess) {
    backendProcess.kill();
  }
});