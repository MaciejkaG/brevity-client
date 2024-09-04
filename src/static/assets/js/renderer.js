// System minimise/maximise/close buttons

document.getElementById('minimise').addEventListener('click', () => window.api.invoke('minimise'));

document.getElementById('maximise').addEventListener('click', () => window.api.invoke('maximise'));

document.getElementById('close').addEventListener('click', () => {
    window.api.invoke('close');
    console.log('a');
});