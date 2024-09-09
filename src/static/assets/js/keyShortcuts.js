// This file handles keyboard shortcuts like Ctrl + S for save etc.

document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey) { // Ctrl or ⌘ was held down when clicking.
        switch (e.key) {
            case 's':
                saveActiveNote();
                break;
        }
    }
});