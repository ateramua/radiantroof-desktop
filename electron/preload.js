const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getBackendPort: () => ipcRenderer.invoke('get-backend-port'),
  getDatabasePath: () => ipcRenderer.invoke('get-database-path'),
  backupDatabase: (destination) => ipcRenderer.invoke('backup-database', destination),
  restoreDatabase: (source) => ipcRenderer.invoke('restore-database', source)
});
