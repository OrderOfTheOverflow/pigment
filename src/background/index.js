import { app, protocol } from 'electron';
import { ipcMain as ipc } from 'electron-better-ipc';
import electronDl from 'electron-dl';
import moduleReq from 'module';
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer';
import { createMainWindow, getMainWindow } from '@/background/create-main-window';
import createApplicationMenu from '@/background/create-application-menu';
import createSettingsMenu from '@/background/create-settings-menu';
import createTabContextMenu from '@/background/create-tab-context-menu';
import createTabMenu from '@/background/create-tab-menu';
import initBrowserViews from '@/background/browser-views';

electronDl({
  openFolderWhenDone: true,
  saveAs: true,
});

app.setAppUserModelId(process.execPath);

const isDevelopment = process.env.NODE_ENV !== 'production';

if (isDevelopment) {
  // Don't load any native (external) modules until the following line is run:
  moduleReq.globalPaths.push(process.env.NODE_MODULES_PATH);
}

// Standard scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([{ scheme: 'app', privileges: { secure: true } }]);

// quit application when all windows are closed
app.on('window-all-closed', () => {
  // on macOS it is common for applications to stay open until the user explicitly quits
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  const mainWindow = getMainWindow();
  // on macOS it is common to re-create a window even after all windows have been closed
  if (mainWindow === null) {
    createMainWindow();
  } else {
    mainWindow.show();
  }
});

app.on('before-quit', () => {
  app.quitting = true;
});

// create main BrowserWindow when electron is ready
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    installExtension(VUEJS_DEVTOOLS);
  }
  createMainWindow();

  createApplicationMenu();

  createSettingsMenu();

  createTabContextMenu();

  createTabMenu();

  initBrowserViews();

  ipc.on('app-show-app-icon-badge', () => {
    switch (process.platform) {
      case 'darwin':
        return app.dock.setBadge('•');
      case 'win32':
        return getMainWindow().flashFrame(true);
      default:
        return false;
    }
  });

  ipc.on('app-hide-app-icon-badge', () => {
    switch (process.platform) {
      case 'darwin':
        return app.dock.setBadge('');
      case 'win32':
        return getMainWindow().flashFrame(false);
      default:
        return false;
    }
  });
});
