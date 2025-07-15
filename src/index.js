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

    goButton.addEventListener('click', async () => {
        const seferKodu = input.value.trim();
        
        console.log("Sefer Kodu: ", seferKodu);
        await activateTrip(123456789);

        window.location.href = 'src/pages/main/main.html';
    });
});
