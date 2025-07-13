// Utils
function getPaperDimensions(corners) {
    function distance(p1, p2) {
      return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
    }
  
    const { topLeftCorner, topRightCorner, bottomLeftCorner, bottomRightCorner } = corners;
  
    const topWidth = distance(topLeftCorner, topRightCorner);
    const bottomWidth = distance(bottomLeftCorner, bottomRightCorner);
    const leftHeight = distance(topLeftCorner, bottomLeftCorner);
    const rightHeight = distance(topRightCorner, bottomRightCorner);
  
    const width = (topWidth + bottomWidth) / 2;
    const height = (leftHeight + rightHeight) / 2;
  
    return { width, height };
}


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
            highlightedCanvasCtx.drawImage(scannedCanvas, 0, 0, highlightedCanvas.width, highlightedCanvas.height);
        }, 10);
    };
})
.catch(err => {
    alert('Could not access the camera.');
    console.error(err);
});


// Capture logic
cv.onRuntimeInitialized = function() {
    const scan = (imageElement) => {
        const contour = scanner.findPaperContour(cv.imread(imageElement));
        const cornerPoints = scanner.getCornerPoints(contour);
        const { width, height } = getPaperDimensions(cornerPoints);
        
        const scanned = scanner.extractPaper(imageElement, width, height, cornerPoints);
        
        document.body.appendChild(scanned);
    };

    captureBtn.onclick = function() {
        // Create an image element from the canvas
        const img = new window.Image();
        img.onload = function() {
            scan(img);
        };
    };
} 