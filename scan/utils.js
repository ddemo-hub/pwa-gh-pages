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

function toDataURL(element) {
    if (element instanceof HTMLCanvasElement) {
        return element.toDataURL('image/png');
    } else if (element instanceof HTMLImageElement) {
		// Draw image to a temp canvas
		const tempCanvas = document.createElement('canvas');
		tempCanvas.width = element.naturalWidth || element.width;
		tempCanvas.height = element.naturalHeight || element.height;
		tempCanvas.getContext('2d').drawImage(element, 0, 0);
		return tempCanvas.toDataURL('image/png');
    }
    return null;
}
