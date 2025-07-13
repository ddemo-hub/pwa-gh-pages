const camInput = document.getElementById('cameraInput');
const goButton = document.getElementById('goButton');

goButton.addEventListener('click', () => {
    camInput.click();
});

camInput.addEventListener('change', function () {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            sessionStorage.setItem('latestImage', e.target.result);
            window.location.href = '../send/send.html';
        };
        reader.readAsDataURL(file);
    }
});