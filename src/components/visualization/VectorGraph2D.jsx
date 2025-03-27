import React, { useEffect, useRef, useState } from 'react';
import { createTooltip, removeTooltip } from './VectorTooltip';
import { getPointColor, calculateCosineSimilarity, formatSimilarity } from './VectorUtils';
import SimpleLoadingAnimation from './SimpleLoadingAnimation';

const VectorGraph2D = ({ coordinates, words, containerRef, rulerActive }) => {
  const canvasRef = useRef(null);
  const pointsRef = useRef([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    setIsLoading(coordinates.length === 0);
    
    const resizeCanvas = () => {
      if (!containerRef.current || !canvasRef.current) {
        console.log('Missing refs:', { 
          container: !!containerRef.current, 
          canvas: !!canvasRef.current 
        });
        return;
      }
      
      const container = containerRef.current;
      const width = container.clientWidth;
      const height = container.clientHeight;
      
      console.log('Canvas dimensions:', { width, height });
      
      // Resize 2D canvas with explicit dimensions
      canvasRef.current.width = width;
      canvasRef.current.height = height;
      canvasRef.current.style.width = `${width}px`;
      canvasRef.current.style.height = `${height}px`;
      
      // Redraw visualization if we have coordinates
      if (coordinates.length > 0) {
        // Filter out coordinates with isAnalogy = true to put them on top
        const regularCoords = coordinates.filter(coord => !coord.isAnalogy);
        const analogyCoords = coordinates.filter(coord => coord.isAnalogy);
        
        // Sort coordinates so that analogy results are processed last (drawn on top)
        const sortedCoordinates = [...regularCoords, ...analogyCoords];
        
        drawVisualization(sortedCoordinates);
        setIsLoading(false);
      } else {
        console.log('No coordinates to draw');
        setIsLoading(true);
        
        // Draw empty state with visible background
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#1a1a2e'; // Dark blue background
          ctx.fillRect(0, 0, width, height);
        }
      }
    };
    
    // Initial resize
    resizeCanvas();
    
    // Add resize event listener
    window.addEventListener('resize', resizeCanvas);
    
    // Clean up
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [coordinates, containerRef, rulerActive]);
  
  const drawVisualization = (coordsToRender = coordinates) => {
    if (!coordsToRender.length || !canvasRef.current) {
      console.log('Cannot draw visualization:', { 
        hasCoordinates: coordsToRender.length > 0,
        hasCanvas: !!canvasRef.current
      });
      return;
    }
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      console.error('Failed to get 2D context from canvas');
      return;
    }
    
    console.log('Drawing 2D visualization with', coordsToRender.length, 'points');
    
    // Clear the canvas with a visible background color
    ctx.fillStyle = '#1a1a2e'; // Dark blue background
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Find min/max values to scale the plot
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    
    coordsToRender.forEach(point => {
      minX = Math.min(minX, point.x);
      maxX = Math.max(maxX, point.x);
      minY = Math.min(minY, point.y);
      maxY = Math.max(maxY, point.y);
    });
    
    // Add padding
    const padding = 120;
    const plotWidth = canvas.width - (padding * 2);
    const plotHeight = canvas.height - (padding * 2);
    
    // Scale function to map coordinates to canvas
    const scaleX = (x) => padding + ((x - minX) / (maxX - minX)) * plotWidth;
    const scaleY = (y) => padding + ((y - minY) / (maxY - minY)) * plotHeight;
    
    // Draw points
    pointsRef.current = [];
    
    coordsToRender.forEach(point => {
      const x = scaleX(point.x);
      const y = scaleY(point.y);
      const isPrimary = words.includes(point.word);
      const isContextSample = point.isContextSample === true;
      const isAnalogy = point.isAnalogy === true;
      
      // Log for debugging the first time we process an analogy point
      if (isAnalogy && !window.loggedAnalogy) {
        console.log('Processing analogy point:', point);
        window.loggedAnalogy = true;
      }
      
      // Determine radius based on point type
      let radius;
      if (isPrimary) {
        radius = 8; // Primary words (user input)
      } else if (isAnalogy) {
        radius = 7; // Analogy results (slightly larger than related)
      } else if (isContextSample) {
        radius = 3; // Context sample words (smaller)
      } else {
        radius = 5; // Related words
      }
      
      // Store point info for interaction
      pointsRef.current.push({
        ...point,
        x,
        y,
        radius,
        isPrimary,
        isContextSample,
        isAnalogy
      });
      
      // Draw point
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = getPointColor(point.word, words, isPrimary, isContextSample, isAnalogy);
      ctx.fill();
      
      // Draw label only for primary words, analogy results, and related words (not context samples)
      if (!isContextSample || isPrimary || isAnalogy) {
        ctx.font = isPrimary ? 'bold 14px Arial' : (isAnalogy ? 'bold 13px Arial' : '12px Arial');
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.fillText(point.word, x, y - radius - 5);
      }
    });
    
    // After drawing all points, draw ruler lines if active
    if (rulerActive && words.length >= 2) {
      drawRulerLines(ctx, pointsRef.current);
    }

    // Always draw analogy lines when analogies exist (regardless of ruler setting)
    drawAnalogyLines(ctx, pointsRef.current);
    
    // Draw midpoint lines when midpoints exist 
    drawMidpointLines(ctx, pointsRef.current);
  };
  
  // Function to draw ruler lines between points
  const drawRulerLines = (ctx, points) => {
    // Filter to only get primary words
    const primaryPoints = points.filter(point => point.isPrimary);
    
    // Draw lines between each pair of primary points
    for (let i = 0; i < primaryPoints.length; i++) {
      for (let j = i + 1; j < primaryPoints.length; j++) {
        const point1 = primaryPoints[i];
        const point2 = primaryPoints[j];
        
        // Draw line
        ctx.beginPath();
        ctx.moveTo(point1.x, point1.y);
        ctx.lineTo(point2.x, point2.y);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 3]); // Dashed line
        ctx.stroke();
        ctx.setLineDash([]); // Reset to solid line
        
        // Calculate midpoint for label
        const midX = (point1.x + point2.x) / 2;
        const midY = (point1.y + point2.y) / 2;
        
        // Find the original vectors for these points
        const vector1 = coordinates.find(c => c.word === point1.word)?.truncatedVector;
        const vector2 = coordinates.find(c => c.word === point2.word)?.truncatedVector;
        
        // Calculate similarity if we have the vectors
        let similarityText = "No vector data";
        if (vector1 && vector2) {
          // Extract numeric values from truncated vector strings
          const extractVector = (vecStr) => {
            if (typeof vecStr !== 'string') return null;
            const matches = vecStr.match(/\[(.*?)\.\.\.]/);
            if (!matches || !matches[1]) return null;
            return matches[1].split(',').map(num => parseFloat(num.trim()));
          };
          
          const vec1 = extractVector(vector1);
          const vec2 = extractVector(vector2);
          
          if (vec1 && vec2) {
            const similarity = calculateCosineSimilarity(vec1, vec2);
            similarityText = formatSimilarity(similarity);
          }
        }
        
        // Draw similarity label
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(midX - 30, midY - 10, 60, 20);
        ctx.fillStyle = '#ffffff';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(similarityText, midX, midY);
      }
    }
  };
  
  // Add the drawAnalogyLines function right after drawRulerLines
  const drawAnalogyLines = (ctx, points) => {
    // Find primary words and analogy points
    const primaryPoints = points.filter(point => point.isPrimary);
    const analogyPoints = points.filter(point => point.isAnalogy);
    
    // Early return if no analogy points
    if (analogyPoints.length === 0) return;
    
    // If we have an analogy result like "man:woman::king:queen"
    // First draw a line between the first two words (man-woman)
    if (primaryPoints.length >= 2) {
      const point1 = primaryPoints[0]; // man
      const point2 = primaryPoints[1]; // woman
      
      ctx.beginPath();
      ctx.moveTo(point1.x, point1.y);
      ctx.lineTo(point2.x, point2.y);
      ctx.strokeStyle = 'rgba(156, 39, 176, 0.8)'; // Solid purple for first analogy pair
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Add small lines at the end of the first pair to indicate direction
      const angle1 = Math.atan2(point2.y - point1.y, point2.x - point1.x);
      const arrowSize = 8;
      
      // Arrow at destination (woman)
      const arrowX1 = point2.x - Math.cos(angle1) * (point2.radius + 2);
      const arrowY1 = point2.y - Math.sin(angle1) * (point2.radius + 2);
      
      ctx.beginPath();
      ctx.moveTo(
        arrowX1 - Math.cos(angle1 - Math.PI/6) * arrowSize,
        arrowY1 - Math.sin(angle1 - Math.PI/6) * arrowSize
      );
      ctx.lineTo(arrowX1, arrowY1);
      ctx.lineTo(
        arrowX1 - Math.cos(angle1 + Math.PI/6) * arrowSize,
        arrowY1 - Math.sin(angle1 + Math.PI/6) * arrowSize
      );
      ctx.fillStyle = 'rgba(156, 39, 176, 0.8)';
      ctx.fill();
    }
      
    // If we have at least 3 primary words and at least one analogy result
    if (primaryPoints.length >= 3 && analogyPoints.length > 0) {
      const sourceWord = primaryPoints[2]; // king in man:woman::king:?
      
      // Connect king to each of its analogy results (queen, etc.)
      analogyPoints.forEach(analogyPoint => {
        ctx.beginPath();
        ctx.moveTo(sourceWord.x, sourceWord.y);
        ctx.lineTo(analogyPoint.x, analogyPoint.y);
        ctx.strokeStyle = 'rgba(156, 39, 176, 0.8)'; // Solid purple for analogy lines
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Add arrow at the end of each analogy result
        const angle = Math.atan2(analogyPoint.y - sourceWord.y, analogyPoint.x - sourceWord.x);
        const arrowSize = 8;
        const arrowX = analogyPoint.x - Math.cos(angle) * (analogyPoint.radius + 2);
        const arrowY = analogyPoint.y - Math.sin(angle) * (analogyPoint.radius + 2);
        
        ctx.beginPath();
        ctx.moveTo(
          arrowX - Math.cos(angle - Math.PI/6) * arrowSize,
          arrowY - Math.sin(angle - Math.PI/6) * arrowSize
        );
        ctx.lineTo(arrowX, arrowY);
        ctx.lineTo(
          arrowX - Math.cos(angle + Math.PI/6) * arrowSize,
          arrowY - Math.sin(angle + Math.PI/6) * arrowSize
        );
        ctx.fillStyle = 'rgba(156, 39, 176, 0.8)';
        ctx.fill();
      });
      
      // Now draw a parallel line between the analogy pair and results
      // This connects the man-woman pair to the king-queen pair visually
      // First find the "best" analogy result (highest score)
      if (analogyPoints.length > 0) {
        const bestAnalogy = analogyPoints.reduce(
          (best, current) => (!best || (current.score > best.score) ? current : best), 
          null
        );
        
        if (bestAnalogy && primaryPoints[0] && primaryPoints[1] && primaryPoints[2]) {
          const midpoint1 = {
            x: (primaryPoints[0].x + primaryPoints[1].x) / 2,
            y: (primaryPoints[0].y + primaryPoints[1].y) / 2
          };
          
          const midpoint2 = {
            x: (primaryPoints[2].x + bestAnalogy.x) / 2,
            y: (primaryPoints[2].y + bestAnalogy.y) / 2
          };
          
          // Draw dashed connecting line between the two analogies
          ctx.beginPath();
          ctx.moveTo(midpoint1.x, midpoint1.y);
          ctx.lineTo(midpoint2.x, midpoint2.y);
          ctx.strokeStyle = 'rgba(156, 39, 176, 0.5)'; // Translucent purple
          ctx.lineWidth = 1.5;
          ctx.setLineDash([5, 5]); // Dashed line to show relationship
          ctx.stroke();
          ctx.setLineDash([]); // Reset to solid line
        }
      }
    }
  };
  
  // Function to draw midpoint lines between points
  const drawMidpointLines = (ctx, points) => {
    // Find midpoint points
    const midpointPoints = points.filter(point => point.isMidpoint);
    
    // Debug midpoint points
    console.log('Midpoint points for visualization:', midpointPoints);
    
    // Early return if no midpoint points
    if (midpointPoints.length === 0) {
      console.log('No midpoint points found in the visualization data');
      return;
    }
    
    // Draw connections for each midpoint point
    midpointPoints.forEach(midpointPoint => {
      if (!midpointPoint.midpointSource || !midpointPoint.midpointSource.fromWords) {
        console.log('Midpoint point missing source or fromWords:', midpointPoint);
        return;
      }
      
      // Only draw lines for primary results (the closest word to the theoretical midpoint)
      if (!midpointPoint.midpointSource.isPrimaryResult) return;
      
      // Get the source words that this midpoint is between
      const [word1, word2] = midpointPoint.midpointSource.fromWords;
      
      // Find the points for these words
      const sourcePoint1 = points.find(p => p.word === word1);
      const sourcePoint2 = points.find(p => p.word === word2);
      
      if (!sourcePoint1 || !sourcePoint2) return;
      
      // Draw line from source1 to midpoint
      ctx.beginPath();
      ctx.moveTo(sourcePoint1.x, sourcePoint1.y);
      ctx.lineTo(midpointPoint.x, midpointPoint.y);
      
      // Use different colors based on midpoint level
      let lineColor;
      if (midpointPoint.midpointLevel === 'primary') {
        lineColor = 'rgba(52, 168, 83, 0.6)'; // Green for primary midpoints
      } else if (midpointPoint.midpointLevel === 'secondary') {
        lineColor = 'rgba(66, 133, 244, 0.6)'; // Blue for secondary midpoints
      } else {
        lineColor = 'rgba(251, 188, 5, 0.6)'; // Yellow for tertiary midpoints
      }
      
      ctx.strokeStyle = lineColor;
      ctx.lineWidth = 1.5;
      ctx.setLineDash([5, 3]); // Dashed line
      ctx.stroke();
      
      // Draw line from midpoint to source2
      ctx.beginPath();
      ctx.moveTo(midpointPoint.x, midpointPoint.y);
      ctx.lineTo(sourcePoint2.x, sourcePoint2.y);
      ctx.stroke();
      ctx.setLineDash([]); // Reset to solid line
      
      // Add a small circle at the theoretical midpoint position (if we had coordinates)
      // This is just a visual indicator of where the true midpoint would be
      if (midpointPoint.midpointSource.theoreticalMidpoint) {
        // We don't have actual coordinates for the theoretical midpoint
        // So we'll just place it at the midpoint of the line between source1 and source2
        const theoreticalX = (sourcePoint1.x + sourcePoint2.x) / 2;
        const theoreticalY = (sourcePoint1.y + sourcePoint2.y) / 2;
        
        ctx.beginPath();
        ctx.arc(theoreticalX, theoreticalY, 3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.fill();
        
        // Draw a dotted line from theoretical midpoint to the actual nearest word
        ctx.beginPath();
        ctx.moveTo(theoreticalX, theoreticalY);
        ctx.lineTo(midpointPoint.x, midpointPoint.y);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.setLineDash([2, 2]); // Fine dotted line
        ctx.stroke();
        ctx.setLineDash([]); // Reset to solid line
      }
    });
  };
  
  // Handle mouse interactions
  const handleMouseMove = (e) => {
    if (!canvasRef.current || !pointsRef.current.length) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Check if mouse is over any point
    let hoveredPoint = null;
    
    for (const point of pointsRef.current) {
      const distance = Math.sqrt(
        Math.pow(mouseX - point.x, 2) + Math.pow(mouseY - point.y, 2)
      );
      
      if (distance <= point.radius) {
        hoveredPoint = point;
        break;
      }
    }
    
    if (hoveredPoint) {
      canvasRef.current.style.cursor = 'pointer';
      createTooltip(hoveredPoint, e);
    } else {
      canvasRef.current.style.cursor = 'default';
      removeTooltip();
    }
  };
  
  const handleMouseLeave = () => {
    removeTooltip();
  };
  
  return (
    <>
      {isLoading ? (
        <SimpleLoadingAnimation 
          width={containerRef.current?.clientWidth || 800} 
          height={containerRef.current?.clientHeight || 600} 
        />
      ) : (
        <canvas 
          ref={canvasRef} 
          className="vector-canvas"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        />
      )}
    </>
  );
};

export default VectorGraph2D;