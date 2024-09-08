const { ipcMain, BrowserWindow } = require('electron');
const path = require('node:path');

const localFiles = require('./local-files.js');
const parser = require('./parser.js');

module.exports = {
    setupTrafficLights: (app, window) => {
        // Handle close (red traffic light) click action
        ipcMain.handle('close', async () => {
            app.quit();
        });

        // Handle minimise (orange traffic light) press action
        ipcMain.handle('minimise', async () => {
            window.minimize();
        });

        // Handle maximise (green traffic light) press action
        ipcMain.handle('maximise', async () => {
            if (window.isMaximized()) {
                window.unmaximize();
            } else {
                window.maximize();
            }
        });
    },

    handleRequests: (app, mainWindow) => {
        // Handle note list request.
        ipcMain.handle('note-list', () => {
            const notes = localFiles.getNotes();

            if (notes === null) { // If "Documents" directory couldn't be reached
                mainWindow.close();

                // Create the document directory choosing dialogue menu.
                const dialogueWindow = new BrowserWindow({
                    width: 800,
                    height: 250,
                    resizable: false,
                    autoHideMenuBar: true,
                    webPreferences: {
                        preload: path.join(__dirname, '../preloads/main.js'),
                        enableRemoteModule: false,
                    },
                });

                // and load the index.html of the app.
                dialogueWindow.loadFile(path.join(__dirname, '../static/documents-folder-missing-dialogue.html'));
            }

            return notes;
        });

        // Handle note content request.
        ipcMain.handle('note-content', async (e, path) => {
            return parser.brevToHTML(path);
        });
    }
}