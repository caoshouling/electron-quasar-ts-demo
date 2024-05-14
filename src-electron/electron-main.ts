import { app, BrowserWindow } from 'electron';
import path from 'path';
import os from 'os';
const logger = require('./utils/log.js');
// needed in case process is undefined under Linux
const platform = process.platform || os.platform();

let mainWindow: BrowserWindow | undefined;
let iconPath = '';
if (app.isPackaged) {
  // 生产构建时，直接在资源路径中查找图标
  iconPath = path.resolve(__dirname, 'icons/icon.png');
} else {
  // 开发模式时，需要回退到项目根目录再查找图标
  iconPath = path.resolve(
    __dirname,
    '..',
    '..',
    'src-electron',
    'icons',
    'icon.png'
  );
}
function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    icon: iconPath, // tray icon
    width: 1000,
    height: 600,
    useContentSize: true,
    webPreferences: {
      contextIsolation: true,
      // More info: https://v2.quasar.dev/quasar-cli-vite/developing-electron-apps/electron-preload-script
      preload: path.resolve(__dirname, process.env.QUASAR_ELECTRON_PRELOAD),
    },
  });

  mainWindow.loadURL(process.env.APP_URL);
  mainWindow.webContents.on('did-finish-load', () => {
    logger.info('---Start Success---');
  });
  if (process.env.DEBUGGING) {
    // if on DEV or Production with debug enabled
    mainWindow.webContents.openDevTools();
  } else {
    // we're on production; no access to devtools pls
    mainWindow.webContents.on('devtools-opened', () => {
      mainWindow?.webContents.closeDevTools();
    });
  }

  mainWindow.on('closed', () => {
    mainWindow = undefined;
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === undefined) {
    createWindow();
  }
});
