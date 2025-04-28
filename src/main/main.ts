import { app, BrowserWindow } from 'electron';
import path from 'path';
import { registerIpcHandlers } from './ipc/handlers';
import log from 'electron-log';

function createWindow() {
  log.info('Creating main window...');
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // 在開發環境中載入 Vite dev server
  if (process.env.NODE_ENV === 'development') {
    log.info('Loading Vite dev server at http://localhost:5173');
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools({
      mode: 'detach'
    });
  } else {
    // 在生產環境中載入打包後的檔案
    log.info('Loading production index.html from dist/renderer');
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  }
}

app.whenReady().then(() => {
  log.info('App is ready. Registering IPC handlers...');
  // 註冊所有 IPC 處理程序
  registerIpcHandlers();
  
  log.info('Creating main window after app ready.');
  createWindow();

  app.on('activate', () => {
    log.info('App activate event.');
    if (BrowserWindow.getAllWindows().length === 0) {
      log.info('No windows found. Creating new main window.');
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  log.info('All windows closed.');
  if (process.platform !== 'darwin') {
    log.info('Quitting app (not macOS).');
    app.quit();
  }
}); 