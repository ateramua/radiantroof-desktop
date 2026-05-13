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

      // Fallback to index.html if file not found
      if (!fs.existsSync(resolvedPath)) {
        console.warn(`File not found: ${resolvedPath}, falling back to index.html`);
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
}

// ---------------------------------------------
// Start Backend
// ---------------------------------------------

async function startBackend() {
  try {
    if (isDev) {
      console.log('ℹ️  Development mode: backend expected to be running externally on port 5001');
      return;
    }

    const possiblePaths = [
      path.join(__dirname, '../radiantroof-server/server.js'),
      path.join(__dirname, '../../radiantroof-server/server.js'),
      path.join(process.resourcesPath, 'radiantroof-server/server.js'),
      path.join(process.resourcesPath, 'app.asar.unpacked', 'radiantroof-server/server.js'),
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
      return;
    }

    backendProcess = spawn(
      process.execPath,
      [backendPath],
      {
        cwd: path.dirname(backendPath),
        env: {
          ...process.env,
          PORT: serverPort,
          DB_STORAGE: dbPath,
          NODE_ENV: 'production',
        },
        stdio: 'inherit',
      }
    );

    backendProcess.on('spawn', () => {
      console.log('✅ Backend process spawned with PID:', backendProcess.pid);
    });

    backendProcess.on('error', (err) => {
      console.error('❌ Backend failed to start:', err);
    });

    backendProcess.on('close', (code) => {
      console.log(`Backend exited with code ${code}`);
    });

    // Health check after 5 seconds
    setTimeout(() => {
      http.get(`http://localhost:${serverPort}/api/health`, (res) => {
        console.log('✅ Backend health check:', res.statusCode);
      }).on('error', (err) => {
        console.error('❌ Backend not reachable:', err.message);
      });
    }, 5000);
  } catch (error) {
    console.error('Failed to start backend:', error);
  }
}

// ---------------------------------------------
// Initialize App
// ---------------------------------------------

async function initApp() {
  try {
    await startBackend();

    if (!isDev) {
      registerAppProtocol();
    }
  } catch (error) {
    console.error(error);
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