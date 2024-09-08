anime({
    targets: 'body *',
    easing: 'easeOutCirc',
    translateY: [-80, 0],
    opacity: [0, 1],
    duration: 1000,
    delay: anime.stagger(150, { start: 100 }) // increase delay by 100ms for each elements.
});