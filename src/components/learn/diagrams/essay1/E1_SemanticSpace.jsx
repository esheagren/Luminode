import React from 'react';

const E1_Introduction = ({ caption = 'Words as coordinates in semantic space' }) => {
  return (
    <div className="vector-intro-diagram">
      <div className="diagram-box">
        <svg width="100%" height="100%" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
          {/* Coordinate system */}
          <line x1="50" y1="250" x2="250" y2="250" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="1.5" />
          <line x1="50" y1="50" x2="50" y2="250" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="1.5" />
          
          {/* X and Y labels */}
          <text x="250" y="275" textAnchor="middle" fontSize="14" fill="rgba(255, 255, 255, 0.7)"></text>
          <text x="25" y="150" textAnchor="middle" fontSize="14" fill="rgba(255, 255, 255, 0.7)" transform="rotate(-90, 25, 150)"></text>
          
          {/* Travel group */}
          <circle cx="100" cy="100" r="5" fill="#FF8E53" />
          <text x="110" y="100" fontSize="14" fill="rgba(255, 255, 255, 0.9)">travel</text>
          
          <circle cx="120" cy="120" r="5" fill="#FF8E53" />
          <text x="130" y="120" fontSize="14" fill="rgba(255, 255, 255, 0.9)">vacation</text>
          
          <circle cx="90" cy="130" r="5" fill="#FF8E53" />
          <text x="100" y="130" fontSize="14" fill="rgba(255, 255, 255, 0.9)">journey</text>
          
          {/* Home group */}
          <circle cx="210" cy="180" r="5" fill="#4ECDC4" />
          <text x="220" y="180" fontSize="14" fill="rgba(255, 255, 255, 0.9)">house</text>
          
          <circle cx="230" cy="150" r="5" fill="#4ECDC4" />
          <text x="240" y="150" fontSize="14" fill="rgba(255, 255, 255, 0.9)">home</text>
          
          <circle cx="200" cy="200" r="5" fill="#4ECDC4" />
          <text x="210" y="200" fontSize="14" fill="rgba(255, 255, 255, 0.9)">apartment</text>
          
          {/* Group circles */}
          <circle cx="105" cy="115" r="35" fill="none" stroke="#FF8E53" strokeWidth="1.5" strokeDasharray="3,3" opacity="0.6" />
          <circle cx="210" cy="175" r="35" fill="none" stroke="#4ECDC4" strokeWidth="1.5" strokeDasharray="3,3" opacity="0.6" />
        </svg>
        <div className="diagram-caption"><em>{caption}</em></div>
      </div>
      
      <style jsx="true">{`
        .vector-intro-diagram {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .diagram-box {
          width: 100%;
          height: 100%;
          max-width: 400px;
          max-height: 400px;
          border-radius: 8px;
          background-color: rgba(26, 26, 46, 0.7);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          padding: 20px;
        }
        
        .diagram-caption {
          text-align: center;
          margin-top: 15px;
          font-size: 1rem;
          color: rgba(255, 255, 255, 0.7);
        }
      `}</style>
    </div>
  );
};

export default E1_Introduction; 