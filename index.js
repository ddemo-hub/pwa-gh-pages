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
// ----- //


// Initialize scanner
const scanner = new jscanify();

// Access the camera and set up video stream
const video = document.getElementById('video');
const captureCanvas = document.getElementById('captureCanvas');
const captureBtn = document.getElementById('captureBtn');

const hiddenCanvasCtx = hiddenCanvas.getContext("2d");
const highlightedCanvasCtx = highlightedCanvas.getContext("2d");

navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        video.srcObject = stream;
        
        video.onloadedmetadata = () => {
            video.play();
        
            setInterval(() => {
                hiddenCanvasCtx.drawImage(video, 0, 0);
                const scannedCanvas = scanner.highlightPaper(hiddenCanvas);
                highlightedCanvasCtx.drawImage(scannedCanvas, 0, 0);
            }, 10);
        };
    })
    .catch(err => {
        alert('Could not access the camera.');
        console.error(err);
    });

cv.onRuntimeInitialized = function() {
    function scan(imageElement) {
        const contour = scanner.findPaperContour(cv.imread(imageElement));
        const cornerPoints = scanner.getCornerPoints(contour);
        const { width, height } = getPaperDimensions(cornerPoints);
        
        const scanned = scanner.extractPaper(imageElement, width, height, cornerPoints);
        
        document.body.appendChild(scanned);
    }

    captureBtn.onclick = function() {
        // Draw the current video frame to the canvas
        captureCanvas.getContext('2d').drawImage(video, 0, 0, captureCanvas.width, captureCanvas.height);
        
        // Create an image element from the canvas
        const img = new window.Image();
        img.onload = function() {
            scan(img);
        };
        img.src = captureCanvas.toDataURL('image/png');
    };
}
