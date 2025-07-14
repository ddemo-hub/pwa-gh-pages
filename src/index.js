document.addEventListener('DOMContentLoaded', () => {
    // Attach event handler to button
    const goButton = document.getElementById('goButton');
    const input = document.getElementById('seferKoduInput');

    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            goButton.click();
        }
    });

    goButton.addEventListener('click', () => {
        const seferKodu = input.value.trim();
        
        // TODO: seferKodu logic
        console.log('Sefer Kodu: ', seferKodu)

        // DEV
        window.location.href = 'src/main/main.html';
    });
});
