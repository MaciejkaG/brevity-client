let sidebarActive = false;

$(document).ready(function () {
    // Handle sidebar expanding and all animations including the note preview.
    $('nav').hover(function () {
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
    })
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