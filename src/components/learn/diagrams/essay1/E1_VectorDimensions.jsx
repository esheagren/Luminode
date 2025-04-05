import React, { useState, useEffect } from 'react';

const E1_VectorDimensions = ({ caption = 'Understanding vectors across dimensions', scrollOffset = 0 }) => {
  const [dimensionState, setDimensionState] = useState(0); // 0: 2D, 1: 3D, 2: Higher dimensions
  
  // Update dimension state based on scroll offset within this section
  useEffect(() => {
    // Determine which dimension state to show based on relative scroll position
    const localScroll = scrollOffset || 0;
    
    if (localScroll < 100) {
      setDimensionState(0); // 2D view
    } else if (localScroll < 300) {
      setDimensionState(1); // 3D view
    } else {
      setDimensionState(2); // Many dimensions view
    }
  }, [scrollOffset]);
  
  // Helper to render the correct dimension visualization
  const renderDimensionView = () => {
    if (dimensionState === 0) {
      // 2D Vector representation
      return (
        <g>
          <text x="100" y="25" fontSize="12" fontWeight="bold" fill="rgba(255, 255, 255, 0.9)" textAnchor="middle">
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
          
          {/* Dimension indicator */}
          <text x="100" y="175" fontSize="9" fill="rgba(255, 255, 255, 0.8)" textAnchor="middle">
            Dimensions: 2
          </text>
        </g>
      );
    } else if (dimensionState === 1) {
      // 3D Vector representation
      return (
        <g>
          <text x="100" y="25" fontSize="12" fontWeight="bold" fill="rgba(255, 255, 255, 0.9)" textAnchor="middle">
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
          
          {/* Coordinates */}
          <text x="110" y="95" fontSize="10" fill="#7CBE42">
            (3, 4, 2)
          </text>
          
          {/* Dimension indicator */}
          <text x="100" y="175" fontSize="9" fill="rgba(255, 255, 255, 0.8)" textAnchor="middle">
            Dimensions: 3
          </text>
        </g>
      );
    } else {
      // Higher dimensions representation
      return (
        <g>
          <text x="100" y="25" fontSize="12" fontWeight="bold" fill="rgba(255, 255, 255, 0.9)" textAnchor="middle">
            High-Dimensional Vector
          </text>
          
          {/* Matrix/vector representation */}
          <rect x="60" y="60" width="80" height="90" rx="3" fill="rgba(124, 190, 66, 0.1)" stroke="#7CBE42" strokeWidth="1" />
          
          {/* Vector values with ellipsis to suggest many dimensions */}
          <text x="100" y="75" fontSize="10" fill="rgba(255, 255, 255, 0.9)" textAnchor="middle">v = [0.32, 0.91, 0.14,</text>
          <text x="100" y="90" fontSize="10" fill="rgba(255, 255, 255, 0.9)" textAnchor="middle">-0.27, 0.68, 0.55,</text>
          <text x="100" y="105" fontSize="10" fill="rgba(255, 255, 255, 0.9)" textAnchor="middle">0.42, -0.12, 0.39,</text>
          <text x="100" y="120" fontSize="10" fill="rgba(255, 255, 255, 0.9)" textAnchor="middle">...</text>
          <text x="100" y="135" fontSize="10" fill="rgba(255, 255, 255, 0.9)" textAnchor="middle">0.78, -0.25]</text>
          
          {/* Dimension indicator */}
          <text x="100" y="175" fontSize="9" fill="rgba(255, 255, 255, 0.8)" textAnchor="middle">
            Dimensions: 300+
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