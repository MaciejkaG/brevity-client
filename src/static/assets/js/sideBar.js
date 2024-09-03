$(document).ready(function () {
    $('nav').hover(function () {
        let editor = document.querySelector('#editor');

        // Calculate the dimensions to fit the content
        let contentWidth = editor.scrollWidth + 18; // Add padding
        let contentHeight = editor.scrollHeight;

        // Calculate the scaling factor to fit the editor within the available space
        let windowWidth = $(window).width();
        let sidebarWidth = windowWidth * 0.4; // 40% of the window width
        let availableWidth = windowWidth - sidebarWidth;

        // Determine scale factor to fit the content within the available space
        let scale = Math.floor((Math.min(availableWidth / contentWidth, window.innerHeight / contentHeight) - .1) * 1000) / 1000;

        // Calculate the new positions to center the editor
        let newLeft = sidebarWidth + (availableWidth - contentWidth * scale) / 2;
        let newTop = (window.innerHeight - contentHeight * scale) / 2;

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

    }, function () {
        // Revert to the original size and position
        $('#editor').removeAttr('style');
    });
});
