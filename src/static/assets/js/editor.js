const editor = document.getElementById('editor');

editor.addEventListener('paste', (e) => {
    e.preventDefault();

    const clipboardData = e.clipboardData || window.clipboardData;

    // Check if there's any plain text data
    const text = clipboardData.getData('text/plain');

    if (text) {
        // Insert plain text as new <div> elements
        insertTextAsDivs(text);
    } else {
        // If there's no plain text, check for image data
        const items = clipboardData.items;
        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
                const imageFile = items[i].getAsFile();
                const reader = new FileReader();
                reader.onload = (event) => {
                    // Create an img element with the base64 encoded image
                    const img = document.createElement('img');
                    img.src = event.target.result;
                    insertHtmlAsDiv(img.outerHTML);
                };
                reader.readAsDataURL(imageFile);
            }
        }
    }
});

function insertTextAsDivs(text) {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    range.deleteContents();

    // Get lines of text (split by line breaks)
    const lines = text.split('\n');
    lines.forEach(line => {
        // Create a <div> element for each line of text
        const lineDiv = document.createElement('div');
        lineDiv.textContent = line.replaceAll(/ /g, '\u00a0');
        range.insertNode(lineDiv);
        // Move the cursor to the end of the inserted <div>
        range.setStartAfter(lineDiv);
        range.setEndAfter(lineDiv);
    });

    selection.removeAllRanges();
    selection.addRange(range);
}

function insertHtmlAsDiv(html) {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;
    const range = selection.getRangeAt(0);
    range.deleteContents();

    const div = document.createElement('div');
    div.innerHTML = html;
    const frag = document.createDocumentFragment();
    let child;

    while ((child = div.firstChild)) {
        frag.appendChild(child);
    }
    range.insertNode(frag);
    // Move the cursor to the end of the inserted content
    range.setStartAfter(frag.lastChild);
    range.setEndAfter(frag.lastChild);

    selection.removeAllRanges();
    selection.addRange(range);
}

// Prevent pasting in the title field (might change later)
document.getElementById('noteTitle').addEventListener('paste', (e) => e.preventDefault());