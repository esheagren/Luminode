import React from 'react';

const E2_DimensionalityReduction = ({ caption = 'Projecting high-dimensional data to 2D/3D' }) => {
  return (
    <div className="dimensionality-reduction-diagram">
      <div className="diagram-box">
        <svg width="100%" height="100%" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
          {/* High dimensional space */}
          <g transform="translate(50, 50)">
            <rect x="0" y="0" width="200" height="100" rx="5" fill="rgba(78, 205, 196, 0.1)" stroke="rgba(78, 205, 196, 0.5)" strokeWidth="1.5" />
            <text x="100" y="20" textAnchor="middle" fontSize="12" fontWeight="bold" fill="rgba(255, 255, 255, 0.9)">High-Dimensional Space</text>
            
            {/* Data points in high-dim */}
            <circle cx="40" cy="40" r="3" fill="rgba(255, 107, 107, 0.8)" />
            <circle cx="60" cy="70" r="3" fill="rgba(255, 107, 107, 0.8)" />
            <circle cx="100" cy="30" r="3" fill="rgba(255, 107, 107, 0.8)" />
            <circle cx="120" cy="60" r="3" fill="rgba(255, 107, 107, 0.8)" />
            <circle cx="150" cy="40" r="3" fill="rgba(255, 107, 107, 0.8)" />
            <circle cx="170" cy="80" r="3" fill="rgba(255, 107, 107, 0.8)" />
            
            {/* Axis hints */}
            <line x1="0" y1="100" x2="10" y2="90" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="1" />
            <text x="12" y="90" fontSize="8" fill="rgba(255, 255, 255, 0.5)">d1</text>
            
            <line x1="0" y1="100" x2="20" y2="100" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="1" />
            <text x="22" y="100" fontSize="8" fill="rgba(255, 255, 255, 0.5)">d2</text>
            
            <line x1="0" y1="100" x2="0" y2="80" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="1" />
            <text x="0" y="76" fontSize="8" fill="rgba(255, 255, 255, 0.5)">d3</text>
            
            <text x="110" y="80" fontSize="8" fill="rgba(255, 255, 255, 0.5)">dimensions: 100+</text>
          </g>
          
          {/* Transformation arrow */}
          <g transform="translate(150, 160)">
            <path d="M0,0 L0,30" stroke="rgba(255, 255, 255, 0.7)" strokeWidth="2" markerEnd="url(#arrowhead)" />
            <g transform="translate(-60, 15)">
              <rect x="0" y="0" width="120" height="25" rx="12" fill="rgba(255, 165, 0, 0.2)" stroke="rgba(255, 165, 0, 0.6)" strokeWidth="1" />
              <text x="60" y="16" textAnchor="middle" fontSize="10" fill="rgba(255, 255, 255, 0.9)">PCA / t-SNE / UMAP</text>
            </g>
          </g>
          
          {/* Low dimensional projection */}
          <g transform="translate(50, 200)">
            <rect x="0" y="0" width="200" height="80" rx="5" fill="rgba(255, 165, 0, 0.1)" stroke="rgba(255, 165, 0, 0.5)" strokeWidth="1.5" />
            <text x="100" y="20" textAnchor="middle" fontSize="12" fontWeight="bold" fill="rgba(255, 255, 255, 0.9)">2D Projection</text>
            
            {/* Cluster 1 */}
            <circle cx="50" cy="40" r="3" fill="rgba(255, 107, 107, 0.8)" />
            <circle cx="45" cy="50" r="3" fill="rgba(255, 107, 107, 0.8)" />
            <circle cx="55" cy="45" r="3" fill="rgba(255, 107, 107, 0.8)" />
            
            {/* Cluster 2 */}
            <circle cx="150" cy="50" r="3" fill="rgba(255, 107, 107, 0.8)" />
            <circle cx="140" cy="55" r="3" fill="rgba(255, 107, 107, 0.8)" />
            <circle cx="160" cy="45" r="3" fill="rgba(255, 107, 107, 0.8)" />
            
            {/* Axis lines */}
            <line x1="0" y1="60" x2="200" y2="60" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="1" />
            <text x="195" y="70" fontSize="8" fill="rgba(255, 255, 255, 0.5)">x</text>
            
            <line x1="20" y1="70" x2="20" y2="0" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="1" />
            <text x="15" y="10" fontSize="8" fill="rgba(255, 255, 255, 0.5)">y</text>
            
            <text x="110" y="70" fontSize="8" fill="rgba(255, 255, 255, 0.5)">dimensions: 2</text>
          </g>
          
          {/* Arrow definition */}
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" 
                  refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="rgba(255, 255, 255, 0.7)"/>
            </marker>
          </defs>
        </svg>
        <div className="diagram-caption"><em>{caption}</em></div>
      </div>
      
      <style jsx="true">{`
        .dimensionality-reduction-diagram {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .diagram-box {
          width: 100%;
          height: 100%;
          max-width: 300px;
          max-height: 300px;
          border-radius: 8px;
          background-color: rgba(26, 26, 46, 0.7);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
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

export default E2_DimensionalityReduction; 