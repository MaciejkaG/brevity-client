const { ipcMain } = require('electron');

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

    handleRequests: () => {
        // Handle note list request.
        ipcMain.handle('note-list', () => {
            const notes = localFiles.getNotes();
            return notes;
        });

        // Handle note content request.
        ipcMain.handle('note-content', async (e, path) => {
            return parser.brevToHTML(path);
        });
    }
}