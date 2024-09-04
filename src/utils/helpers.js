const { ipcMain } = require('electron');

module.exports = {
    setupTrafficLights: (app, window) => {
        // Handle close (red traffic light) click action
        ipcMain.handle('close', async (event) => {
            app.quit();
        });

        // Handle minimise (orange traffic light) press action
        ipcMain.handle('minimise', async (event) => {
            window.minimize();
        });

        // Handle maximise (green traffic light) press action
        ipcMain.handle('maximise', async (event) => {
            if (window.isMaximized()) {
                window.unmaximize();
            } else {
                window.maximize();
            }
        });
    }
}