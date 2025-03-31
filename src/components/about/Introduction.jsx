import React, { useState, useRef, useEffect } from 'react';

// Sample data for a simple vector visualization
const sampleVectors = {
  "king": [0.2, 0.8],
  "queen": [0.3, 0.9],
  "man": [-0.1, 0.7],
  "woman": [0.0, 0.8],
  "computer": [0.8, -0.3],
  "technology": [0.7, -0.2],
  "science": [0.6, -0.1],
  "art": [-0.7, -0.5]
};

const Introduction = () => {
  const [expandedSection, setExpandedSection] = useState(null);
  const canvasRef = useRef(null);
  const [canvasSize, setCanvasSize] = useState({ width: 300, height: 200 });
  
  const toggleSection = (section) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };
  
  // Scale coordinates to fit canvas
  const scaleCoordinates = (coords, width, height) => {
    const padding = 30;
    const xScale = (width - padding * 2) / 2;
    const yScale = (height - padding * 2) / 2;
    
    return [
      (coords[0] * xScale) + (width / 2),
      (coords[1] * -yScale) + (height / 2)
    ];
  };
  
  // Draw a simple vector visualization
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { width, height } = canvasSize;
    
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
    
    // Draw vectors
    Object.entries(sampleVectors).forEach(([word, vector]) => {
      const [x, y] = scaleCoordinates(vector, width, height);
      
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
      
      // Draw line from origin to point (vector representation)
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(255, 165, 0, 0.2)';
      ctx.lineWidth = 1;
      ctx.moveTo(width / 2, height / 2);
      ctx.lineTo(x, y);
      ctx.stroke();
    });
    
    // Draw origin label
    ctx.font = '10px Arial';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.textAlign = 'center';
    ctx.fillText('origin', width / 2, height / 2 + 15);
    
  }, [canvasSize]);
  
  // Update canvas size on window resize
  useEffect(() => {
    const updateSize = () => {
      const width = Math.min(window.innerWidth - 40, 500);
      setCanvasSize({
        width,
        height: width * 0.6
      });
    };
    
    // Initial update
    updateSize();
    
    // Add resize listener
    window.addEventListener('resize', updateSize);
    
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  
  return (
    <div className="about-section">
      <div className="intro-header">
        <h2>Welcome to Luminode</h2>
        <div className="animated-tagline">
          <span className="highlight">AI-Powered</span> Semantic Search & Discovery
        </div>
      </div>
      
      <div className="intro-content">
        <p className="lead-paragraph">
          Luminode is a cutting-edge application that leverages advanced AI technologies to represent and 
          search information based on <span className="highlight">semantic similarity</span> rather than exact keyword matching. 
          Using vector embeddings, similarity metrics, and nearest-neighbor search, Luminode finds 
          connections that traditional search engines might miss.
        </p>
        
        <div className="vector-visualization">
          <h3>The Semantic Space</h3>
          <p>
            At the core of Luminode is the concept of a <span className="highlight">semantic space</span> — 
            a high-dimensional space where words and concepts with similar meanings cluster together. 
            This is made possible through <span className="highlight">vector embeddings</span> from LLaMA, 
            allowing Luminode to understand the meaning behind your queries.
          </p>
          <div className="canvas-container">
            <canvas 
              ref={canvasRef}
              style={{ 
                width: `${canvasSize.width}px`,
                height: `${canvasSize.height}px`
              }}
            />
          </div>
          <div className="visualization-caption">
            A simplified 2D representation of word vectors in semantic space. In reality, Luminode works with 
            embeddings in hundreds of dimensions, capturing subtle relationships between concepts.
          </div>
        </div>
        
        <div className="info-cards">
          <div 
            className={`info-card ${expandedSection === 'embeddings' ? 'expanded' : ''}`}
            onClick={() => toggleSection('embeddings')}
          >
            <div className="card-header">
              <h3>Vector Embeddings</h3>
              <div className="expand-icon">{expandedSection === 'embeddings' ? '−' : '+'}</div>
            </div>
            <div className="card-content">
              <p>
                Luminode uses <span className="highlight">LLaMA</span> to transform text into rich, contextual 
                vector embeddings that capture the semantic meaning of content.
              </p>
              {expandedSection === 'embeddings' && (
                <p>
                  Unlike static word vectors, LLaMA's contextual embeddings consider surrounding text, 
                  allowing the same word to have different representations based on its usage. These embeddings 
                  position similar concepts closer together in a high-dimensional space.
                </p>
              )}
            </div>
          </div>
          
          <div 
            className={`info-card ${expandedSection === 'similarity' ? 'expanded' : ''}`}
            onClick={() => toggleSection('similarity')}
          >
            <div className="card-header">
              <h3>Similarity Metrics</h3>
              <div className="expand-icon">{expandedSection === 'similarity' ? '−' : '+'}</div>
            </div>
            <div className="card-content">
              <p>
                Luminode uses <span className="highlight">cosine similarity</span> to measure how closely related 
                two pieces of content are in the semantic space.
              </p>
              {expandedSection === 'similarity' && (
                <p>
                  Cosine similarity measures the angle between vectors, focusing on their orientation rather than 
                  magnitude. This approach is ideal for finding conceptually similar content even when expressed 
                  with different words, making search results more intuitive and relevant.
                </p>
              )}
            </div>
          </div>
          
          <div 
            className={`info-card ${expandedSection === 'search' ? 'expanded' : ''}`}
            onClick={() => toggleSection('search')}
          >
            <div className="card-header">
              <h3>Vector Search</h3>
              <div className="expand-icon">{expandedSection === 'search' ? '−' : '+'}</div>
            </div>
            <div className="card-content">
              <p>
                Finding relevant content quickly is powered by <span className="highlight">HNSW</span> (Hierarchical Navigable Small 
                World) graph algorithm for approximate nearest neighbor search.
              </p>
              {expandedSection === 'search' && (
                <p>
                  HNSW creates a multi-layered graph structure that enables Luminode to navigate the semantic space 
                  efficiently, examining only a fraction of possible candidates while maintaining high accuracy. 
                  This technology delivers millisecond-speed results even with large datasets.
                </p>
              )}
            </div>
          </div>
        </div>
        
        <div className="info-cards second-row">
          <div 
            className={`info-card ${expandedSection === 'database' ? 'expanded' : ''}`}
            onClick={() => toggleSection('database')}
          >
            <div className="card-header">
              <h3>Vector Database</h3>
              <div className="expand-icon">{expandedSection === 'database' ? '−' : '+'}</div>
            </div>
            <div className="card-content">
              <p>
                Luminode leverages <span className="highlight">Pinecone</span>, a specialized vector database optimized for 
                high-performance similarity search.
              </p>
              {expandedSection === 'database' && (
                <p>
                  Pinecone handles the storage, indexing, and querying of embedding vectors at scale, allowing 
                  Luminode to maintain fast response times regardless of dataset size. This cloud-based service 
                  ensures reliable performance without the complexity of managing custom infrastructure.
                </p>
              )}
            </div>
          </div>
          
          <div 
            className={`info-card ${expandedSection === 'visualization' ? 'expanded' : ''}`}
            onClick={() => toggleSection('visualization')}
          >
            <div className="card-header">
              <h3>Dimensionality Reduction</h3>
              <div className="expand-icon">{expandedSection === 'visualization' ? '−' : '+'}</div>
            </div>
            <div className="card-content">
              <p>
                To visualize high-dimensional data, Luminode employs <span className="highlight">Principal Component Analysis (PCA)</span> 
                to project vectors into explorable 2D or 3D spaces.
              </p>
              {expandedSection === 'visualization' && (
                <p>
                  PCA identifies the most important dimensions in the data, preserving as much variance as possible 
                  in the reduced space. This allows users to see clusters, trends, and relationships that would be 
                  impossible to visualize in the original high-dimensional embedding space.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx="true">{`
        .about-section {
          margin-bottom: 2rem;
        }
        
        .intro-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        
        h2 {
          color: #FFA500;
          margin-top: 1.5rem;
          margin-bottom: 1rem;
          font-size: 2rem;
        }
        
        .animated-tagline {
          font-size: 1.4rem;
          margin-top: 0.5rem;
          position: relative;
          display: inline-block;
          padding: 0.5rem 1rem;
          background: linear-gradient(90deg, rgba(255,165,0,0.1) 0%, rgba(255,165,0,0.2) 50%, rgba(255,165,0,0.1) 100%);
          border-radius: 4px;
          animation: pulse 3s infinite;
        }
        
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(255, 165, 0, 0.4); }
          70% { box-shadow: 0 0 0 10px rgba(255, 165, 0, 0); }
          100% { box-shadow: 0 0 0 0 rgba(255, 165, 0, 0); }
        }
        
        .highlight {
          color: #FFA500;
          font-weight: bold;
        }
        
        .intro-content {
          padding: 0 1rem;
        }
        
        .lead-paragraph {
          font-size: 1.2rem;
          line-height: 1.7;
          margin-bottom: 2rem;
          text-align: center;
          max-width: 800px;
          margin-left: auto;
          margin-right: auto;
        }
        
        .vector-visualization {
          margin: 2rem 0;
          text-align: center;
        }
        
        .vector-visualization h3 {
          color: #FFA500;
          margin-bottom: 1rem;
          font-size: 1.4rem;
        }
        
        .vector-visualization p {
          max-width: 700px;
          margin: 0 auto 1.5rem;
        }
        
        .canvas-container {
          background-color: rgba(0, 0, 0, 0.3);
          border-radius: 8px;
          padding: 1rem;
          margin: 0 auto 1rem;
          display: inline-block;
        }
        
        canvas {
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          display: block;
        }
        
        .visualization-caption {
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.7);
          max-width: 700px;
          margin: 0 auto;
          font-style: italic;
        }
        
        .info-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 1.5rem;
          margin-top: 2rem;
        }
        
        .second-row {
          margin-top: 0;
        }
        
        .info-card {
          background-color: rgba(0, 0, 0, 0.2);
          border-radius: 8px;
          overflow: hidden;
          transition: all 0.3s ease;
          cursor: pointer;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .info-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
          border-color: rgba(255, 165, 0, 0.3);
        }
        
        .info-card.expanded {
          background-color: rgba(255, 165, 0, 0.1);
          border-color: rgba(255, 165, 0, 0.5);
        }
        
        .card-header {
          padding: 1rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .info-card.expanded .card-header {
          border-bottom-color: rgba(255, 165, 0, 0.3);
        }
        
        h3 {
          color: #FFA500;
          margin: 0;
          font-size: 1.3rem;
        }
        
        .expand-icon {
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: rgba(255, 165, 0, 0.2);
          border-radius: 50%;
          font-weight: bold;
          color: #FFA500;
          transition: all 0.3s ease;
        }
        
        .info-card.expanded .expand-icon {
          background-color: rgba(255, 165, 0, 0.4);
        }
        
        .card-content {
          padding: 1rem;
          transition: all 0.3s ease;
        }
        
        p {
          line-height: 1.6;
          margin-bottom: 1rem;
          font-size: 1.1rem;
        }
      `}</style>
    </div>
  );
};

export default Introduction; 