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
      ctx.fillStyle = '#f8f9fa';
      ctx.fillRect(0, 0, width, height);
      
      // Draw coordinate system
      const originX = width / 2;
      const originY = height / 2;
      
      // Draw axes
      ctx.strokeStyle = '#ccc';
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
      ctx.fillStyle = '#666';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      
      // X-axis label
      ctx.fillText('x', width - 15, originY + 15);
      
      // Y-axis label
      ctx.fillText('y', originX + 15, 15);
      
      // Draw grid
      ctx.strokeStyle = '#eee';
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
      // Vector 1: (3, 1)
      drawVector(originX, originY, 60, -20, '#4285F4', 'word1');
      
      // Vector 2: (1, 3)
      drawVector(originX, originY, 20, -60, '#EA4335', 'word2');
      
      // Vector 3: (2, 2)
      drawVector(originX, originY, 40, -40, '#34A853', 'word3');
      
      // Draw origin label
      ctx.fillStyle = '#000';
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
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          background-color: #fff;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
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