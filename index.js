document.addEventListener('DOMContentLoaded', () => {
    // Attach event handler to button
    const goButton = document.getElementById('goButton');
    goButton.addEventListener('click', () => {
        const seferKodu = document.querySelector('input[type="text"]').value.trim();
        
        // TODO: seferKodu logic
        console.log('Sefer Kodu: ', seferKodu)

        // DEV
        window.location.href = 'main/main.html';
    });
});
