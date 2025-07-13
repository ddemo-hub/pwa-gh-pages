// Initialize scanner
const scanner = new jscanify();


// Access the camera and set up video stream
const video = document.getElementById('video');
const captureBtn = document.getElementById('captureBtn');
const hiddenCanvas = document.getElementById('hiddenCanvas');
const highlightedCanvas = document.getElementById('highlightedCanvas');
const hiddenCanvasCtx = hiddenCanvas.getContext("2d");
const highlightedCanvasCtx = highlightedCanvas.getContext("2d");

const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;

navigator.mediaDevices.getUserMedia({
    video: {
        width: { ideal: screenWidth },
        height: { ideal: screenHeight },
        facingMode: 'environment'
    }
})
.then(stream => {
    video.srcObject = stream;

    video.onloadedmetadata = () => {
        // Set video and canvas element attributes to match the actual video stream resolution
        video.width = video.videoWidth;
        video.height = video.videoHeight;
        hiddenCanvas.width = video.videoWidth;
        hiddenCanvas.height = video.videoHeight;
        highlightedCanvas.width = video.videoWidth;
        highlightedCanvas.height = video.videoHeight;
        
        video.play();

        setInterval(() => {
            hiddenCanvasCtx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
            const scannedCanvas = scanner.highlightPaper(hiddenCanvas);
            
            highlightedCanvasCtx.clearRect(0, 0, highlightedCanvas.width, highlightedCanvas.height);
            highlightedCanvasCtx.drawImage(
                scannedCanvas,
                0, 0,
                scannedCanvas.width,
                scannedCanvas.height,
                0, 0,
                highlightedCanvas.width,
                highlightedCanvas.height
            );
        }, 100);
    };
})
.catch(err => {
    alert('Could not access the camera.');
    console.error(err);
});

window.addEventListener('resize', () => {
    highlightedCanvas.style.width = window.innerWidth + 'px';
    highlightedCanvas.style.height = window.innerHeight + 'px';
});


// Capture logic
cv.onRuntimeInitialized = function() {
    function scan (imageElement) {
        const contour = scanner.findPaperContour(cv.imread(imageElement));
        const cornerPoints = scanner.getCornerPoints(contour);
        
        const { width, height } = getPaperDimensions(cornerPoints);
        
        const scanned = scanner.extractPaper(imageElement, width, height, cornerPoints);
        return scanned;
    };

    captureBtn.onclick = async function() {
        let originalDataUrl = null;

        // Try ImageCapture API
        const stream = video.srcObject;
        let imageBitmap = null;
        if (stream) {
            const track = stream.getVideoTracks()[0];
            if (window.ImageCapture && track) {
                try {
                    const imageCapture = new window.ImageCapture(track);
                    imageBitmap = await imageCapture.grabFrame();
                } catch (e) {
                    imageBitmap = null;
                }
            }
        }
        if (imageBitmap) {
            // Draw ImageBitmap to canvas
            hiddenCanvas.width = imageBitmap.width;
            hiddenCanvas.height = imageBitmap.height;
            hiddenCanvasCtx.drawImage(imageBitmap, 0, 0);
            originalDataUrl = hiddenCanvas.toDataURL('image/png');
        } else {
            // Fallback: draw current video frame to canvas
            hiddenCanvasCtx.drawImage(video, 0, 0, hiddenCanvas.width, hiddenCanvas.height);
            originalDataUrl = hiddenCanvas.toDataURL('image/png');
        }

        // Create image element for scan
        const img = new window.Image();
        img.onload = function() {
            const scannedCanvas = scan(img);
            const scannedDataUrl = toDataURL(scannedCanvas);
            
            // Store both images in sessionStorage
            sessionStorage.setItem('originalImage', originalDataUrl);
            sessionStorage.setItem('scannedImage', scannedDataUrl);
            // Redirect to send/send.html
            window.location.href = '../send/send.html';
        };
        img.src = originalDataUrl;
    };
}
