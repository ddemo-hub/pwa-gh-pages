// Load images from sessionStorage
const original = sessionStorage.getItem('originalImage');
const scanned = sessionStorage.getItem('scannedImage');
if (original) document.getElementById('originalImg').src = original;
if (scanned) document.getElementById('scannedImg').src = scanned;
