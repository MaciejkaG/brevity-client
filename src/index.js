// main.js

// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain , remote} = require('electron');
const path = require('node:path');
const h = require('./utils/helpers.js');

const createWindow = () => {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        minWidth: 1300,
        minHeight: 700,
        autoHideMenuBar: true,
        frame: false,
        titleBarStyle: 'hidden',
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            enableRemoteModule: false,
        },
    });

    // and load the index.html of the app.
    mainWindow.loadFile(path.join(__dirname, 'static/index.html'));

    // Open the DevTools.
    // mainWindow.webContents.openDevTools()

    // Setup the traffic lights for the window (close/minimise/maximise buttons)
    h.setupTrafficLights(app, mainWindow);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.