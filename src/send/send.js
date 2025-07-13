// Load images from sessionStorage
const latestImage = sessionStorage.getItem('latestImage');
if (latestImage) document.getElementById('latestImage').src = latestImage;

// Add event listener to the send button
const sendBtn = document.getElementById('sendBtn');
sendBtn.addEventListener('click', async () => {
    const description = document.getElementById('description').value;
    const image = sessionStorage.getItem('latestImage');

    // Prepare payload
    const payload = {
        description,
        image, // base64 or data URL
    };

    // TODO
    console.log(payload);

    window.location.href = '../main/main.html';
});
