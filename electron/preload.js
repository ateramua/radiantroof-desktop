const { contextBridge, ipcRenderer } = require('electron');

// Secure IPC bridge exposed to renderer process
// Only whitelisted methods are exposed - never expose full ipcRenderer
contextBridge.exposeInMainWorld('electronAPI', {
  // Backend server port
  getBackendPort: () => ipcRenderer.invoke('get-backend-port'),
  
  // Database operations
  getDatabasePath: () => ipcRenderer.invoke('get-database-path'),
  
  // Backup and restore functions
  backupDatabase: (destination) => ipcRenderer.invoke('backup-database', destination),
  restoreDatabase: (source) => ipcRenderer.invoke('restore-database', source),
  
  // Version information (useful for debugging)
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  
  // Platform information
  getPlatform: () => process.platform,
  
  // Check if running in development mode
  isDev: () => process.env.NODE_ENV !== 'production'
});