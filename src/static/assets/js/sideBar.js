let sidebarActive = false;
// openFile should be a JSON object like: { cloud: false, id: '/home/brevity-user/Documents/Brevity/my-note-09-09-2024.brev' }
// if cloud is true, the id is a secret key for modifying and getting the note, otherwise it's the path to a file.
let openFile = null;

$(document).ready(function () {
    // Handle sidebar expanding and all animations including the note preview.
    $('nav .collapsed').on('click', function () {
        if (sidebarActive) return;

        // Expand the sidebar by adding the active CSS class
        $('nav').addClass('active');

        let editor = document.querySelector('#editor');
        const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);

        // Calculate the dimensions to fit the content
        let contentWidth = editor.scrollWidth + 18; // Add padding
        let contentHeight = editor.scrollHeight;

        // Calculate the scaling factor to fit the editor within the available space
        let windowWidth = $(window).width();
        let sidebarWidth = windowWidth * 0.4; // 40% of the window width
        let availableWidth = windowWidth - sidebarWidth;
        // Subtract the approximate note title height from the height of the window
        let availableHeight = window.innerHeight;

        // Determine scale factor to fit the content within the available space
        let scale = Math.min((availableWidth - 5 * rem) / contentWidth, (availableHeight - 10 * rem) / contentHeight);

        // Calculate the new positions to center the editor
        let newLeft = sidebarWidth + (availableWidth - contentWidth * scale) / 2;
        let newTop = (availableHeight - contentHeight * scale) / 2;

        // Calculate the scaled position for the title
        let titleTop = newTop - 5 * rem;

        // Apply the CSS to the editor
        $('#editor').css({
            width: `${contentWidth}px`,
            height: `${contentHeight}px`,
            transform: `translate(${newLeft}px, ${newTop}px) scale(${scale})`,
            transformOrigin: '0 0', // Ensure the transformation is from the top-left corner
            position: 'absolute',  // Make sure the editor is positioned correctly
            left: 0,
            top: 0
        });

        // Remove focus from the editor
        $("#editor").blur();

        // Position the note title
        $('#noteTitle').css({
            top: `${titleTop}px`,
        });

        sidebarActive = true;
    });

    // Handle sidebar collapsing
    $('#editor').on('click', function () {
        if (!sidebarActive) return;

        // Set sidebar back to default styling by removing the active CSS class
        $('nav').removeClass('active');

        // Revert to the original size and position
        $('#editor').removeAttr('style');
        // Apply the focus back to the editor
        $("#editor").focus();

        sidebarActive = false;
    });
});

// Select the current note title's contents when it's focused (clicked)
$('#noteTitle').on('focus', function () {
    const el = this;
    const range = document.createRange();
    const selection = window.getSelection();

    range.selectNodeContents(el);
    selection.removeAllRanges();  // Clear any existing selections
    selection.addRange(range);    // Add the new range to the selection
});

$('#noteTitle').keypress(function (e) {
    if (e.which === 13) { // When enter is pressed
        // Unfocus the title field
        $('#noteTitle').blur();
        // Update the title in origin here.
        return false;
    }

    // if ($('#noteTitle').innerText()) {

    // }
});

async function openEditorLocalFile(path) {
    const file = await getFile(path);

    // Insert the raw HTML content directly into the #editor div
    $('#editor').html(file.html);
    // Set the title field of the note
    $('#noteTitle').html(file.title);

    // Function to wrap text nodes with spans for animation
    function wrapTextWithSpans(element) {
        element.contents().each(function () {
            if (this.nodeType === Node.TEXT_NODE) {
                const text = this.nodeValue;
                const wrappedText = text.split('').map(char => {
                    // Handle spaces separately to avoid collapsing them
                    return char === ' ' ? '&nbsp;' : `<span style="opacity: 0; display: inline-block;">${char}</span>`;
                }).join('');
                $(this).replaceWith(wrappedText);
            } else {
                wrapTextWithSpans($(this)); // Recursively wrap child elements
            }
        });
    }

    // Wrap text inside #editor
    wrapTextWithSpans($('#editor'));

    // Animate each letter's opacity
    anime({
        targets: '#editor span',
        opacity: [0, 1],          // Fade in from 0 to 1
        easing: 'easeInOutQuad',  // Smooth easing
        duration: 400,            // Total duration
        delay: anime.stagger(3),  // Delay between each letter
    });

    // Trigger a click on the editor to put focus on it.
    $("#editor").click();

    openFile = { cloud: false, id: path };
    return;
}

async function saveActiveNote() {
    if (!openFile) {
        // Create a new file here.
        return;
    }

    const noteTitle = $('#noteTitle').html();
    const noteContent = $('#editor').html();

    if (openFile.cloud) {
        // Handle cloud saving here
    } else {
        // console.log({ path: openFile.id, noteTitle, noteContent });
        const result = await window.api.invoke('save-local-file', { path: openFile.id, noteTitle, noteContent });
        alert(result);
    }
}