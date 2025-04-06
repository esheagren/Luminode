import React, { useState, useEffect } from 'react';

const E1_VectorDimensions = ({ caption = 'Understanding vectors across dimensions', scrollOffset = 0 }) => {
  const [dimensionState, setDimensionState] = useState(0); // 0: 2D, 1: 3D, 2: GloVe, 3: LLaMA
  
  // Update dimension state based on scroll offset within this section
  useEffect(() => {
    // Determine which dimension state to show based on relative scroll position
    const localScroll = scrollOffset || 0;
    
    if (localScroll < 100) {
      setDimensionState(0); // 2D view
    } else if (localScroll < 250) {
      setDimensionState(1); // 3D view
    } else if (localScroll < 350) {
      setDimensionState(2); // GloVe (300 dimensions)
    } else {
      setDimensionState(3); // LLaMA (up to 2048 dimensions)
    }
  }, [scrollOffset]);
  
  // Helper to render the correct dimension visualization
  const renderDimensionView = () => {
    if (dimensionState === 0) {
      // 2D Vector representation
      return (
        <g>
          <text x="100" y="25" fontSize="13" fontWeight="bold" fill="rgba(255, 255, 255, 0.9)" textAnchor="middle">
            2D Vector: (X, Y)
          </text>
          
          {/* Axes */}
          <line x1="40" y1="150" x2="160" y2="150" stroke="rgba(255, 255, 255, 0.7)" strokeWidth="1" />
          <line x1="40" y1="50" x2="40" y2="150" stroke="rgba(255, 255, 255, 0.7)" strokeWidth="1" />
          
          {/* Axis labels */}
          <text x="165" y="150" fontSize="10" fill="rgba(255, 255, 255, 0.9)">X</text>
          <text x="40" y="45" fontSize="10" fill="rgba(255, 255, 255, 0.9)">Y</text>
          
          {/* Point and vector */}
          <circle cx="100" cy="90" r="4" fill="#7CBE42" />
          <line x1="40" y1="150" x2="100" y2="90" stroke="#7CBE42" strokeWidth="1.5" />
          
          {/* Coordinates */}
          <text x="110" y="90" fontSize="10" fill="#7CBE42">
            (3, 4)
          </text>
          
          {/* Scale markers */}
          <line x1="70" y1="148" x2="70" y2="152" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="1" />
          <line x1="100" y1="148" x2="100" y2="152" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="1" />
          <line x1="130" y1="148" x2="130" y2="152" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="1" />
          <text x="70" y="160" fontSize="8" fill="rgba(255, 255, 255, 0.5)" textAnchor="middle">1</text>
          <text x="100" y="160" fontSize="8" fill="rgba(255, 255, 255, 0.5)" textAnchor="middle">2</text>
          <text x="130" y="160" fontSize="8" fill="rgba(255, 255, 255, 0.5)" textAnchor="middle">3</text>
          
          <line x1="38" y1="120" x2="42" y2="120" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="1" />
          <line x1="38" y1="90" x2="42" y2="90" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="1" />
          <line x1="38" y1="60" x2="42" y2="60" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="1" />
          <text x="33" y="120" fontSize="8" fill="rgba(255, 255, 255, 0.5)" textAnchor="middle">1</text>
          <text x="33" y="90" fontSize="8" fill="rgba(255, 255, 255, 0.5)" textAnchor="middle">2</text>
          <text x="33" y="60" fontSize="8" fill="rgba(255, 255, 255, 0.5)" textAnchor="middle">3</text>
          
          {/* Dimension indicator */}
          <text x="100" y="185" fontSize="10" fill="rgba(255, 255, 255, 0.8)" textAnchor="middle">
            Simple 2D vectors can represent basic relationships
          </text>
        </g>
      );
    } else if (dimensionState === 1) {
      // 3D Vector representation
      return (
        <g>
          <text x="100" y="25" fontSize="13" fontWeight="bold" fill="rgba(255, 255, 255, 0.9)" textAnchor="middle">
            3D Vector: (X, Y, Z)
          </text>
          
          {/* 3D coordinate system (simple isometric view) */}
          <line x1="40" y1="150" x2="140" y2="150" stroke="rgba(255, 255, 255, 0.7)" strokeWidth="1" /> {/* X axis */}
          <line x1="40" y1="150" x2="40" y2="70" stroke="rgba(255, 255, 255, 0.7)" strokeWidth="1" /> {/* Y axis */}
          <line x1="40" y1="150" x2="80" y2="130" stroke="rgba(255, 255, 255, 0.7)" strokeWidth="1" /> {/* Z axis */}
          
          {/* Axis labels */}
          <text x="145" y="150" fontSize="10" fill="rgba(255, 255, 255, 0.9)">X</text>
          <text x="40" y="65" fontSize="10" fill="rgba(255, 255, 255, 0.9)">Y</text>
          <text x="85" y="130" fontSize="10" fill="rgba(255, 255, 255, 0.9)">Z</text>
          
          {/* 3D point and vector representation */}
          <circle cx="100" cy="100" r="4" fill="#7CBE42" />
          <line x1="40" y1="150" x2="100" y2="100" stroke="#7CBE42" strokeWidth="1.5" />
          
          {/* Projected lines for clarity */}
          <line x1="100" y1="100" x2="100" y2="150" stroke="#7CBE42" strokeWidth="0.5" strokeDasharray="2,2" />
          <line x1="100" y1="100" x2="40" y2="100" stroke="#7CBE42" strokeWidth="0.5" strokeDasharray="2,2" />
          <line x1="100" y1="100" x2="62" y2="139" stroke="#7CBE42" strokeWidth="0.5" strokeDasharray="2,2" />
          
          {/* Coordinates */}
          <text x="110" y="95" fontSize="10" fill="#7CBE42">
            (3, 4, 2)
          </text>
          
          {/* Dimension indicator */}
          <text x="100" y="185" fontSize="10" fill="rgba(255, 255, 255, 0.8)" textAnchor="middle">
            Adding a third dimension allows more complex representations
          </text>
        </g>
      );
    } else if (dimensionState === 2) {
      // GloVe 300 dimensions popup
      return (
        <g>
          <text x="100" y="25" fontSize="13" fontWeight="bold" fill="rgba(255, 255, 255, 0.9)" textAnchor="middle">
            Word Embeddings
          </text>
          
          {/* GloVe popup */}
          <rect 
            x="30" 
            y="60" 
            width="140" 
            height="80" 
            rx="6" 
            fill="rgba(71, 145, 201, 0.15)" 
            stroke="rgba(71, 145, 201, 0.5)" 
            strokeWidth="1"
          />
          
          <text x="100" y="80" fontSize="12" fontWeight="bold" fill="#4791C9" textAnchor="middle">
            GloVe Embeddings
          </text>
          
          <text x="100" y="105" fontSize="10" fill="rgba(255, 255, 255, 0.9)" textAnchor="middle">
            300 dimensions
          </text>
          
          <text x="100" y="125" fontSize="9" fill="rgba(255, 255, 255, 0.7)" textAnchor="middle">
            One of the first popular word embedding models
          </text>
          
          {/* Dimension scale */}
          <rect 
            x="40" 
            y="150" 
            width="120" 
            height="10" 
            rx="2" 
            fill="rgba(255, 255, 255, 0.05)" 
            stroke="rgba(255, 255, 255, 0.2)" 
            strokeWidth="1"
          />
          <rect 
            x="40" 
            y="150" 
            width="17" 
            height="10" 
            rx="2" 
            fill="rgba(71, 145, 201, 0.5)" 
            strokeWidth="0"
          />
          
          <text x="100" y="175" fontSize="9" fill="rgba(255, 255, 255, 0.5)" textAnchor="middle">
            2D → 3D → ... → 300D → ... → 1024D → 2048D → 4096D
          </text>
          
          <text x="100" y="195" fontSize="10" fill="rgba(255, 255, 255, 0.8)" textAnchor="middle">
            Higher dimensions capture subtle semantic relationships
          </text>
        </g>
      );
    } else {
      // LLaMA dimensions popup
      return (
        <g>
          <text x="100" y="25" fontSize="13" fontWeight="bold" fill="rgba(255, 255, 255, 0.9)" textAnchor="middle">
            Modern Language Models
          </text>
          
          {/* LLaMA popup */}
          <rect 
            x="30" 
            y="60" 
            width="140" 
            height="80" 
            rx="6" 
            fill="rgba(255, 165, 0, 0.15)" 
            stroke="rgba(255, 165, 0, 0.5)" 
            strokeWidth="1"
          />
          
          <text x="100" y="80" fontSize="12" fontWeight="bold" fill="rgba(255, 165, 0, 0.9)" textAnchor="middle">
            LLaMA Models
          </text>
          
          <text x="100" y="105" fontSize="10" fill="rgba(255, 255, 255, 0.9)" textAnchor="middle">
            1024 - 2048 dimensions
          </text>
          
          <text x="100" y="125" fontSize="9" fill="rgba(255, 255, 255, 0.7)" textAnchor="middle">
            Modern models with advanced contextual understanding
          </text>
          
          {/* Dimension scale */}
          <rect 
            x="40" 
            y="150" 
            width="120" 
            height="10" 
            rx="2" 
            fill="rgba(255, 255, 255, 0.05)" 
            stroke="rgba(255, 255, 255, 0.2)" 
            strokeWidth="1"
          />
          <rect 
            x="40" 
            y="150" 
            width="90" 
            height="10" 
            rx="2" 
            fill="rgba(255, 165, 0, 0.5)" 
            strokeWidth="0"
          />
          
          <text x="100" y="175" fontSize="9" fill="rgba(255, 255, 255, 0.5)" textAnchor="middle">
            2D → 3D → ... → 300D → ... → 1024D → 2048D → 4096D
          </text>
          
          <text x="100" y="195" fontSize="10" fill="rgba(255, 255, 255, 0.8)" textAnchor="middle">
            Massive dimensionality enables human-like language abilities
          </text>
        </g>
      );
    }
  };
  
  return (
    <div className="vector-dimensions-diagram">
      <div className="diagram-box">
        <svg width="100%" height="100%" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          {renderDimensionView()}
        </svg>
        <div className="diagram-caption"><em>{caption}</em></div>
      </div>
      
      <style jsx="true">{`
        .vector-dimensions-diagram {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .diagram-box {
          width: 100%;
          height: 100%;
          max-width: 350px;
          max-height: 350px;
          border-radius: 8px;
          background-color: transparent;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          padding: 10px;
          transition: all 0.5s ease;
        }
        
        .diagram-caption {
          text-align: center;
          margin-top: 10px;
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.7);
        }
      `}</style>
    </div>
  );
};

export default E1_VectorDimensions; 