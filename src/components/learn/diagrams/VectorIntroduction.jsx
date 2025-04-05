import React from 'react';

const VectorIntroduction = ({ caption = 'Words as coordinates in semantic space' }) => {
  return (
    <div className="vector-intro-diagram">
      <div className="diagram-box">
        <svg width="100%" height="100%" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          {/* Coordinate system */}
          <line x1="20" y1="180" x2="180" y2="180" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="1" />
          <line x1="20" y1="20" x2="20" y2="180" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="1" />
          <line x1="20" y1="20" x2="45" y2="20" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="1" />
          
          {/* X and Y labels */}
          <text x="180" y="195" textAnchor="end" fontSize="10" fill="rgba(255, 255, 255, 0.7)">dimension 1</text>
          <text x="15" y="20" textAnchor="end" fontSize="10" fill="rgba(255, 255, 255, 0.7)">dimension 2</text>
          
          {/* Word vectors */}
          <circle cx="40" cy="60" r="4" fill="#FF8E53" />
          <text x="45" y="55" fontSize="10" fill="rgba(255, 255, 255, 0.9)">travel</text>
          
          <circle cx="50" cy="70" r="4" fill="#FF8E53" />
          <text x="55" y="65" fontSize="10" fill="rgba(255, 255, 255, 0.9)">vacation</text>
          
          <circle cx="45" cy="80" r="4" fill="#FF8E53" />
          <text x="50" y="75" fontSize="10" fill="rgba(255, 255, 255, 0.9)">journey</text>
          
          <circle cx="120" cy="110" r="4" fill="#4ECDC4" />
          <text x="125" y="105" fontSize="10" fill="rgba(255, 255, 255, 0.9)">house</text>
          
          <circle cx="140" cy="100" r="4" fill="#4ECDC4" />
          <text x="145" y="95" fontSize="10" fill="rgba(255, 255, 255, 0.9)">home</text>
          
          <circle cx="130" cy="120" r="4" fill="#4ECDC4" />
          <text x="135" y="115" fontSize="10" fill="rgba(255, 255, 255, 0.9)">apartment</text>
          
          {/* Group circles */}
          <circle cx="45" cy="70" r="25" fill="none" stroke="#FF8E53" strokeWidth="1" strokeDasharray="2,2" opacity="0.5" />
          <circle cx="130" cy="110" r="25" fill="none" stroke="#4ECDC4" strokeWidth="1" strokeDasharray="2,2" opacity="0.5" />
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

export default VectorIntroduction; 