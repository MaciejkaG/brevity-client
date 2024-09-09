const __dirname = import.meta.dirname;

import { ipcMain, BrowserWindow, dialog } from 'electron';
import path from 'node:path';

import * as localFiles from './local-files.js';
import * as parser from './parser.js';

export function setupTrafficLights(app, window) {
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
}

export function handleRequests(app, mainWindow) {
    // We will use this to prevent creating multiple dialogues when one is already open.
    let dialogueWindow = null;

    // Handle note list request.
    ipcMain.handle('note-list', () => {
        const notes = localFiles.getNotes();

        if (notes === null && !dialogueWindow) { // If "Documents" directory wasn't detected automaticaly
            mainWindow.hide();

            // Create the document directory choosing dialogue menu.
            dialogueWindow = new BrowserWindow({
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
            return [];
        }

        return notes;
    });

    // Handle note content request.
    ipcMain.handle('note-content', async (e, path) => {
        return parser.brevToHTML(path);
    });

    // Handle saving a local note.
    ipcMain.handle('save-local-file', async (e, args) => {
        return localFiles.saveLocalNote(args.path, args.noteTitle, args.noteContent);
    });

    // Open the folder picking dialogue after Brevity hasn't found the documents folder.
    ipcMain.handle('set-documents-directory', async () => {
        const result = await dialog.showOpenDialog(mainWindow, {
            title: 'Select your "documents" directory.',
            buttonLabel: 'Choose folder', // Customize the button text
            properties: ['openDirectory'], // Open directory only
            message: 'Select your "documents" directory.', // Custom message (on macOS)
        });

        if (result.canceled) return; // Handle cancel action
        else {
            if (!localFiles.setDocumentsDir(result.filePaths[0])) {
                dialog.showErrorBox('An error occured', 'Directory inaccessible');
            } else {
                dialogueWindow.close();
                dialogueWindow = null;
                mainWindow.show();
            }
        }
    });
}