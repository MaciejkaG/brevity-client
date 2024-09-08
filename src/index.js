// main.js

const __dirname = import.meta.dirname;

// Modules to control application life and create native browser window
import { app, BrowserWindow } from 'electron';
import path from'node:path';
import * as h from './utils/helpers.js';

const createWindow = () => {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        minWidth: 1300,
        minHeight: 700,
        autoHideMenuBar: true,
        frame: false,
        titleBarStyle: 'hidden',
        webPreferences: {
            preload: path.join(__dirname, 'preloads/main.js'),
            enableRemoteModule: false,
        },
    });

    // Setup the traffic lights for the window (close/minimise/maximise buttons)
    h.setupTrafficLights(app, mainWindow);
    // Setup handlers for requests like the note list etc.
    h.handleRequests(app, mainWindow);

    // and load the index.html of the app.
    mainWindow.loadFile(path.join(__dirname, 'static/index.html'));

    // Open the DevTools.
    // mainWindow.webContents.openDevTools()
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
// app.on('window-all-closed', () => {
//     if (process.platform !== 'darwin') app.quit();
// });