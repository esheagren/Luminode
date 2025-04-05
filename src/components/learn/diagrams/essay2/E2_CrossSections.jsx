import React from 'react';

const E2_CrossSections = ({ caption = 'Finding meanings between concepts' }) => {
  return (
    <div className="cross-sections-diagram">
      <div className="diagram-box">
        <svg width="100%" height="100%" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
          {/* Background */}
          <rect x="20" y="20" width="260" height="260" rx="5" fill="rgba(26, 26, 46, 0.3)" />
          
          {/* Title */}
          <text x="150" y="40" textAnchor="middle" fontSize="14" fontWeight="bold" fill="rgba(255, 255, 255, 0.9)">Vector Midpoints</text>
          
          {/* Vector space with midpoint */}
          <g transform="translate(150, 150)">
            {/* Vector A - Budget Travel */}
            <circle cx="-80" cy="-60" r="6" fill="rgba(255, 165, 0, 0.8)" stroke="rgba(255, 165, 0, 1)" strokeWidth="1" />
            <text x="-80" y="-75" textAnchor="middle" fontSize="10" fill="rgba(255, 165, 0, 0.9)">Budget Travel</text>
            <text x="-80" y="-45" textAnchor="middle" fontSize="8" fill="rgba(255, 255, 255, 0.7)">Vector A</text>
            
            {/* Vector B - Luxury Travel */}
            <circle cx="80" cy="60" r="6" fill="rgba(78, 205, 196, 0.8)" stroke="rgba(78, 205, 196, 1)" strokeWidth="1" />
            <text x="80" y="75" textAnchor="middle" fontSize="10" fill="rgba(78, 205, 196, 0.9)">Luxury Travel</text>
            <text x="80" y="45" textAnchor="middle" fontSize="8" fill="rgba(255, 255, 255, 0.7)">Vector B</text>
            
            {/* Connecting line */}
            <line x1="-80" y1="-60" x2="80" y2="60" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="1" strokeDasharray="4" />
            
            {/* Midpoint */}
            <circle cx="0" cy="0" r="8" fill="rgba(255, 107, 107, 0.7)" stroke="rgba(255, 107, 107, 1)" strokeWidth="1.5" />
            <text x="0" y="15" textAnchor="middle" fontSize="10" fill="rgba(255, 107, 107, 0.9)">Midpoint</text>
            <text x="0" y="30" textAnchor="middle" fontSize="9" fill="rgba(255, 255, 255, 0.8)">Mid-tier Travel</text>
            
            {/* Formula */}
            <g transform="translate(0, -100)">
              <rect x="-80" y="0" width="160" height="25" rx="5" fill="rgba(26, 26, 46, 0.5)" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="1" />
              <text x="0" y="16" textAnchor="middle" fontSize="10" fill="rgba(255, 255, 255, 0.8)">M = (A + B) / 2</text>
            </g>
          </g>
          
          {/* Nearest neighbors */}
          <g transform="translate(45, 210)">
            <text x="0" y="0" fontSize="10" fontWeight="bold" fill="rgba(255, 255, 255, 0.8)">Nearest Neighbors to Midpoint:</text>
            <g transform="translate(20, 15)">
              <circle cx="0" cy="0" r="3" fill="rgba(255, 255, 255, 0.7)" />
              <text x="10" y="3" fontSize="8" fill="rgba(255, 255, 255, 0.7)">Mid-range hotels</text>
            </g>
            <g transform="translate(20, 30)">
              <circle cx="0" cy="0" r="3" fill="rgba(255, 255, 255, 0.7)" />
              <text x="10" y="3" fontSize="8" fill="rgba(255, 255, 255, 0.7)">Comfort travel</text>
            </g>
            <g transform="translate(20, 45)">
              <circle cx="0" cy="0" r="3" fill="rgba(255, 255, 255, 0.7)" />
              <text x="10" y="3" fontSize="8" fill="rgba(255, 255, 255, 0.7)">Value vacation</text>
            </g>
          </g>
          
          {/* Another example with music */}
          <g transform="translate(180, 210)">
            <text x="0" y="0" fontSize="10" fontWeight="bold" fill="rgba(255, 255, 255, 0.8)">Another Example:</text>
            <g transform="translate(10, 15)">
              <text x="0" y="3" fontSize="8" fill="rgba(255, 165, 0, 0.9)">Jazz</text>
              <text x="30" y="3" fontSize="8" fill="rgba(255, 255, 255, 0.7)">+</text>
              <text x="45" y="3" fontSize="8" fill="rgba(78, 205, 196, 0.9)">Rock</text>
              <text x="70" y="3" fontSize="8" fill="rgba(255, 255, 255, 0.7)">≈</text>
              <text x="85" y="3" fontSize="8" fill="rgba(255, 107, 107, 0.9)">Fusion</text>
            </g>
          </g>
        </svg>
        <div className="diagram-caption"><em>{caption}</em></div>
      </div>
      
      <style jsx="true">{`
        .cross-sections-diagram {
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

export default E2_CrossSections; 