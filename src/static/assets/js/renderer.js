// System minimise/maximise/close buttons

document.getElementById('minimise').addEventListener('click', () => window.api.invoke('minimise'));

document.getElementById('maximise').addEventListener('click', () => window.api.invoke('maximise'));

document.getElementById('close').addEventListener('click', () => window.api.invoke('close'));

window.addEventListener('load', async () => {
    await syncLocalFileList();
});

async function getFile(filePath) {
    return await window.api.invoke('note-content', filePath);
}

async function syncLocalFileList() {
    const noteList = await window.api.invoke('note-list');

    document.getElementById('localFilesList').innerHTML = '';
    noteList.forEach(note => {
        const escapedPath = escapeHTML(note.path).replace(/\\/g, '\\\\');
        document.getElementById('localFilesList').innerHTML += `<span onclick="openEditorFile(\`${escapedPath}\`)">${escapeHTML(note.title)}</span>`;
    });

    if (!noteList.length) {
        document.getElementById('localFilesList').innerHTML = `<span style="cursor:initial;">No local files found</span>`;
    }
}

setInterval(syncLocalFileList, 3000);

function escapeHTML(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}