import React, { useEffect, useRef } from 'react';

const VectorExplanationDiagram = () => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Function to draw the visualization
    const drawVectorVisualization = () => {
      // Clear canvas
      ctx.clearRect(0, 0, width, height);
      
      // Set background
      ctx.fillStyle = 'rgba(26, 26, 46, 0.7)';
      ctx.fillRect(0, 0, width, height);
      
      // Draw coordinate system
      const originX = width / 2;
      const originY = height / 2;
      
      // Draw axes
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 1;
      
      // X-axis
      ctx.beginPath();
      ctx.moveTo(20, originY);
      ctx.lineTo(width - 20, originY);
      ctx.stroke();
      
      // Y-axis
      ctx.beginPath();
      ctx.moveTo(originX, 20);
      ctx.lineTo(originX, height - 20);
      ctx.stroke();
      
      // Draw axis labels
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      
      // X-axis label
      ctx.fillText('x', width - 15, originY + 15);
      
      // Y-axis label
      ctx.fillText('y', originX + 15, 15);
      
      // Draw grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 0.5;
      
      // Vertical grid lines
      for (let x = 40; x < width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 20);
        ctx.lineTo(x, height - 20);
        ctx.stroke();
      }
      
      // Horizontal grid lines
      for (let y = 40; y < height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(20, y);
        ctx.lineTo(width - 20, y);
        ctx.stroke();
      }
      
      // Draw vectors
      // Vector 1: "food"
      drawVector(originX, originY, 60, -20, '#FFA500', 'food');
      
      // Vector 2: "meal"
      drawVector(originX, originY, 48, -40, '#FF6347', 'meal');
      
      // Vector 3: "dinner"
      drawVector(originX, originY, 40, -50, '#6A5ACD', 'dinner');
      
      // Draw origin label
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.textAlign = 'right';
      ctx.fillText('(0,0)', originX - 5, originY + 15);
    };
    
    // Function to draw a vector with label
    const drawVector = (startX, startY, deltaX, deltaY, color, label) => {
      const endX = startX + deltaX;
      const endY = startY + deltaY;
      
      // Draw vector line
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();
      
      // Draw arrowhead
      const angle = Math.atan2(deltaY, deltaX);
      const arrowLength = 10;
      
      ctx.beginPath();
      ctx.moveTo(endX, endY);
      ctx.lineTo(
        endX - arrowLength * Math.cos(angle - Math.PI / 6),
        endY - arrowLength * Math.sin(angle - Math.PI / 6)
      );
      ctx.lineTo(
        endX - arrowLength * Math.cos(angle + Math.PI / 6),
        endY - arrowLength * Math.sin(angle + Math.PI / 6)
      );
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();
      
      // Draw label
      ctx.fillStyle = color;
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(label, endX + 15, endY - 10);
      
      // Add glow effect
      ctx.shadowBlur = 10;
      ctx.shadowColor = color;
      ctx.fillText(label, endX + 15, endY - 10);
      ctx.shadowBlur = 0;
    };
    
    // Initial drawing
    drawVectorVisualization();
    
    // Redraw on window resize
    const handleResize = () => {
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
      drawVectorVisualization();
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return (
    <div className="vector-explanation-diagram">
      <canvas
        ref={canvasRef}
        width={280}
        height={210}
      />
      
      <style jsx="true">{`
        .vector-explanation-diagram {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255, 165, 0, 0.3);
          border-radius: 8px;
          background-color: rgba(26, 26, 46, 0.7);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2), 0 0 20px rgba(255, 165, 0, 0.1);
          overflow: hidden;
        }
        
        canvas {
          width: 100%;
          height: 100%;
        }
      `}</style>
    </div>
  );
};

export default VectorExplanationDiagram; 