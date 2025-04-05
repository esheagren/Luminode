import React from 'react';

const E1_VectorsMeaning = ({ caption = 'Distance corresponds to semantic similarity' }) => {
  return (
    <div className="vector-meaning-diagram">
      <div className="diagram-box">
        <svg width="100%" height="100%" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          {/* Coordinate system */}
          <line x1="20" y1="180" x2="180" y2="180" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="1" />
          <line x1="20" y1="20" x2="20" y2="180" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="1" />
          
          {/* Food cluster */}
          <circle cx="60" cy="60" r="4" fill="#FF8E53" />
          <text x="65" y="55" fontSize="10" fill="rgba(255, 255, 255, 0.9)">food</text>
          
          <circle cx="70" cy="70" r="4" fill="#FF8E53" />
          <text x="75" y="65" fontSize="10" fill="rgba(255, 255, 255, 0.9)">meal</text>
          
          <circle cx="55" cy="75" r="4" fill="#FF8E53" />
          <text x="60" y="70" fontSize="10" fill="rgba(255, 255, 255, 0.9)">dinner</text>
          
          <circle cx="65" cy="55" r="4" fill="#FF8E53" />
          <text x="70" y="50" fontSize="10" fill="rgba(255, 255, 255, 0.9)">eat</text>
          
          <circle cx="75" cy="65" r="4" fill="#FF8E53" />
          <text x="80" y="60" fontSize="10" fill="rgba(255, 255, 255, 0.9)">restaurant</text>
          
          {/* Cluster circle */}
          <circle cx="65" cy="65" r="25" fill="none" stroke="#FF8E53" strokeWidth="1" opacity="0.7" />
          
          {/* Distance Measurement */}
          <circle cx="140" cy="130" r="4" fill="#4ECDC4" />
          <text x="145" y="125" fontSize="10" fill="rgba(255, 255, 255, 0.9)">laptop</text>
          
          <line x1="65" y1="65" x2="140" y2="130" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="1" strokeDasharray="3,3" />
          <text x="95" y="100" fontSize="9" fill="rgba(255, 255, 255, 0.7)">semantic distance</text>
          
          {/* Stream with two meanings */}
          <circle cx="50" cy="150" r="4" fill="#FF6B6B" />
          <text x="55" y="145" fontSize="10" fill="rgba(255, 255, 255, 0.9)">stream (water)</text>
          
          <circle cx="150" cy="150" r="4" fill="#FF6B6B" />
          <text x="155" y="145" fontSize="10" fill="rgba(255, 255, 255, 0.9)">stream (video)</text>
          
          <line x1="50" y1="150" x2="150" y2="150" stroke="rgba(255, 100, 100, 0.3)" strokeWidth="1" strokeDasharray="2,2" />
          <text x="100" y="165" fontSize="9" fill="rgba(255, 100, 100, 0.7)">same word, different meanings</text>
        </svg>
        <div className="diagram-caption"><em>{caption}</em></div>
      </div>
      
      <style jsx="true">{`
        .vector-meaning-diagram {
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

export default E1_VectorsMeaning; 