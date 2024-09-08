const path = require('node:path');
const fs = require('node:fs');
const os = require('node:os');

const parser = require('./parser.js');

module.exports = {
    getNotes: () => {
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
};

// console.log(module.exports.getNoteTitles());

function getDocumentsDir() {
    // Determine the place to store Brevity files
    const documentsDir = path.join(os.homedir(), 'Documents/Brevity');

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

    return documentsDir;
}