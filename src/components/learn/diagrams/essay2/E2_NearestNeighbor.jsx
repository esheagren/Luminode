import React from 'react';

const E2_NearestNeighbor = ({ caption = 'Finding similar vectors efficiently' }) => {
  return (
    <div className="nearest-neighbor-diagram">
      <div className="diagram-box">
        <svg width="100%" height="100%" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
          {/* Background grid for vector space */}
          <g transform="translate(30, 30)">
            <rect x="0" y="0" width="240" height="240" fill="rgba(26, 26, 46, 0.3)" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="0.5" />
            
            {/* Grid lines */}
            <g stroke="rgba(255, 255, 255, 0.05)" strokeWidth="0.5">
              <line x1="0" y1="60" x2="240" y2="60" />
              <line x1="0" y1="120" x2="240" y2="120" />
              <line x1="0" y1="180" x2="240" y2="180" />
              <line x1="60" y1="0" x2="60" y2="240" />
              <line x1="120" y1="0" x2="120" y2="240" />
              <line x1="180" y1="0" x2="180" y2="240" />
            </g>
            
            {/* Data points */}
            <circle cx="40" cy="50" r="3" fill="rgba(255, 255, 255, 0.6)" />
            <circle cx="80" cy="30" r="3" fill="rgba(255, 255, 255, 0.6)" />
            <circle cx="120" cy="70" r="3" fill="rgba(255, 255, 255, 0.6)" />
            <circle cx="150" cy="90" r="3" fill="rgba(255, 255, 255, 0.6)" />
            <circle cx="170" cy="50" r="3" fill="rgba(255, 255, 255, 0.6)" />
            <circle cx="210" cy="40" r="3" fill="rgba(255, 255, 255, 0.6)" />
            <circle cx="60" cy="110" r="3" fill="rgba(255, 255, 255, 0.6)" />
            <circle cx="100" cy="130" r="3" fill="rgba(255, 255, 255, 0.6)" />
            <circle cx="140" cy="150" r="3" fill="rgba(255, 255, 255, 0.6)" />
            <circle cx="180" cy="120" r="3" fill="rgba(255, 255, 255, 0.6)" />
            <circle cx="30" cy="170" r="3" fill="rgba(255, 255, 255, 0.6)" />
            <circle cx="70" cy="190" r="3" fill="rgba(255, 255, 255, 0.6)" />
            <circle cx="110" cy="210" r="3" fill="rgba(255, 255, 255, 0.6)" />
            <circle cx="150" cy="180" r="3" fill="rgba(255, 255, 255, 0.6)" />
            <circle cx="190" cy="200" r="3" fill="rgba(255, 255, 255, 0.6)" />
            <circle cx="220" cy="160" r="3" fill="rgba(255, 255, 255, 0.6)" />
            
            {/* Query point */}
            <circle cx="100" cy="100" r="6" fill="rgba(255, 165, 0, 0.8)" stroke="rgba(255, 165, 0, 1)" strokeWidth="1.5" />
            <text x="90" y="85" fontSize="10" fill="rgba(255, 255, 255, 0.9)">Query</text>
            
            {/* Nearest neighbors */}
            <circle cx="80" cy="130" r="5" fill="rgba(78, 205, 196, 0.7)" stroke="rgba(78, 205, 196, 1)" strokeWidth="1.5" />
            <circle cx="120" cy="70" r="5" fill="rgba(78, 205, 196, 0.7)" stroke="rgba(78, 205, 196, 1)" strokeWidth="1.5" />
            <circle cx="60" cy="110" r="5" fill="rgba(78, 205, 196, 0.7)" stroke="rgba(78, 205, 196, 1)" strokeWidth="1.5" />
            
            {/* Distance measurements */}
            <line x1="100" y1="100" x2="80" y2="130" stroke="rgba(78, 205, 196, 0.6)" strokeWidth="1" strokeDasharray="2" />
            <line x1="100" y1="100" x2="120" y2="70" stroke="rgba(78, 205, 196, 0.6)" strokeWidth="1" strokeDasharray="2" />
            <line x1="100" y1="100" x2="60" y2="110" stroke="rgba(78, 205, 196, 0.6)" strokeWidth="1" strokeDasharray="2" />
            
            {/* Search regions */}
            <circle cx="100" cy="100" r="60" fill="none" stroke="rgba(255, 165, 0, 0.3)" strokeWidth="1" strokeDasharray="3" />
            
            {/* Labels */}
            <text x="120" y="20" fontSize="12" fontWeight="bold" fill="rgba(255, 255, 255, 0.9)">Nearest Neighbor Search</text>
            <text x="85" y="220" fontSize="10" fill="rgba(255, 255, 255, 0.7)">Vector Space</text>
          </g>
          
          {/* Legend */}
          <g transform="translate(30, 280)">
            <circle cx="15" cy="0" r="4" fill="rgba(255, 165, 0, 0.8)" stroke="rgba(255, 165, 0, 1)" strokeWidth="1" />
            <text x="25" y="3" fontSize="8" fill="rgba(255, 255, 255, 0.8)">Query Vector</text>
            
            <circle cx="100" cy="0" r="4" fill="rgba(78, 205, 196, 0.7)" stroke="rgba(78, 205, 196, 1)" strokeWidth="1" />
            <text x="110" y="3" fontSize="8" fill="rgba(255, 255, 255, 0.8)">Nearest Neighbors</text>
            
            <circle cx="200" cy="0" r="4" fill="rgba(255, 255, 255, 0.6)" />
            <text x="210" y="3" fontSize="8" fill="rgba(255, 255, 255, 0.8)">Database Vectors</text>
          </g>
        </svg>
        <div className="diagram-caption"><em>{caption}</em></div>
      </div>
      
      <style jsx="true">{`
        .nearest-neighbor-diagram {
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

export default E2_NearestNeighbor; 