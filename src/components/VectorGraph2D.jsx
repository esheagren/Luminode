const drawVisualization = (coordsToRender = coordinates) => {
  if (!coordsToRender.length || !canvasRef.current) {
    console.log('Cannot draw visualization:', { 
      hasCoordinates: coordsToRender.length > 0,
      hasCanvas: !!canvasRef.current
    });
    
    // Clear the canvas if it exists but there are no coordinates
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#1a1a2e'; // Dark blue background
        ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        console.log('Graph cleared due to no coordinates');
      }
    }
    
    return;
  }
  
  const canvas = canvasRef.current;
  const ctx = canvas.getContext('2d');
} 