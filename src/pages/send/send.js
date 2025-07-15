// Load images from sessionStorage
const latestImage = sessionStorage.getItem('latestImage');
if (latestImage) document.getElementById('latestImage').src = latestImage;

// Add event listener to the send button
const sendBtn = document.getElementById('sendBtn');
sendBtn.addEventListener('click', async () => {
    let description = document.getElementById('description').value;
    if (description === "") description = "Başlıksız"; 

    const imageData = sessionStorage.getItem('latestImage');
    
    const date = new Date();
    const formattedDate = date.toLocaleString('tr-TR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false // 24-hour format
    });

    // Save to IndexedDB
    await saveVoucher({ imageData, description, date: formattedDate });

    window.location.href = '../main/main.html';
});

// Add event listener to the cancel button
const cancelBtn = document.getElementById('cancelBtn');
cancelBtn.addEventListener('click', async () => window.location.href = '../main/main.html');
