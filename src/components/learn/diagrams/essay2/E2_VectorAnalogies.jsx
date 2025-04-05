import React from 'react';

const E2_VectorAnalogies = ({ caption = 'king - man + woman ≈ queen' }) => {
  return (
    <div className="vector-analogies-diagram">
      <div className="diagram-box">
        <svg width="100%" height="100%" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
          {/* Coordinate system */}
          <g transform="translate(50, 50)">
            <line x1="0" y1="200" x2="200" y2="200" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="1.5" />
            <line x1="0" y1="200" x2="0" y2="0" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="1.5" />
            
            {/* Axis labels */}
            <text x="180" y="215" fontSize="10" fill="rgba(255, 255, 255, 0.7)">Gender</text>
            <text x="-30" y="30" fontSize="10" fill="rgba(255, 255, 255, 0.7)">Royalty</text>
            
            {/* Words as vectors */}
            <circle cx="40" cy="180" r="5" fill="rgba(78, 205, 196, 0.8)" />
            <text x="40" y="170" textAnchor="middle" fontSize="11" fill="rgba(78, 205, 196, 0.9)">man</text>
            
            <circle cx="160" cy="180" r="5" fill="rgba(255, 165, 0, 0.8)" />
            <text x="160" y="170" textAnchor="middle" fontSize="11" fill="rgba(255, 165, 0, 0.9)">woman</text>
            
            <circle cx="40" cy="40" r="5" fill="rgba(255, 107, 107, 0.8)" />
            <text x="40" y="30" textAnchor="middle" fontSize="11" fill="rgba(255, 107, 107, 0.9)">king</text>
            
            <circle cx="160" cy="40" r="5" fill="rgba(255, 255, 255, 0.8)" />
            <text x="160" y="30" textAnchor="middle" fontSize="11" fill="rgba(255, 255, 255, 0.9)">queen</text>
            
            {/* Analogy vector arrows */}
            <line x1="40" y1="180" x2="160" y2="180" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="1" strokeDasharray="3" />
            <text x="100" y="195" textAnchor="middle" fontSize="9" fill="rgba(255, 255, 255, 0.7)">gender difference</text>
            
            <line x1="40" y1="180" x2="40" y2="40" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="1" strokeDasharray="3" />
            <text x="20" y="110" textAnchor="middle" fontSize="9" fill="rgba(255, 255, 255, 0.7)" transform="rotate(-90, 20, 110)">royalty difference</text>
            
            <path d="M40,40 L160,40 L160,180" fill="none" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="1" strokeDasharray="2" />
          </g>
          
          {/* Analogy equation */}
          <g transform="translate(150, 230)">
            <rect x="-100" y="0" width="200" height="30" rx="5" fill="rgba(26, 26, 46, 0.5)" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="1" />
            <text x="0" y="20" textAnchor="middle" fontSize="12" fontWeight="bold" fill="rgba(255, 255, 255, 0.9)">king - man + woman ≈ queen</text>
          </g>
          
          {/* Title */}
          <text x="150" y="30" textAnchor="middle" fontSize="14" fontWeight="bold" fill="rgba(255, 255, 255, 0.9)">Vector Analogies</text>
          
          {/* Operation illustration */}
          <g transform="translate(50, 270)">
            <circle cx="30" cy="0" r="4" fill="rgba(255, 107, 107, 0.8)" />
            <text x="35" y="3" fontSize="9" fill="rgba(255, 107, 107, 0.9)">king</text>
            
            <text x="60" y="3" fontSize="12" fill="rgba(255, 255, 255, 0.9)">-</text>
            
            <circle cx="75" cy="0" r="4" fill="rgba(78, 205, 196, 0.8)" />
            <text x="80" y="3" fontSize="9" fill="rgba(78, 205, 196, 0.9)">man</text>
            
            <text x="100" y="3" fontSize="12" fill="rgba(255, 255, 255, 0.9)">+</text>
            
            <circle cx="120" cy="0" r="4" fill="rgba(255, 165, 0, 0.8)" />
            <text x="125" y="3" fontSize="9" fill="rgba(255, 165, 0, 0.9)">woman</text>
            
            <text x="155" y="3" fontSize="12" fill="rgba(255, 255, 255, 0.9)">≈</text>
            
            <circle cx="170" cy="0" r="4" fill="rgba(255, 255, 255, 0.8)" />
            <text x="175" y="3" fontSize="9" fill="rgba(255, 255, 255, 0.9)">queen</text>
          </g>
        </svg>
        <div className="diagram-caption"><em>{caption}</em></div>
      </div>
      
      <style jsx="true">{`
        .vector-analogies-diagram {
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

export default E2_VectorAnalogies; 