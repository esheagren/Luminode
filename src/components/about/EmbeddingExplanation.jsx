import React, { useState, useRef, useEffect } from 'react';

const EmbeddingExplanation = () => {
  const [activeTab, setActiveTab] = useState('concept');
  const [showFullVector, setShowFullVector] = useState(false);
  const canvasRef = useRef(null);
  
  // Draw the vector space visualization
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw background grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    
    // Vertical grid lines
    for (let x = 0; x <= width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    
    // Horizontal grid lines
    for (let y = 0; y <= height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    
    // Draw axes
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 2;
    
    // X-axis
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();
    
    // Y-axis
    ctx.beginPath();
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2, height);
    ctx.stroke();
    
    // Draw word vectors
    const words = [
      { text: 'king', x: width * 0.7, y: height * 0.3, color: '#FFA500' },
      { text: 'queen', x: width * 0.8, y: height * 0.2, color: '#FFA500' },
      { text: 'man', x: width * 0.6, y: height * 0.4, color: '#FFA500' },
      { text: 'woman', x: width * 0.7, y: height * 0.3, color: '#FFA500' },
      { text: 'dog', x: width * 0.3, y: height * 0.7, color: '#4CAF50' },
      { text: 'cat', x: width * 0.2, y: height * 0.8, color: '#4CAF50' },
      { text: 'animal', x: width * 0.25, y: height * 0.75, color: '#4CAF50' },
      { text: 'computer', x: width * 0.8, y: height * 0.8, color: '#2196F3' },
      { text: 'laptop', x: width * 0.85, y: height * 0.75, color: '#2196F3' },
      { text: 'technology', x: width * 0.75, y: height * 0.85, color: '#2196F3' }
    ];
    
    // Draw vectors from origin
    words.forEach(word => {
      // Draw line from origin to word
      ctx.beginPath();
      ctx.strokeStyle = word.color;
      ctx.lineWidth = 1.5;
      ctx.setLineDash([3, 3]);
      ctx.moveTo(width / 2, height / 2);
      ctx.lineTo(word.x, word.y);
      ctx.stroke();
      ctx.setLineDash([]);
      
      // Draw word dot
      ctx.beginPath();
      ctx.fillStyle = word.color;
      ctx.arc(word.x, word.y, 5, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw word label
      ctx.font = '12px Arial';
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      ctx.fillText(word.text, word.x, word.y - 10);
    });
    
    // Draw clusters
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(255, 165, 0, 0.2)';
    ctx.lineWidth = 2;
    ctx.ellipse(width * 0.7, height * 0.3, 60, 40, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = 'rgba(255, 165, 0, 0.1)';
    ctx.fill();
    
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(76, 175, 80, 0.2)';
    ctx.lineWidth = 2;
    ctx.ellipse(width * 0.25, height * 0.75, 50, 40, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = 'rgba(76, 175, 80, 0.1)';
    ctx.fill();
    
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(33, 150, 243, 0.2)';
    ctx.lineWidth = 2;
    ctx.ellipse(width * 0.8, height * 0.8, 50, 40, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = 'rgba(33, 150, 243, 0.1)';
    ctx.fill();
    
    // Draw cluster labels
    ctx.font = 'bold 14px Arial';
    ctx.fillStyle = 'rgba(255, 165, 0, 0.8)';
    ctx.textAlign = 'center';
    ctx.fillText('Royalty/Gender', width * 0.7, height * 0.2 - 15);
    
    ctx.fillStyle = 'rgba(76, 175, 80, 0.8)';
    ctx.fillText('Animals', width * 0.25, height * 0.7 - 15);
    
    ctx.fillStyle = 'rgba(33, 150, 243, 0.8)';
    ctx.fillText('Technology', width * 0.8, height * 0.7 - 15);
    
  }, []);
  
  const renderConceptTab = () => {
    return (
      <div className="tab-content">
        <h3>Vector Embeddings Explained</h3>
        <p>
          Vector embeddings are the foundation of modern AI language understanding. They transform individual words
          into numerical vectors in a high-dimensional space, enabling machines to process word meanings mathematically.
        </p>
        <p>
          In this "semantic space," words with similar meanings are positioned closer together. Instead of treating 
          words as isolated symbols, embeddings capture relationships based on usage patterns in language.
        </p>
        
        <div className="vector-example">
          <h4>Example: Word as a Vector</h4>
          <div className="vector-box">
            <div className="word-label">
              "dog" = [0.123, -0.456, 0.789, 0.012, -0.345, ... ]
            </div>
            <div className="vector-note">
              LLaMA embeddings typically have hundreds of dimensions, each capturing different semantic aspects of the word
            </div>
            
            {showFullVector ? (
              <div className="full-vector">
                <p>Full vector (first 20 dimensions):</p>
                <code>[0.123, -0.456, 0.789, 0.012, -0.345, 0.678, -0.901, 0.234, -0.567, 0.890, 
                       -0.123, 0.456, -0.789, -0.012, 0.345, -0.678, 0.901, -0.234, 0.567, -0.890, ...]</code>
                <button className="toggle-vector" onClick={() => setShowFullVector(false)}>
                  Show Less
                </button>
              </div>
            ) : (
              <button className="toggle-vector" onClick={() => setShowFullVector(true)}>
                Show Example Vector
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };
  
  const renderVisualizationTab = () => {
    return (
      <div className="tab-content">
        <h3>Visualizing Word Embeddings</h3>
        <p>
          To make high-dimensional word embeddings understandable, Luminode projects them from their native space 
          (typically hundreds of dimensions) down to 2D or 3D using dimensionality reduction techniques.
        </p>
        <p>
          Luminode uses <span className="highlight">Principal Component Analysis (PCA)</span> to find the most 
          informative dimensions in the word data, preserving as much variance as possible in the reduced representation. 
          This allows users to visually explore semantic relationships between words that would otherwise remain hidden.
        </p>
        
        <div className="visual-example">
          <div className="visual-note">
            <span className="highlight">How dimensionality reduction works:</span>
          </div>
          <div className="dimension-steps">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-description">
                <span className="step-title">High-dimensional Space</span>
                <p>Word embeddings exist in hundreds of dimensions, impossible to visualize directly</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-description">
                <span className="step-title">Find Principal Components</span>
                <p>PCA identifies the directions with maximum variance in the word vectors</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-description">
                <span className="step-title">Project to Lower Dimensions</span>
                <p>Words are projected onto 2-3 dimensions while preserving their relationships</p>
              </div>
            </div>
          </div>
          
          <div className="comparison-note">
            <p>
              <span className="highlight">Note:</span> Some word relationships visible in the full embedding space may 
              be lost in the projection. Alternative techniques like t-SNE or UMAP could reveal different aspects 
              of the word relationship structure.
            </p>
          </div>
        </div>
      </div>
    );
  };
  
  const renderEmbeddingTypesTab = () => {
    return (
      <div className="tab-content">
        <h3>Types of Word Embeddings</h3>
        
        <div className="embedding-type">
          <h4>LLaMA: Contextual Word Embeddings (Used by Luminode)</h4>
          <p>
            Luminode leverages <span className="highlight">LLaMA (Large Language Model Meta AI)</span> to generate 
            rich, contextual embeddings that capture the nuanced meaning of words.
          </p>
          <div className="embedding-details">
            <ul>
              <li>
                <strong>Context-aware:</strong> The same word has different embeddings depending on surrounding context, 
                capturing nuances of meaning
              </li>
              <li>
                <strong>Foundation model:</strong> Trained on massive text corpora, capturing deep word relationships
              </li>
              <li>
                <strong>Transformer-based:</strong> Uses attention mechanisms to understand relationships between words
              </li>
              <li>
                <strong>High dimensionality:</strong> Typically hundreds of dimensions per word embedding
              </li>
            </ul>
            
            <div className="example-box">
              <div className="example-title">Example: Context Changes Word Meaning</div>
              <p>The word "bank" has different embeddings in:</p>
              <ul className="example-list">
                <li>"I deposited money at the bank" (financial institution)</li>
                <li>"We sat by the river bank" (shoreline)</li>
              </ul>
              <p>Contextual embeddings capture these distinct word meanings appropriately.</p>
            </div>
          </div>
        </div>
        
        <div className="embedding-type secondary">
          <h4>GloVe: Static Word Embeddings</h4>
          <p>
            Prior to contextual models, static embeddings like <span className="highlight">GloVe (Global Vectors for Word Representation)</span> 
            were widely used and are still relevant for understanding how word meanings are captured mathematically.
          </p>
          <div className="embedding-details">
            <ul>
              <li>
                <strong>Static vectors:</strong> Each word has a single fixed vector regardless of context
              </li>
              <li>
                <strong>Co-occurrence based:</strong> Created by analyzing how often words appear together
              </li>
              <li>
                <strong>Efficient but limited:</strong> Simpler than contextual models but miss nuanced word uses
              </li>
              <li>
                <strong>Linear relationships:</strong> Famous for capturing word analogies like "king - man + woman ≈ queen"
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="about-section">
      <h2>Understanding Vector Embeddings</h2>
      
      <div className="embedding-tabs">
        <button 
          className={`embedding-tab ${activeTab === 'concept' ? 'active' : ''}`}
          onClick={() => setActiveTab('concept')}
        >
          The Concept
        </button>
        <button 
          className={`embedding-tab ${activeTab === 'visualization' ? 'active' : ''}`}
          onClick={() => setActiveTab('visualization')}
        >
          Visualization
        </button>
        <button 
          className={`embedding-tab ${activeTab === 'types' ? 'active' : ''}`}
          onClick={() => setActiveTab('types')}
        >
          Embedding Types
        </button>
      </div>
      
      <div className="embedding-content">
        {activeTab === 'concept' && renderConceptTab()}
        {activeTab === 'visualization' && renderVisualizationTab()}
        {activeTab === 'types' && renderEmbeddingTypesTab()}
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
          margin-top: 0;
          margin-bottom: 1rem;
          font-size: 1.4rem;
        }
        
        h4 {
          color: #FFA500;
          margin-top: 1.2rem;
          margin-bottom: 0.8rem;
          font-size: 1.2rem;
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
        
        .embedding-tabs {
          display: flex;
          border-bottom: 1px solid rgba(255, 165, 0, 0.3);
          margin-bottom: 1.5rem;
        }
        
        .embedding-tab {
          background: transparent;
          border: none;
          color: white;
          padding: 0.75rem 1.25rem;
          font-size: 1.1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
        }
        
        .embedding-tab:hover {
          color: #FFA500;
        }
        
        .embedding-tab.active {
          color: #FFA500;
          font-weight: bold;
        }
        
        .embedding-tab.active::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0;
          width: 100%;
          height: 3px;
          background-color: #FFA500;
          border-radius: 3px 3px 0 0;
        }
        
        .embedding-content {
          padding: 1rem;
          background-color: rgba(0, 0, 0, 0.2);
          border-radius: 8px;
        }
        
        .vector-example {
          background-color: rgba(26, 26, 46, 0.8);
          border-radius: 8px;
          padding: 1rem;
          margin: 1.5rem 0;
          border: 1px solid rgba(255, 165, 0, 0.3);
        }
        
        .vector-box {
          background-color: rgba(0, 0, 0, 0.3);
          padding: 1rem;
          border-radius: 4px;
          font-family: monospace;
        }
        
        .word-label {
          font-size: 1.1rem;
          color: #FFA500;
        }
        
        .vector-note {
          margin-top: 0.5rem;
          font-style: italic;
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.9rem;
        }
        
        .toggle-vector {
          background-color: rgba(255, 165, 0, 0.2);
          border: 1px solid rgba(255, 165, 0, 0.5);
          color: white;
          border-radius: 4px;
          padding: 0.3rem 0.6rem;
          margin-top: 1rem;
          cursor: pointer;
          font-size: 0.9rem;
          transition: all 0.3s ease;
        }
        
        .toggle-vector:hover {
          background-color: rgba(255, 165, 0, 0.3);
        }
        
        .full-vector {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .full-vector p {
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.7);
        }
        
        .full-vector code {
          display: block;
          word-break: break-all;
          white-space: pre-wrap;
          line-height: 1.5;
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.9);
          margin-bottom: 1rem;
        }
        
        .visual-example {
          background-color: rgba(26, 26, 46, 0.8);
          border-radius: 8px;
          padding: 1rem;
          margin: 1.5rem 0;
          border: 1px solid rgba(255, 165, 0, 0.3);
        }
        
        .visual-note {
          margin-bottom: 1rem;
        }
        
        .highlight {
          color: #FFA500;
          font-weight: bold;
        }
        
        .dimension-steps {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin: 1.5rem 0;
        }
        
        .step {
          display: flex;
          gap: 1rem;
          align-items: flex-start;
        }
        
        .step-number {
          width: 30px;
          height: 30px;
          background-color: rgba(255, 165, 0, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          color: #FFA500;
          flex-shrink: 0;
        }
        
        .step-description {
          flex: 1;
        }
        
        .step-title {
          font-weight: bold;
          display: block;
          margin-bottom: 0.5rem;
        }
        
        .step-description p {
          margin: 0;
          font-size: 1rem;
        }
        
        .comparison-note {
          background-color: rgba(0, 0, 0, 0.3);
          border-radius: 8px;
          padding: 1rem;
          margin-top: 1rem;
          border-left: 3px solid rgba(255, 165, 0, 0.5);
        }
        
        .comparison-note p {
          margin: 0;
          font-size: 1rem;
        }
        
        .embedding-type {
          background-color: rgba(255, 165, 0, 0.1);
          border-radius: 8px;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
          border: 1px solid rgba(255, 165, 0, 0.3);
        }
        
        .embedding-type.secondary {
          background-color: rgba(33, 150, 243, 0.1);
          border: 1px solid rgba(33, 150, 243, 0.3);
        }
        
        .embedding-type.secondary h4 {
          color: #2196F3;
        }
        
        .embedding-details {
          margin-top: 1rem;
        }
        
        .example-box {
          background-color: rgba(0, 0, 0, 0.3);
          border-radius: 8px;
          padding: 1rem;
          margin-top: 1rem;
          border-left: 3px solid rgba(255, 165, 0, 0.5);
        }
        
        .example-title {
          font-weight: bold;
          color: #FFA500;
          margin-bottom: 0.5rem;
        }
        
        .example-list {
          margin-bottom: 0.5rem;
        }
        
        .example-list li {
          margin-bottom: 0.3rem;
          font-size: 1rem;
        }
      `}</style>
    </div>
  );
};

export default EmbeddingExplanation; 