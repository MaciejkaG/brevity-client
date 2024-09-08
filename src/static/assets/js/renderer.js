// System minimise/maximise/close buttons

document.getElementById('minimise').addEventListener('click', () => window.api.invoke('minimise'));

document.getElementById('maximise').addEventListener('click', () => window.api.invoke('maximise'));

document.getElementById('close').addEventListener('click', () => window.api.invoke('close'));

window.addEventListener('load', async () => {
    const noteList = await window.api.invoke('note-list');

    noteList.forEach(note => {
        const escapedPath = escapeHTML(note.path).replace(/\\/g, '\\\\');
        document.getElementById('localFilesList').innerHTML += `<span onclick="openEditorFile(\`${escapedPath}\`)">${escapeHTML(note.title)}</span>`;
    });
});

async function getFile(filePath) {
    return await window.api.invoke('note-content', filePath);
}

function escapeHTML(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}