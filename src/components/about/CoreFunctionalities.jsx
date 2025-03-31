import React, { useState, useEffect, useRef } from 'react';

// Sample data for visualizations
const sampleWordVectors = {
  // Common words with their 2D projections
  "king": [0.2, 0.8],
  "queen": [0.3, 0.9],
  "man": [-0.1, 0.7],
  "woman": [0.0, 0.8],
  "computer": [0.8, -0.3],
  "technology": [0.7, -0.2],
  "science": [0.6, -0.1],
  "art": [-0.7, -0.5],
  "music": [-0.8, -0.4],
  "painting": [-0.9, -0.6],
  "dog": [0.4, -0.8],
  "cat": [0.3, -0.9],
  "animal": [0.5, -0.7],
  "food": [-0.4, -0.2],
  "fruit": [-0.5, -0.3],
  "vegetable": [-0.6, -0.4],
  "ocean": [-0.2, 0.4],
  "mountain": [0.1, 0.5],
  "river": [-0.3, 0.3],
  "forest": [0.0, 0.4]
};

// Sample nearest neighbors
const nearestNeighbors = {
  "ocean": ["sea", "river", "lake", "water", "coastal"],
  "mountain": ["hill", "peak", "valley", "terrain", "summit"],
  "computer": ["laptop", "desktop", "device", "machine", "system"]
};

const CoreFunctionalities = () => {
  // Refs for canvas elements
  const spatialCanvasRef = useRef(null);
  const nearestCanvasRef = useRef(null);
  const midpointCanvasRef = useRef(null);
  const distanceCanvasRef = useRef(null);
  
  // State for canvas sizes
  const [canvasSizes, setCanvasSizes] = useState({
    spatial: { width: 300, height: 200 },
    nearest: { width: 300, height: 200 },
    midpoint: { width: 300, height: 200 },
    distance: { width: 300, height: 200 }
  });
  
  // State for selected words in each visualization
  const [selectedWord, setSelectedWord] = useState("ocean");
  const [midpointWords] = useState(["science", "art"]);
  const [distanceWords] = useState(["king", "queen"]);
  
  // Scale coordinates to fit canvas
  const scaleCoordinates = (coords, canvasWidth, canvasHeight) => {
    const padding = 30;
    const xScale = (canvasWidth - padding * 2) / 2;
    const yScale = (canvasHeight - padding * 2) / 2;
    
    return [
      (coords[0] * xScale) + (canvasWidth / 2),
      (coords[1] * -yScale) + (canvasHeight / 2)
    ];
  };
  
  // Draw the spatial visualization
  useEffect(() => {
    if (!spatialCanvasRef.current) return;
    
    const canvas = spatialCanvasRef.current;
    const ctx = canvas.getContext('2d');
    const { width, height } = canvasSizes.spatial;
    
    // Set canvas dimensions
    canvas.width = width;
    canvas.height = height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw axes
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1;
    
    // Horizontal axis
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();
    
    // Vertical axis
    ctx.beginPath();
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2, height);
    ctx.stroke();
    
    // Draw a subset of words
    const wordsToShow = ["king", "queen", "man", "woman", "computer", "science", "art", "music"];
    
    wordsToShow.forEach(word => {
      if (sampleWordVectors[word]) {
        const [x, y] = scaleCoordinates(sampleWordVectors[word], width, height);
        
        // Draw dot
        ctx.beginPath();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw label
        ctx.font = '10px Arial';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.textAlign = 'center';
        ctx.fillText(word, x, y - 8);
      }
    });
  }, [canvasSizes.spatial]);
  
  // Draw the nearest neighbor visualization
  useEffect(() => {
    if (!nearestCanvasRef.current || !selectedWord) return;
    
    const canvas = nearestCanvasRef.current;
    const ctx = canvas.getContext('2d');
    const { width, height } = canvasSizes.nearest;
    
    // Set canvas dimensions
    canvas.width = width;
    canvas.height = height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw axes
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1;
    
    // Horizontal axis
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();
    
    // Vertical axis
    ctx.beginPath();
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2, height);
    ctx.stroke();
    
    // Draw selected word
    if (sampleWordVectors[selectedWord]) {
      const [x, y] = scaleCoordinates(sampleWordVectors[selectedWord], width, height);
      
      // Draw dot for selected word
      ctx.beginPath();
      ctx.fillStyle = '#FFA500';
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw label
      ctx.font = 'bold 12px Arial';
      ctx.fillStyle = '#FFA500';
      ctx.textAlign = 'center';
      ctx.fillText(selectedWord, x, y - 10);
      
      // Draw nearest neighbors
      if (nearestNeighbors[selectedWord]) {
        // Create some fake positions for neighbors
        nearestNeighbors[selectedWord].forEach((word, index) => {
          // Create a position radiating from the selected word
          const angle = (index / nearestNeighbors[selectedWord].length) * Math.PI * 2;
          const distance = 40 + (index * 5); // Increasing distance for each neighbor
          
          const nx = x + Math.cos(angle) * distance;
          const ny = y + Math.sin(angle) * distance;
          
          // Draw connecting line
          ctx.beginPath();
          ctx.strokeStyle = 'rgba(255, 165, 0, 0.3)';
          ctx.lineWidth = 1;
          ctx.moveTo(x, y);
          ctx.lineTo(nx, ny);
          ctx.stroke();
          
          // Draw neighbor dot
          ctx.beginPath();
          ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
          ctx.arc(nx, ny, 3, 0, Math.PI * 2);
          ctx.fill();
          
          // Draw label
          ctx.font = '10px Arial';
          ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
          ctx.textAlign = 'center';
          ctx.fillText(word, nx, ny - 8);
        });
      }
    }
  }, [selectedWord, canvasSizes.nearest]);
  
  // Draw the midpoint visualization
  useEffect(() => {
    if (!midpointCanvasRef.current || midpointWords.length !== 2) return;
    
    const canvas = midpointCanvasRef.current;
    const ctx = canvas.getContext('2d');
    const { width, height } = canvasSizes.midpoint;
    
    // Set canvas dimensions
    canvas.width = width;
    canvas.height = height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw axes
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1;
    
    // Horizontal axis
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();
    
    // Vertical axis
    ctx.beginPath();
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2, height);
    ctx.stroke();
    
    // Draw the two selected words
    const [word1, word2] = midpointWords;
    
    if (sampleWordVectors[word1] && sampleWordVectors[word2]) {
      const [x1, y1] = scaleCoordinates(sampleWordVectors[word1], width, height);
      const [x2, y2] = scaleCoordinates(sampleWordVectors[word2], width, height);
      
      // Draw dots for selected words
      ctx.beginPath();
      ctx.fillStyle = '#FFA500';
      ctx.arc(x1, y1, 5, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.beginPath();
      ctx.fillStyle = '#FFA500';
      ctx.arc(x2, y2, 5, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw labels
      ctx.font = 'bold 12px Arial';
      ctx.fillStyle = '#FFA500';
      ctx.textAlign = 'center';
      ctx.fillText(word1, x1, y1 - 10);
      ctx.fillText(word2, x2, y2 - 10);
      
      // Draw line between words
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(255, 165, 0, 0.6)';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 3]);
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      ctx.setLineDash([]);
      
      // Calculate and draw midpoint
      const midX = (x1 + x2) / 2;
      const midY = (y1 + y2) / 2;
      
      ctx.beginPath();
      ctx.fillStyle = 'rgba(255, 165, 0, 0.8)';
      ctx.arc(midX, midY, 4, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw midpoint label
      ctx.font = 'italic 12px Arial';
      ctx.fillStyle = '#FFA500';
      ctx.textAlign = 'center';
      ctx.fillText('midpoint', midX, midY - 10);
      
      // Draw some "discovered" words near the midpoint
      const discoveredWords = word1 === "science" && word2 === "art" 
        ? ["design", "creative", "innovation"] 
        : ["blend", "hybrid", "fusion"];
      
      discoveredWords.forEach((word, index) => {
        const angle = ((index + 1) / (discoveredWords.length + 1)) * Math.PI;
        const distance = 25;
        
        const dx = midX + Math.cos(angle) * distance;
        const dy = midY + Math.sin(angle) * distance;
        
        // Draw dot
        ctx.beginPath();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.arc(dx, dy, 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw label
        ctx.font = '10px Arial';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.textAlign = 'center';
        ctx.fillText(word, dx, dy - 8);
      });
    }
  }, [midpointWords, canvasSizes.midpoint]);
  
  // Draw the semantic distance visualization
  useEffect(() => {
    if (!distanceCanvasRef.current || distanceWords.length !== 2) return;
    
    const canvas = distanceCanvasRef.current;
    const ctx = canvas.getContext('2d');
    const { width, height } = canvasSizes.distance;
    
    // Set canvas dimensions
    canvas.width = width;
    canvas.height = height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw axes
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1;
    
    // Horizontal axis
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();
    
    // Vertical axis
    ctx.beginPath();
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2, height);
    ctx.stroke();
    
    // Draw the two selected words
    const [word1, word2] = distanceWords;
    
    if (sampleWordVectors[word1] && sampleWordVectors[word2]) {
      const [x1, y1] = scaleCoordinates(sampleWordVectors[word1], width, height);
      const [x2, y2] = scaleCoordinates(sampleWordVectors[word2], width, height);
      
      // Draw dots for selected words
      ctx.beginPath();
      ctx.fillStyle = '#FFA500';
      ctx.arc(x1, y1, 5, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.beginPath();
      ctx.fillStyle = '#FFA500';
      ctx.arc(x2, y2, 5, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw labels
      ctx.font = 'bold 12px Arial';
      ctx.fillStyle = '#FFA500';
      ctx.textAlign = 'center';
      ctx.fillText(word1, x1, y1 - 10);
      ctx.fillText(word2, x2, y2 - 10);
      
      // Draw line between words
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(255, 165, 0, 0.6)';
      ctx.lineWidth = 2;
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      
      // Calculate distance (simplified for visualization)
      const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
      const similarity = Math.max(0, Math.min(1, 1 - (distance / 200))).toFixed(2);
      
      // Draw distance label
      const midX = (x1 + x2) / 2;
      const midY = (y1 + y2) / 2;
      
      // Draw background for text
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(midX - 50, midY - 8, 100, 20);
      
      ctx.font = 'bold 12px Arial';
      ctx.fillStyle = '#FFA500';
      ctx.textAlign = 'center';
      ctx.fillText(`Similarity: ${similarity}`, midX, midY + 5);
    }
  }, [distanceWords, canvasSizes.distance]);
  
  // Update canvas sizes on window resize
  useEffect(() => {
    const updateSizes = () => {
      const baseWidth = Math.min(window.innerWidth / 2 - 40, 300);
      setCanvasSizes({
        spatial: { width: baseWidth, height: baseWidth * 0.7 },
        nearest: { width: baseWidth, height: baseWidth * 0.7 },
        midpoint: { width: baseWidth, height: baseWidth * 0.7 },
        distance: { width: baseWidth, height: baseWidth * 0.7 }
      });
    };
    
    // Initial update
    updateSizes();
    
    // Add resize listener
    window.addEventListener('resize', updateSizes);
    
    return () => window.removeEventListener('resize', updateSizes);
  }, []);
  
  return (
    <div className="about-section">
      <h2>Core Technologies</h2>
      <p>
        Luminode combines several cutting-edge AI and vector search technologies to deliver 
        powerful semantic search and exploration capabilities:
      </p>

      <div className="functionality-section">
        <h3>Dimensionality Reduction with PCA</h3>
        <div className="content-with-visual">
          <div className="text-content">
            <p>
              Luminode uses <span className="highlight">Principal Component Analysis (PCA)</span> to transform high-dimensional 
              embeddings (hundreds of dimensions) into visualizable 2D or 3D representations.
            </p>
            <p>
              PCA works by identifying the directions (principal components) that capture the maximum variance 
              in the data, effectively preserving the most important relationships while reducing dimensions.
            </p>
            <div className="tech-details">
              <h4>Technical Details:</h4>
              <ul>
                <li>Maintains linear relationships between embeddings</li>
                <li>Computationally efficient for large datasets</li>
                <li>Preserves global structure better than t-SNE or UMAP</li>
                <li>Helps reduce noise in the underlying embeddings</li>
              </ul>
            </div>
          </div>
          <div className="visual-demo">
            <div className="canvas-container">
              <canvas 
                ref={spatialCanvasRef}
                style={{ 
                  width: `${canvasSizes.spatial.width}px`,
                  height: `${canvasSizes.spatial.height}px`
                }}
              />
            </div>
            <div className="visual-caption">
              PCA projection showing semantic clusters in the embedding space
            </div>
          </div>
        </div>
      </div>

      <div className="functionality-section">
        <h3>HNSW-Powered Nearest Neighbor Search</h3>
        <div className="content-with-visual">
          <div className="text-content">
            <p>
              Luminode leverages the <span className="highlight">Hierarchical Navigable Small World (HNSW)</span> graph 
              algorithm to perform lightning-fast approximate nearest neighbor searches in the embedding space.
            </p>
            <p>
              HNSW creates multi-layered graphs where semantically similar items are connected, allowing Luminode 
              to quickly navigate to the most relevant results without scanning the entire database.
            </p>
            <div className="tech-details">
              <h4>Technical Details:</h4>
              <ul>
                <li>Sub-linear query time (logarithmic complexity)</li>
                <li>High recall rate (typically 90-100% of exact search results)</li>
                <li>Optimized for high-dimensional vector search</li>
                <li>Integrated with Pinecone vector database for production performance</li>
              </ul>
            </div>
          </div>
          <div className="visual-demo">
            <div className="select-container">
              <select 
                value={selectedWord} 
                onChange={(e) => setSelectedWord(e.target.value)}
                className="word-select"
              >
                <option value="ocean">ocean</option>
                <option value="mountain">mountain</option>
                <option value="computer">computer</option>
              </select>
            </div>
            <div className="canvas-container">
              <canvas 
                ref={nearestCanvasRef}
                style={{ 
                  width: `${canvasSizes.nearest.width}px`,
                  height: `${canvasSizes.nearest.height}px`
                }}
              />
            </div>
            <div className="visual-caption">
              Visualization of nearest neighbors to "{selectedWord}" using HNSW-based search
            </div>
          </div>
        </div>
      </div>

      <div className="functionality-section">
        <h3>Vector Space Manipulation</h3>
        <div className="content-with-visual">
          <div className="text-content">
            <p>
              Luminode enables semantic exploration through <span className="highlight">vector arithmetic</span> operations 
              in the embedding space. By treating word meanings as vectors, we can manipulate and combine 
              concepts mathematically.
            </p>
            <p>
              One powerful application is finding the semantic midpoint between concepts, revealing 
              words that bridge different domains or represent hybrid ideas.
            </p>
            <div className="tech-details">
              <h4>Technical Implementation:</h4>
              <ul>
                <li>Vector averaging to find semantic midpoints</li>
                <li>Multiple interpolation methods (linear, spherical)</li>
                <li>Adjustable weighting for concept blending</li>
                <li>Filtered by distance thresholds for relevance</li>
              </ul>
            </div>
          </div>
          <div className="visual-demo">
            <div className="canvas-container">
              <canvas 
                ref={midpointCanvasRef}
                style={{ 
                  width: `${canvasSizes.midpoint.width}px`,
                  height: `${canvasSizes.midpoint.height}px`
                }}
              />
            </div>
            <div className="visual-caption">
              Vector midpoint between "science" and "art" reveals interdisciplinary concepts
            </div>
          </div>
        </div>
      </div>

      <div className="functionality-section">
        <h3>Cosine Similarity Measurement</h3>
        <div className="content-with-visual">
          <div className="text-content">
            <p>
              Luminode uses <span className="highlight">cosine similarity</span> as its primary metric for comparing 
              embedding vectors. This measures the angle between vectors rather than their magnitude.
            </p>
            <p>
              Cosine similarity is particularly well-suited for text embeddings because it focuses on the 
              direction (semantic orientation) of vectors while being less sensitive to vector length.
            </p>
            <div className="tech-details">
              <h4>Mathematical Formula:</h4>
              <div className="formula">
                similarity(A,B) = cos(θ) = (A·B)/(||A||·||B||)
              </div>
              <p className="formula-explanation">
                Where A·B is the dot product, and ||A|| and ||B|| are the vector magnitudes
              </p>
              <ul className="formula-properties">
                <li>Range: -1 (opposite) to 1 (identical)</li>
                <li>Less affected by the "curse of dimensionality"</li>
                <li>Effective for sparse high-dimensional vectors</li>
              </ul>
            </div>
          </div>
          <div className="visual-demo">
            <div className="canvas-container">
              <canvas 
                ref={distanceCanvasRef}
                style={{ 
                  width: `${canvasSizes.distance.width}px`,
                  height: `${canvasSizes.distance.height}px`
                }}
              />
            </div>
            <div className="visual-caption">
              Cosine similarity measurement between "king" and "queen" vectors
            </div>
          </div>
        </div>
      </div>

      <div className="functionality-section">
        <h3>Vector Database (Pinecone)</h3>
        <p>
          Luminode is powered by <span className="highlight">Pinecone</span>, a cloud-native vector database optimized 
          for similarity search at scale. This enables Luminode to:
        </p>
        <div className="tech-box">
          <div className="tech-box-item">
            <div className="tech-icon">⚡</div>
            <div className="tech-description">
              <h4>High-Performance Search</h4>
              <p>Execute complex semantic queries in milliseconds, even with millions of vectors</p>
            </div>
          </div>
          <div className="tech-box-item">
            <div className="tech-icon">🔍</div>
            <div className="tech-description">
              <h4>Metadata Filtering</h4>
              <p>Combine semantic similarity with traditional filters (date, category, author, etc.)</p>
            </div>
          </div>
          <div className="tech-box-item">
            <div className="tech-icon">📊</div>
            <div className="tech-description">
              <h4>Dynamic Indexing</h4>
              <p>Automatically update and re-index as new content is added to the knowledge base</p>
            </div>
          </div>
          <div className="tech-box-item">
            <div className="tech-icon">🔄</div>
            <div className="tech-description">
              <h4>Horizontal Scaling</h4>
              <p>Seamlessly handle growing data volumes through distributed architecture</p>
            </div>
          </div>
        </div>
      </div>

      <div className="functionality-section">
        <h3>LLaMA Embedding Architecture</h3>
        <p>
          At the foundation of Luminode is <span className="highlight">LLaMA</span>, a state-of-the-art language model from Meta AI 
          that provides rich contextual embeddings for semantic understanding.
        </p>
        <div className="architecture-diagram">
          <div className="architecture-layer">
            <div className="layer-label">User Input</div>
            <div className="layer-box user-input">
              <span>"What's the impact of climate change on coastal cities?"</span>
            </div>
          </div>
          <div className="architecture-arrow">↓</div>
          <div className="architecture-layer">
            <div className="layer-label">LLaMA Embedding</div>
            <div className="layer-box embedding">
              <span>Contextual Vector [768 dimensions]</span>
            </div>
          </div>
          <div className="architecture-arrow">↓</div>
          <div className="architecture-layer">
            <div className="layer-label">HNSW Search (Pinecone)</div>
            <div className="layer-box search">
              <span>Finding similar vectors through navigable graph</span>
            </div>
          </div>
          <div className="architecture-arrow">↓</div>
          <div className="architecture-layer">
            <div className="layer-label">Results</div>
            <div className="layer-box results">
              <span>Semantically relevant documents ranked by cosine similarity</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx="true">{`
        .about-section {
          margin-bottom: 2rem;
        }
        
        h2 {
          color: #FFA500;
          margin-top: 1.5rem;
          margin-bottom: 1rem;
          font-size: 1.8rem;
        }
        
        h3 {
          color: #FFA500;
          margin-top: 1.2rem;
          margin-bottom: 0.8rem;
          font-size: 1.4rem;
        }
        
        h4 {
          color: #FFA500;
          margin-top: 0.8rem;
          margin-bottom: 0.5rem;
          font-size: 1.1rem;
        }
        
        p {
          line-height: 1.6;
          margin-bottom: 1rem;
          font-size: 1.1rem;
        }
        
        ul {
          margin-left: 1.5rem;
          line-height: 1.6;
          margin-bottom: 1rem;
        }
        
        li {
          margin-bottom: 0.5rem;
          font-size: 1.1rem;
        }
        
        .highlight {
          color: #FFA500;
          font-weight: bold;
        }
        
        .functionality-section {
          margin-bottom: 2.5rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .functionality-section:last-child {
          border-bottom: none;
        }
        
        .content-with-visual {
          display: flex;
          flex-direction: row;
          gap: 2rem;
          margin-top: 1rem;
          align-items: center;
        }
        
        .text-content {
          flex: 1;
        }
        
        .visual-demo {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        
        .canvas-container {
          background-color: rgba(0, 0, 0, 0.3);
          border-radius: 8px;
          padding: 1rem;
          margin-bottom: 0.5rem;
        }
        
        canvas {
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          display: block;
        }
        
        .visual-caption {
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.7);
          text-align: center;
          font-style: italic;
        }
        
        .select-container {
          margin-bottom: 1rem;
        }
        
        .word-select {
          padding: 0.5rem;
          background-color: rgba(0, 0, 0, 0.3);
          color: white;
          border: 1px solid rgba(255, 165, 0, 0.5);
          border-radius: 4px;
          font-size: 0.9rem;
          cursor: pointer;
        }
        
        .tech-details {
          background-color: rgba(0, 0, 0, 0.3);
          border-radius: 8px;
          padding: 1rem;
          margin-top: 1rem;
          border-left: 3px solid rgba(255, 165, 0, 0.5);
        }
        
        .tech-details h4 {
          margin-top: 0;
        }
        
        .tech-details ul {
          margin-bottom: 0;
        }
        
        .formula {
          background-color: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          padding: 0.8rem;
          text-align: center;
          font-family: 'Courier New', monospace;
          font-size: 1.1rem;
          margin: 1rem 0;
        }
        
        .formula-explanation {
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.7);
          text-align: center;
          margin: 0.5rem 0 1rem;
          font-style: italic;
        }
        
        .formula-properties {
          font-size: 0.95rem;
        }
        
        .tech-box {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-top: 1.5rem;
        }
        
        .tech-box-item {
          background-color: rgba(0, 0, 0, 0.3);
          border-radius: 8px;
          padding: 1.5rem;
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.3s ease;
        }
        
        .tech-box-item:hover {
          border-color: rgba(255, 165, 0, 0.3);
          transform: translateY(-3px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }
        
        .tech-icon {
          font-size: 1.8rem;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: rgba(255, 165, 0, 0.1);
          border-radius: 50%;
          flex-shrink: 0;
        }
        
        .tech-description {
          flex: 1;
        }
        
        .tech-description h4 {
          margin-top: 0;
          margin-bottom: 0.5rem;
        }
        
        .tech-description p {
          font-size: 1rem;
          margin-bottom: 0;
        }
        
        .architecture-diagram {
          background-color: rgba(0, 0, 0, 0.3);
          border-radius: 8px;
          padding: 2rem;
          margin-top: 1.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }
        
        .architecture-layer {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
          max-width: 500px;
        }
        
        .layer-label {
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 0.5rem;
        }
        
        .layer-box {
          padding: 1rem;
          border-radius: 4px;
          width: 100%;
          text-align: center;
          font-size: 1rem;
        }
        
        .user-input {
          background-color: rgba(255, 165, 0, 0.1);
          border: 1px solid rgba(255, 165, 0, 0.3);
        }
        
        .embedding {
          background-color: rgba(33, 150, 243, 0.1);
          border: 1px solid rgba(33, 150, 243, 0.3);
        }
        
        .search {
          background-color: rgba(76, 175, 80, 0.1);
          border: 1px solid rgba(76, 175, 80, 0.3);
        }
        
        .results {
          background-color: rgba(156, 39, 176, 0.1);
          border: 1px solid rgba(156, 39, 176, 0.3);
        }
        
        .architecture-arrow {
          font-size: 1.5rem;
          color: rgba(255, 255, 255, 0.5);
        }
        
        @media (max-width: 768px) {
          .content-with-visual {
            flex-direction: column;
            gap: 1rem;
          }
          
          .text-content, .visual-demo {
            width: 100%;
          }
          
          .tech-box {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default CoreFunctionalities; 