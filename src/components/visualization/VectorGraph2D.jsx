import React, { useEffect, useRef, useState, useCallback } from 'react';
import { createTooltip, removeTooltip, createSimilarityTooltip } from './VectorTooltip';
import { getPointColor, calculateCosineSimilarity, formatSimilarity } from './VectorUtils';
import SimpleLoadingAnimation from './SimpleLoadingAnimation';
import drawAnalogyProjection from './AnalogyProjection';

const VectorGraph2D = ({ 
  coordinates, 
  words, 
  containerRef, 
  rulerActive,
  selectionMode = false,
  onPointSelected = null,
  selectedPoints = [],
  analogyMode = false,
  analogyStep = 0,
  isSearchingAnalogy = false
}) => {
  const canvasRef = useRef(null);
  const pointsRef = useRef([]);
  const [isLoading, setIsLoading] = useState(true);
  const animationFrameRef = useRef(null);
  
  // Cancel animation frame on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);
  
  // Animation function for the analogy projection
  const animateAnalogyProjection = useCallback(() => {
    if (!canvasRef.current || !pointsRef.current.length) {
      console.log('Cannot animate: missing canvas or points');
      return;
    }
    
    if (!isSearchingAnalogy || analogyStep !== 3) {
      console.log('Not in searching state or wrong step:', { isSearchingAnalogy, analogyStep });
      return;
    }
    
    if (selectedPoints.length < 3) {
      console.log('Not enough selected points for projection');
      return;
    }
    
    // Get the points needed for the projection
    const points = pointsRef.current;
    const sourcePoint = points.find(p => p.word === selectedPoints[2]);
    const point1 = points.find(p => p.word === selectedPoints[0]);
    const point2 = points.find(p => p.word === selectedPoints[1]);
    
    if (!sourcePoint || !point1 || !point2) {
      console.log('Missing required points for projection', { 
        hasSourcePoint: !!sourcePoint, 
        hasPoint1: !!point1, 
        hasPoint2: !!point2,
        selectedPoints
      });
      return;
    }
    
    // Draw the visualization
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    
    // Redraw the full visualization to avoid artifacts
    drawVisualization(coordinates);
    
    // Draw the analogy projection with the current timestamp for animation
    const timestamp = performance.now();
    drawAnalogyProjection(sourcePoint, point1, point2, ctx, timestamp);
    
    // Continue animation
    animationFrameRef.current = requestAnimationFrame(animateAnalogyProjection);
  }, [isSearchingAnalogy, analogyStep, selectedPoints, coordinates]);
  
  // Start or stop projection animation when search state changes
  useEffect(() => {
    console.log('Analogy search state changed:', { 
      isSearchingAnalogy, 
      analogyStep, 
      selectedPoints
    });
    
    if (isSearchingAnalogy && analogyStep === 3) {
      console.log('Starting analogy projection animation');
      animationFrameRef.current = requestAnimationFrame(animateAnalogyProjection);
    } else if (animationFrameRef.current) {
      console.log('Stopping analogy projection animation');
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [isSearchingAnalogy, analogyStep, animateAnalogyProjection, selectedPoints]);
  
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
        console.log('No coordinates to draw, clearing graph');
        setIsLoading(false); // Changed from true to false to avoid showing loading animation
        
        // Draw empty state with visible background
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
          // Clear the entire canvas
          ctx.fillStyle = '#1a1a2e'; // Dark blue background
          ctx.fillRect(0, 0, width, height);
          // Reset any stored point data
          pointsRef.current = [];
          window.similarityLabels = [];
          console.log('Graph cleared successfully');
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
  }, [coordinates, containerRef, rulerActive, selectedPoints, selectionMode, analogyMode, analogyStep, isSearchingAnalogy]);
  
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
      const isSelected = selectedPoints.includes(point.word);
      
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
        isAnalogy,
        isSelected
      });
      
      // Draw point
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = getPointColor(
        point.word, 
        words, 
        isPrimary, 
        isContextSample, 
        isAnalogy,
        point.isSlice,
        point.isMainPoint,
        point.isEndpoint,
        point.sliceLevel
      );
      ctx.fill();
      
      // Add highlight for selected points
      if (isSelected) {
        ctx.beginPath();
        ctx.arc(x, y, radius + 3, 0, Math.PI * 2);
        ctx.strokeStyle = '#4285F4';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
      
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

    // Draw slice progression lines if slice points exist
    drawSliceLines(ctx, pointsRef.current);

    // Draw analogy selection lines if in analogy mode
    if (analogyMode && selectedPoints.length > 0) {
      drawAnalogySelectionLines(ctx, pointsRef.current, selectedPoints);
    }
    // Only draw analogy result lines if not in active selection mode
    else if (!analogyMode && !selectionMode) {
      drawAnalogyLines(ctx, pointsRef.current);
    }
    
    // Draw midpoint lines when midpoints exist 
    drawMidpointLines(ctx, pointsRef.current);
    
    // Display selection mode indicator if active
    if (selectionMode && !analogyMode) {
      const message = `Selection Mode: Click on a word to select (${selectedPoints.length}/2)`;
      ctx.font = 'bold 14px Arial';
      ctx.fillStyle = '#4285F4';
      ctx.textAlign = 'center';
      ctx.fillText(message, canvas.width / 2, 30);
    }
    else if (analogyMode) {
      const message = `Analogy Mode: Step ${analogyStep + 1}`;
      ctx.font = 'bold 14px Arial';
      ctx.fillStyle = '#FF8008';
      ctx.textAlign = 'center';
      ctx.fillText(message, canvas.width / 2, 30);
    }
  };
  
  // Function to draw ruler lines between points
  const drawRulerLines = (ctx, points) => {
    // Find primary words (words from the user input)
    const primaryPoints = points.filter(point => point.isPrimary);
    
    // Early return if we don't have enough points
    if (primaryPoints.length < 2) return;
    
    // Enhanced vector extraction with better error handling and debugging
    const extractVector = (vecStr, point) => {
      // Enhanced debugging
      console.log('Attempting to extract vector for:', point?.word || 'unknown word');
    
      // First try to use the measureVector if available (most accurate)
      if (point && point.measureVector && Array.isArray(point.measureVector)) {
        console.log('Using measureVector property:', point.measureVector.length, 'elements');
        return point.measureVector;
      }
      
      // Try to use vectors array if available (fallback for direct JSON conversion)
      if (point && point.vectors && Array.isArray(point.vectors)) {
        console.log('Using vectors array property:', point.vectors.length, 'elements');
        return point.vectors;
      }

      // Special fallback: If we have coordinates but no vectors, create synthetic vectors
      // This allows for visual measurement even if real vector data is missing
      if (point && point.x !== undefined && point.y !== undefined) {
        const syntheticVector = [point.x, point.y];
        if (point.z !== undefined) {
          syntheticVector.push(point.z);
        }
        console.log('FALLBACK: Created synthetic vector from coordinates:', syntheticVector);
        return syntheticVector;
      }
      
      // Debug information about the vector string
      console.log('Vector string to extract:', vecStr, typeof vecStr);
      
      if (!vecStr) {
        console.log('Missing vector string');
        return null;
      }

      // Try different patterns to extract vector values
      // Pattern 1: Standard format with [...] notation
      if (typeof vecStr === 'string') {
        let matches = vecStr.match(/\[(.*?)\.\.\.]/);
        if (matches && matches[1]) {
          try {
            const values = matches[1].split(',').map(num => parseFloat(num.trim()));
            console.log('Pattern 1 extracted vector:', values.length, 'elements');
            return values;
          } catch (e) {
            console.error('Failed to parse vector format 1:', e);
          }
        }

        // Pattern 2: Try to extract array content with any character separator
        matches = vecStr.match(/\[(.*?)\]/);
        if (matches && matches[1]) {
          try {
            const values = matches[1].split(/[,\s]+/).map(num => parseFloat(num.trim()));
            console.log('Pattern 2 extracted vector:', values.length, 'elements');
            return values;
          } catch (e) {
            console.error('Failed to parse vector format 2:', e);
          }
        }
      }
      
      // Pattern 3: If it's already an array, use it directly
      if (Array.isArray(vecStr)) {
        console.log('Pattern 3 using existing array:', vecStr.length, 'elements');
        return vecStr;
      }
      
      // Pattern 4: If point has a fullVector property (might be in some deployments)
      if (point && point.fullVector && Array.isArray(point.fullVector)) {
        console.log('Pattern 4 using fullVector property:', point.fullVector.length, 'elements');
        return point.fullVector.slice(0, 5); // Just use first few dimensions
      }
      
      console.log('No vector extraction patterns matched');
      return null;
    };
    
    // Store similarity labels for hover detection
    const similarityLabels = [];

    // Draw lines between each pair of primary points
    for (let i = 0; i < primaryPoints.length; i++) {
      for (let j = i + 1; j < primaryPoints.length; j++) {
        const point1 = primaryPoints[i];
        const point2 = primaryPoints[j];
        
        // Debug point info
        console.log('Ruler point data:', {
          point1: {
            word: point1.word,
            hasVector: !!point1.truncatedVector
          },
          point2: {
            word: point2.word,
            hasVector: !!point2.truncatedVector
          }
        });
        
        // Draw line between points
        ctx.beginPath();
        ctx.moveTo(point1.x, point1.y);
        ctx.lineTo(point2.x, point2.y);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]); // Dashed line
        ctx.stroke();
        ctx.setLineDash([]); // Reset to solid line
        
        // Calculate distance between points for label
        // Extract vectors from truncatedVector property
        const vec1 = extractVector(point1.truncatedVector, point1);
        const vec2 = extractVector(point2.truncatedVector, point2);
        
        // Log vector extraction results
        console.log('Extracted vectors:', {
          vec1: vec1 ? `${vec1.length} elements` : 'null',
          vec2: vec2 ? `${vec2.length} elements` : 'null'
        });
        
        // Calculate similarity only if we have valid vectors
        let distance = null;
        if (vec1 && vec2) {
          distance = calculateCosineSimilarity(vec1, vec2);
          console.log('Calculated similarity:', distance);
        } else {
          console.log('Cannot calculate similarity: missing vectors');
        }
        
        // Draw distance label at midpoint of line
        const midX = (point1.x + point2.x) / 2;
        const midY = (point1.y + point2.y) / 2;
        
        // Add background for better readability
        const distText = formatSimilarity(distance);
        const textWidth = ctx.measureText(distText).width;
        
        // Background with a slight highlight to indicate interactivity
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        const labelWidth = textWidth + 10;
        const labelHeight = 20;
        const labelX = midX - labelWidth / 2;
        const labelY = midY - 10;
        ctx.fillRect(labelX, labelY, labelWidth, labelHeight);
        
        // Add slight border to indicate interactivity
        ctx.strokeStyle = 'rgba(66, 133, 244, 0.4)';
        ctx.lineWidth = 1;
        ctx.strokeRect(labelX, labelY, labelWidth, labelHeight);
        
        // Draw text
        ctx.font = '12px Arial';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(distText, midX, midY);
        
        // Store label information for hover detection
        similarityLabels.push({
          x: labelX,
          y: labelY,
          width: labelWidth,
          height: labelHeight,
          similarity: distText,
          words: [point1.word, point2.word]
        });
      }
    }
    
    // Store the similarity labels in a ref to access in mouse events
    window.similarityLabels = similarityLabels;
  };
  
  // Function to draw analogy lines between points
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
    
    // Then if we have a third word (king) and at least one analogy result (queen)
    if (primaryPoints.length >= 3 && analogyPoints.length > 0) {
      const point3 = primaryPoints[2]; // king
      const arrowSize = 8;
      
      // Find the "best" analogy result (highest score)
      const bestAnalogy = analogyPoints.reduce(
        (best, current) => (!best || (current.score > best.score) ? current : best), 
        null
      );
      
      if (bestAnalogy) {
        // Draw line from king to queen
        ctx.beginPath();
        ctx.moveTo(point3.x, point3.y);
        ctx.lineTo(bestAnalogy.x, bestAnalogy.y);
        ctx.strokeStyle = 'rgba(156, 39, 176, 0.8)';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Arrow at destination (queen)
        const angle2 = Math.atan2(bestAnalogy.y - point3.y, bestAnalogy.x - point3.x);
        const arrowX2 = bestAnalogy.x - Math.cos(angle2) * (bestAnalogy.radius + 2);
        const arrowY2 = bestAnalogy.y - Math.sin(angle2) * (bestAnalogy.radius + 2);
        
        ctx.beginPath();
        ctx.moveTo(
          arrowX2 - Math.cos(angle2 - Math.PI/6) * arrowSize,
          arrowY2 - Math.sin(angle2 - Math.PI/6) * arrowSize
        );
        ctx.lineTo(arrowX2, arrowY2);
        ctx.lineTo(
          arrowX2 - Math.cos(angle2 + Math.PI/6) * arrowSize,
          arrowY2 - Math.sin(angle2 + Math.PI/6) * arrowSize
        );
        ctx.fillStyle = 'rgba(156, 39, 176, 0.8)';
        ctx.fill();
      }
      
      // If we have a best analogy result, draw a dashed line between the two relationships
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
  
  // Function to draw slice progression lines showing the path through the vector space
  const drawSliceLines = (ctx, points) => {
    // Find all slice points
    const slicePoints = points.filter(point => point.isSlice);
    
    // If there are not enough points for a path, return
    if (slicePoints.length < 2) return;
    
    // Separate endpoints and intermediate points
    const startPoint = slicePoints.find(p => p.sliceIndex === 0);
    const endPoint = slicePoints.find(p => p.sliceIndex === 1);
    const intermediatePoints = slicePoints.filter(p => p.sliceIndex > 1);
    
    // We need at least the start and end points
    if (!startPoint || !endPoint) {
      console.error("Slice path missing start or end point.", { startPoint, endPoint });
      return; // Cannot draw path without endpoints
    }
    
    // Sort ONLY the intermediate points by index
    intermediatePoints.sort((a, b) => a.sliceIndex - b.sliceIndex);
    
    // Start drawing the path
    ctx.beginPath();
    // Move to the start point
    ctx.moveTo(startPoint.x, startPoint.y);
    
    // Create gradient path (optional, but nice)
    const gradient = ctx.createLinearGradient(
      startPoint.x, startPoint.y, 
      endPoint.x, endPoint.y
    );
    gradient.addColorStop(0, '#8E44AD');    // Start with deeper purple
    gradient.addColorStop(1, '#9B59B6');    // End with medium purple
    
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 2;
    
    // Draw lines through all intermediate points in sorted order
    for (const intermediatePoint of intermediatePoints) {
      ctx.lineTo(intermediatePoint.x, intermediatePoint.y);
    }
    
    // Finally, draw the line to the end point
    ctx.lineTo(endPoint.x, endPoint.y);
    
    // Render the complete path
    ctx.stroke();
    
    // --- Draw Arrows --- 
    // Create the full path sequence for arrow calculation
    const fullPath = [startPoint, ...intermediatePoints, endPoint];

    // Add direction arrows along the path segments
    for (let i = 1; i < fullPath.length; i++) {
      const start = fullPath[i - 1];
      const end = fullPath[i];
      
      // Calculate direction vector
      const dirX = end.x - start.x;
      const dirY = end.y - start.y;
      const length = Math.sqrt(dirX * dirX + dirY * dirY);
      
      // Normalize direction vector
      const normDirX = dirX / length;
      const normDirY = dirY / length;
      
      // Calculate position 70% along the line
      const arrowX = start.x + normDirX * length * 0.7;
      const arrowY = start.y + normDirY * length * 0.7;
      
      // Draw arrow
      const arrowSize = 5;
      ctx.beginPath();
      ctx.moveTo(arrowX, arrowY);
      ctx.lineTo(
        arrowX - arrowSize * (normDirX + normDirY * 0.5),
        arrowY - arrowSize * (normDirY - normDirX * 0.5)
      );
      ctx.lineTo(
        arrowX - arrowSize * (normDirX - normDirY * 0.5),
        arrowY - arrowSize * (normDirY + normDirX * 0.5)
      );
      ctx.closePath();
      ctx.fillStyle = '#9B59B6';
      ctx.fill();
    }
  };

  const drawAnalogySelectionLines = (ctx, points, selectedWords) => {
    if (selectedWords.length < 2) return;

    // Get the points for the selected words
    const selectedPoints = [];
    
    for (const word of selectedWords) {
      const point = points.find(p => p.word === word);
      if (point) {
        selectedPoints.push(point);
      }
    }
    
    // Draw lines between consecutive selected points
    for (let i = 0; i < selectedPoints.length - 1; i++) {
      const point1 = selectedPoints[i];
      const point2 = selectedPoints[i + 1];
      
      ctx.beginPath();
      ctx.moveTo(point1.x, point1.y);
      ctx.lineTo(point2.x, point2.y);
      
      if (analogyMode) {
        ctx.strokeStyle = 'rgba(255, 128, 8, 0.7)'; // Orange for analogy
      } else {
        ctx.strokeStyle = 'rgba(66, 133, 244, 0.7)'; // Blue for regular selection
      }
      
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 3]); // Dashed line
      ctx.stroke();
      ctx.setLineDash([]); // Reset to solid line
    }
  };
  
  // Handle mouse move for point and similarity label hovering
  const handleMouseMove = (e) => {
    if (!canvasRef.current || !pointsRef.current.length) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Check if mouse is over any similarity label first (prioritize these)
    const similarityLabels = window.similarityLabels || [];
    let hoveredLabel = null;
    
    for (const label of similarityLabels) {
      if (
        mouseX >= label.x && 
        mouseX <= label.x + label.width && 
        mouseY >= label.y && 
        mouseY <= label.y + label.height
      ) {
        hoveredLabel = label;
        break;
      }
    }
    
    if (hoveredLabel) {
      canvasRef.current.style.cursor = 'help';
      createSimilarityTooltip(e, hoveredLabel.similarity);
      return;
    }
    
    // If not over a similarity label, check for points
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
  
  // Update handle click to support both midpoint and analogy modes
  const handleClick = (e) => {
    // Log all the conditions to better understand why this might not be triggering
    console.log('Click event on canvas detected:', {
      selectionMode,
      analogyMode,
      analogyStep,
      selectedPointsCount: selectedPoints.length,
      hasOnPointSelected: !!onPointSelected,
      hasCanvas: !!canvasRef.current,
      hasPoints: pointsRef.current.length > 0,
      willProceed: (selectionMode || analogyMode) && !!onPointSelected && !!canvasRef.current && pointsRef.current.length > 0
    });
    
    if ((!selectionMode && !analogyMode) || !onPointSelected || !canvasRef.current || !pointsRef.current.length) {
      console.log('Aborting click processing due to conditions not met');
      return;
    }
    
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Check if mouse is over any point
    let foundPoint = false;
    for (const point of pointsRef.current) {
      const distance = Math.sqrt(
        Math.pow(mouseX - point.x, 2) + Math.pow(mouseY - point.y, 2)
      );
      
      if (distance <= point.radius) {
        // Log the point being selected
        console.log('Selected point:', point.word, { 
          selectionMode, 
          analogyMode,
          analogyStep,
          selectedWords: selectedPoints 
        });
        
        // Trigger the selection callback
        onPointSelected(point.word);
        foundPoint = true;
        break;
      }
    }
    
    if (!foundPoint) {
      console.log('Click did not hit any point');
    }
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
          onClick={handleClick}
        />
      )}
    </>
  );
};

export default VectorGraph2D;