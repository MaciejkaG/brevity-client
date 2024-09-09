import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import Store from 'electron-store';

// Initiate the electron-store
const store = new Store();

import * as parser from './parser.js';

export function getNotes() {
    const documentsDir = getDocumentsDir();

    if (documentsDir === null) {
        return null;
    }

    const notes = [];

    // Read and list contents of the Documents directory
    const files = fs.readdirSync(documentsDir);

    files.forEach(file => {
        const fileAbsolutePath = path.join(documentsDir, file);

        // If the path is a file and has the .brev extension.
        if (fs.lstatSync(fileAbsolutePath).isFile() && file.endsWith('.brev')) {
            const title = parser.brevToHTML(fileAbsolutePath).title;
            notes.push({ title, path: fileAbsolutePath });
        }
    });

    return notes;
}

export function saveLocalNote(filePath, noteTitle, noteContent) {
    // Write the title and converted content to file.
    try {
        fs.writeFileSync(filePath, parser.htmlToBrev(noteTitle, noteContent), 'utf-8');
    } catch (err) {
        console.log(noteContent);
        console.log(typeof noteContent);
        console.error(err);
        return false;
    }

    return true;
}

function getDocumentsDir() {
    // Determine the place to store Brevity files
    const documentsDir = store.get('documentsDir', path.join(os.homedir(), 'Documents/Brevity'));

    // Check if the notes' directory exists, if not create it.
    if (!fs.existsSync(documentsDir)) {
        try {
            fs.mkdirSync(documentsDir);
        } catch (err) {
            if (err.code === 'ENOENT') {
                return null;
            }

            throw err;
        }
    }

    store.set('documentsDir', documentsDir);

    return documentsDir;
}

export function setDocumentsDir(dir) {
    // Determine the place to store Brevity files in the documents directory
    const documentsDir = path.join(dir, 'Brevity');

    // Check if the notes' directory exists, if not create it.
    if (!fs.existsSync(documentsDir)) {
        try {
            fs.mkdirSync(documentsDir);
        } catch (err) {
            if (err.code === 'ENOENT') {
                return false;
            }

            throw err;
        }
    }

    store.set('documentsDir', documentsDir);

    return true;
}