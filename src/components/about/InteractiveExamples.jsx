import React, { useState, useEffect } from 'react';

// Sample data for demonstrations
const sampleNearestNeighbors = {
  "ocean": ["sea", "water", "lake", "river", "marine", "coastal", "pacific", "atlantic", "underwater", "shore"],
  "computer": ["laptop", "desktop", "pc", "machine", "device", "processor", "hardware", "software", "computing", "system"],
  "happy": ["glad", "pleased", "joyful", "delighted", "cheerful", "content", "joy", "happiness", "smile", "excited"]
};

const sampleMidpoints = {
  "ocean_mountain": ["landscape", "terrain", "valley", "scenic", "wilderness", "nature", "geological", "geography", "environment", "natural"],
  "science_art": ["design", "creative", "innovation", "technique", "concept", "aesthetic", "discipline", "craft", "theory", "experimental"],
  "ancient_modern": ["historical", "contemporary", "traditional", "cultural", "civilization", "heritage", "evolution", "classical", "era", "period"]
};

const sampleAnalogies = {
  "king_queen_man": ["woman", "female", "lady", "girl", "she", "her", "feminine", "maternal", "wife", "daughter"],
  "paris_france_rome": ["italy", "italian", "florence", "milan", "venice", "sicily", "naples", "tuscany", "mediterranean", "european"],
  "good_better_bad": ["worse", "worst", "terrible", "awful", "horrible", "poor", "negative", "inferior", "unpleasant", "disappointing"]
};

const InteractiveExamples = () => {
  const [activeExample, setActiveExample] = useState('nearest');
  const [selectedWord, setSelectedWord] = useState('ocean');
  const [selectedPair, setSelectedPair] = useState('ocean_mountain');
  const [selectedAnalogy, setSelectedAnalogy] = useState('king_queen_man');
  const [showTechnicalDetails, setShowTechnicalDetails] = useState({
    nearest: false,
    midpoint: false,
    analogy: false
  });
  
  // Ensure the component is properly mounted
  useEffect(() => {
    // Force a re-render after component is mounted
    const timer = setTimeout(() => {
      setActiveExample(prev => prev);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  const toggleTechnicalDetails = (example) => {
    setShowTechnicalDetails({
      ...showTechnicalDetails,
      [example]: !showTechnicalDetails[example]
    });
  };
  
  const renderNearestNeighbors = () => {
    return (
      <div className="example-section">
        <h3>HNSW Vector Search</h3>
        <p>
          Explore how Luminode uses Hierarchical Navigable Small World (HNSW) graph algorithms to 
          efficiently find semantically similar words in vector space.
        </p>
        
        <div className="interactive-demo">
          <div className="demo-controls">
            <label>Select a query word:</label>
            <div className="select-container">
              <select 
                value={selectedWord} 
                onChange={(e) => setSelectedWord(e.target.value)}
              >
                <option value="ocean">ocean</option>
                <option value="computer">computer</option>
                <option value="happy">happy</option>
              </select>
            </div>
          </div>
          
          <div className="results-container">
            <h4>Nearest neighbors to "{selectedWord}" in vector space:</h4>
            <div className="tech-note">Results ranked by cosine similarity</div>
            <div className="word-cloud">
              {sampleNearestNeighbors[selectedWord].map((word, index) => (
                <div 
                  key={index} 
                  className="word-chip"
                  style={{ 
                    opacity: 1 - (index * 0.07),
                    transform: `scale(${1 - (index * 0.03)})`
                  }}
                >
                  {word}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <button 
          className="technical-details-button"
          onClick={() => toggleTechnicalDetails('nearest')}
        >
          {showTechnicalDetails.nearest ? 'Hide Technical Details' : 'Show Technical Details'}
        </button>
        
        {showTechnicalDetails.nearest && (
          <div className="technical-details">
            <h4>How Vector Search Works in Luminode</h4>
            <p>
              Luminode implements vector search using:
            </p>
            <ol>
              <li>
                <strong>HNSW Graph Algorithm:</strong> Creates a multi-layered graph structure that connects 
                semantically similar word vectors, allowing for efficient navigation through the embedding space 
                without checking every vector.
              </li>
              <li>
                <strong>Vector Database:</strong> Stores and indexes word embedding vectors for efficient 
                retrieval. Luminode uses Pinecone, but other options include Weaviate, Milvus, and Qdrant - 
                each optimized for vector similarity search.
              </li>
              <li>
                <strong>Cosine Similarity:</strong> Measures the angle between word vectors using:
              </li>
            </ol>
            <div className="formula">
              similarity(A, B) = cos(θ) = (A·B) / (||A|| × ||B||)
            </div>
            <p>
              This enables sub-millisecond search performance even with millions of word vectors,
              making it possible to quickly find words related to any query word.
            </p>
          </div>
        )}
      </div>
    );
  };
  
  const renderMidpointSearch = () => {
    return (
      <div className="example-section">
        <h3>Vector Arithmetic Operations</h3>
        <p>
          Luminode leverages the mathematical properties of word vectors to discover 
          semantic relationships through vector operations.
        </p>
        
        <div className="interactive-demo">
          <div className="demo-controls">
            <label>Select vector combination:</label>
            <div className="select-container">
              <select 
                value={selectedPair} 
                onChange={(e) => setSelectedPair(e.target.value)}
              >
                <option value="ocean_mountain">ocean + mountain</option>
                <option value="science_art">science + art</option>
                <option value="ancient_modern">ancient + modern</option>
              </select>
            </div>
          </div>
          
          <div className="results-container">
            <h4>Vector midpoint between "{selectedPair.replace('_', ' and ')}":</h4>
            <div className="tech-note">
              Using vector averaging in embedding space
            </div>
            <div className="word-cloud">
              {sampleMidpoints[selectedPair].map((word, index) => (
                <div 
                  key={index} 
                  className="word-chip"
                  style={{ 
                    opacity: 1 - (index * 0.07),
                    transform: `scale(${1 - (index * 0.03)})`
                  }}
                >
                  {word}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <button 
          className="technical-details-button"
          onClick={() => toggleTechnicalDetails('midpoint')}
        >
          {showTechnicalDetails.midpoint ? 'Hide Technical Details' : 'Show Technical Details'}
        </button>
        
        {showTechnicalDetails.midpoint && (
          <div className="technical-details">
            <h4>Vector Operations in LLaMA Embedding Space</h4>
            <p>
              Luminode performs semantic exploration through:
            </p>
            <ol>
              <li>
                <strong>Embedding Transformation:</strong> Converts words to high-dimensional LLaMA vectors
              </li>
              <li>
                <strong>Vector Arithmetic:</strong> Combines vectors through mathematical operations:
                <div className="formula">
                  V<sub>midpoint</sub> = (V<sub>A</sub> + V<sub>B</sub>) / 2
                </div>
              </li>
              <li>
                <strong>Nearest Neighbor Search:</strong> Uses an HNSW index to efficiently find 
                word vectors closest to the calculated midpoint
              </li>
              <li>
                <strong>Result Ranking:</strong> Orders resulting words by cosine similarity to the midpoint vector
              </li>
            </ol>
            <p>
              This technique reveals word relationships that wouldn't be discoverable through 
              traditional keyword search, demonstrating the power of vector-based semantic representations.
            </p>
          </div>
        )}
      </div>
    );
  };
  
  const renderAnalogies = () => {
    return (
      <div className="example-section">
        <h3>Semantic Analogies in Vector Space</h3>
        <p>
          Explore how LLaMA embeddings capture relationships between individual words, allowing 
          Luminode to solve word analogies through vector arithmetic.
        </p>
        
        <div className="interactive-demo">
          <div className="demo-controls">
            <label>Select analogy pattern:</label>
            <div className="select-container">
              <select 
                value={selectedAnalogy} 
                onChange={(e) => setSelectedAnalogy(e.target.value)}
              >
                <option value="king_queen_man">king : queen :: man : ?</option>
                <option value="paris_france_rome">paris : france :: rome : ?</option>
                <option value="good_better_bad">good : better :: bad : ?</option>
              </select>
            </div>
          </div>
          
          <div className="results-container">
            <h4>Word analogy completion for "{selectedAnalogy.replace(/_/g, ' : ').replace(/: ([^:]+)$/, ' : ?')}":</h4>
            <div className="tech-note">
              Using V<sub>result</sub> ≈ V<sub>{selectedAnalogy.split('_')[1]}</sub> - V<sub>{selectedAnalogy.split('_')[0]}</sub> + V<sub>{selectedAnalogy.split('_')[2]}</sub>
            </div>
            <div className="word-cloud">
              {sampleAnalogies[selectedAnalogy].map((word, index) => (
                <div 
                  key={index} 
                  className="word-chip"
                  style={{ 
                    opacity: 1 - (index * 0.07),
                    transform: `scale(${1 - (index * 0.03)})`
                  }}
                >
                  {word}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <button 
          className="technical-details-button"
          onClick={() => toggleTechnicalDetails('analogy')}
        >
          {showTechnicalDetails.analogy ? 'Hide Technical Details' : 'Show Technical Details'}
        </button>
        
        {showTechnicalDetails.analogy && (
          <div className="technical-details">
            <h4>Vector-based Word Analogy Resolution</h4>
            <p>
              Word analogy completion demonstrates how semantic relationships between words are encoded as vector transformations 
              in embedding space. For the analogy "A is to B as C is to D":
            </p>
            <div className="formula">
              V<sub>D</sub> ≈ V<sub>B</sub> - V<sub>A</sub> + V<sub>C</sub>
            </div>
            <p>
              The vector difference (V<sub>B</sub> - V<sub>A</sub>) captures the semantic relationship between words A and B. 
              Adding this difference to V<sub>C</sub> transforms it in the same way, yielding vectors close to word D.
            </p>
            <p>
              Implementation details:
            </p>
            <ol>
              <li>
                <strong>LLaMA Embedding:</strong> Converts individual words to contextual vectors
              </li>
              <li>
                <strong>Vector Operations:</strong> Performs arithmetic on the high-dimensional word vectors
              </li>
              <li>
                <strong>HNSW Search:</strong> Efficiently finds the closest word vectors to the result
              </li>
              <li>
                <strong>Filtering:</strong> Applies relevance thresholds to ensure quality word matches
              </li>
            </ol>
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div className="interactive-examples">
      <h2>Explore Word Vector Operations</h2>
      <p>
        These interactive examples demonstrate how Luminode's underlying word vector technologies enable 
        powerful semantic search and discovery capabilities through mathematical operations on word meanings.
      </p>
      
      <div className="example-tabs">
        <button 
          className={`example-tab ${activeExample === 'nearest' ? 'active' : ''}`}
          onClick={() => setActiveExample('nearest')}
        >
          Similar Words
        </button>
        <button 
          className={`example-tab ${activeExample === 'midpoint' ? 'active' : ''}`}
          onClick={() => setActiveExample('midpoint')}
        >
          Word Combinations
        </button>
        <button 
          className={`example-tab ${activeExample === 'analogy' ? 'active' : ''}`}
          onClick={() => setActiveExample('analogy')}
        >
          Word Analogies
        </button>
      </div>
      
      <div className="example-content">
        {activeExample === 'nearest' && renderNearestNeighbors()}
        {activeExample === 'midpoint' && renderMidpointSearch()}
        {activeExample === 'analogy' && renderAnalogies()}
      </div>
      
      <div className="try-full-app">
        <p>
          These examples use simplified demonstrations of Luminode's word vector technology.
          The full application implements these capabilities at scale using LLaMA embeddings, 
          vector database storage, and HNSW approximate nearest neighbor search to efficiently 
          navigate the semantic space of words and concepts.
        </p>
      </div>
      
      <style jsx="true">{`
        .interactive-examples {
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
          margin-top: 1rem;
          margin-bottom: 0.8rem;
          font-size: 1.2rem;
        }
        
        p {
          line-height: 1.6;
          margin-bottom: 1rem;
          font-size: 1.1rem;
        }
        
        .example-tabs {
          display: flex;
          border-bottom: 1px solid rgba(255, 165, 0, 0.3);
          margin-bottom: 1.5rem;
          overflow-x: auto;
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 165, 0, 0.5) transparent;
        }
        
        .example-tab {
          background: transparent;
          border: none;
          color: white;
          padding: 0.75rem 1.25rem;
          font-size: 1.1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
        }
        
        .example-tab:hover {
          color: #FFA500;
        }
        
        .example-tab.active {
          color: #FFA500;
          font-weight: bold;
        }
        
        .example-tab.active::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0;
          width: 100%;
          height: 3px;
          background-color: #FFA500;
          border-radius: 3px 3px 0 0;
        }
        
        .example-content {
          padding: 1rem;
          background-color: rgba(0, 0, 0, 0.2);
          border-radius: 8px;
          margin-bottom: 1.5rem;
        }
        
        .interactive-demo {
          background-color: rgba(26, 26, 46, 0.6);
          border-radius: 8px;
          padding: 1.5rem;
          margin: 1.5rem 0;
        }
        
        .demo-controls {
          margin-bottom: 1.5rem;
        }
        
        label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: bold;
          color: rgba(255, 255, 255, 0.9);
        }
        
        .select-container {
          position: relative;
          width: 100%;
          max-width: 300px;
        }
        
        select {
          width: 100%;
          padding: 0.5rem;
          background-color: rgba(0, 0, 0, 0.3);
          color: white;
          border: 1px solid rgba(255, 165, 0, 0.5);
          border-radius: 4px;
          appearance: none;
          cursor: pointer;
          font-size: 1rem;
        }
        
        .select-container::after {
          content: '▼';
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          color: #FFA500;
          pointer-events: none;
        }
        
        .results-container {
          background-color: rgba(0, 0, 0, 0.2);
          border-radius: 8px;
          padding: 1rem;
        }
        
        .tech-note {
          font-size: 0.9rem;
          color: rgba(255, 165, 0, 0.8);
          font-style: italic;
          margin: 0.5rem 0;
        }
        
        .word-cloud {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-top: 1rem;
        }
        
        .word-chip {
          background-color: rgba(255, 165, 0, 0.2);
          border: 1px solid rgba(255, 165, 0, 0.5);
          border-radius: 20px;
          padding: 0.4rem 0.8rem;
          font-size: 0.9rem;
          transition: all 0.3s ease;
        }
        
        .word-chip:hover {
          background-color: rgba(255, 165, 0, 0.4);
          transform: scale(1.05) !important;
        }
        
        .technical-details-button {
          background-color: transparent;
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: rgba(255, 255, 255, 0.8);
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.9rem;
          transition: all 0.3s ease;
        }
        
        .technical-details-button:hover {
          background-color: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 165, 0, 0.5);
          color: #FFA500;
        }
        
        .technical-details {
          margin-top: 1.5rem;
          padding: 1.5rem;
          background-color: rgba(0, 0, 0, 0.3);
          border-radius: 8px;
          border-left: 3px solid #FFA500;
        }
        
        ol {
          margin-left: 1.5rem;
          line-height: 1.6;
          margin-bottom: 1rem;
        }
        
        li {
          margin-bottom: 0.8rem;
          font-size: 1rem;
        }
        
        .formula {
          font-family: monospace;
          background-color: rgba(0, 0, 0, 0.4);
          padding: 0.8rem;
          border-radius: 4px;
          margin: 1rem 0;
          text-align: center;
          font-size: 1.1rem;
          color: #FFA500;
        }
        
        .try-full-app {
          text-align: center;
          margin-top: 2rem;
          padding: 1rem;
          background-color: rgba(255, 165, 0, 0.1);
          border-radius: 8px;
          border: 1px dashed rgba(255, 165, 0, 0.3);
        }
        
        strong {
          color: #FFA500;
        }
      `}</style>
    </div>
  );
};

export default InteractiveExamples; 