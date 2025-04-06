import React from 'react';

const E1_VectorsMeaning = ({ caption = 'Contextual embeddings resolve word ambiguity' }) => {
  return (
    <div className="vector-meaning-diagram">
      <div className="diagram-box">
        <svg width="100%" height="100%" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          {/* Title */}
          <text x="100" y="20" fontSize="12" fontWeight="bold" fill="rgba(255, 255, 255, 0.9)" textAnchor="middle">
            Static vs. Contextual Embeddings
          </text>
          
          {/* Dividing line between static and contextual */}
          <line x1="10" y1="100" x2="190" y2="100" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="1" strokeDasharray="3,2" />
          
          {/* Static embedding header */}
          <text x="40" y="40" fontSize="11" fontWeight="bold" fill="rgba(255, 255, 255, 0.8)">Static Embedding</text>
          
          {/* Static embedding bank example */}
          <circle cx="40" cy="70" r="20" fill="rgba(255, 107, 107, 0.2)" stroke="#FF6B6B" strokeWidth="1.5" />
          <circle cx="40" cy="70" r="6" fill="#FF6B6B" />
          <text x="40" y="73" fontSize="8" fontWeight="bold" fill="white" textAnchor="middle">bank</text>
          
          {/* Bank meanings in static model */}
          <text x="40" y="50" fontSize="9" fill="#FF6B6B" textAnchor="middle">Single vector</text>
          <text x="85" y="65" fontSize="8" fill="rgba(255, 255, 255, 0.8)">Financial</text>
          <text x="85" y="75" fontSize="8" fill="rgba(255, 255, 255, 0.8)">River edge</text>
          <text x="85" y="85" fontSize="8" fill="rgba(255, 255, 255, 0.8)">To rely on</text>
          
          <line x1="50" y1="65" x2="75" y2="65" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="0.8" />
          <line x1="50" y1="75" x2="75" y2="75" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="0.8" />
          <line x1="50" y1="85" x2="75" y2="85" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="0.8" />
          
          {/* Static embedding confusion icon */}
          <text x="135" y="75" fontSize="24" fill="rgba(255, 107, 107, 0.8)" textAnchor="middle">⚠️</text>
          <text x="135" y="90" fontSize="8" fill="rgba(255, 255, 255, 0.7)" textAnchor="middle">Meaning confusion</text>
          
          {/* Contextual embedding header */}
          <text x="40" y="120" fontSize="11" fontWeight="bold" fill="rgba(255, 255, 255, 0.8)">Contextual Embedding</text>
          
          {/* Financial context */}
          <circle cx="40" cy="150" r="15" fill="rgba(76, 114, 176, 0.2)" stroke="#4C72B0" strokeWidth="1.5" />
          <circle cx="40" cy="150" r="6" fill="#4C72B0" />
          <text x="40" y="153" fontSize="8" fontWeight="bold" fill="white" textAnchor="middle">bank</text>
          <text x="40" y="173" fontSize="8" fill="#4C72B0" textAnchor="middle">Financial context</text>
          
          {/* River context */}
          <circle cx="100" cy="150" r="15" fill="rgba(76, 205, 196, 0.2)" stroke="#4ECDC4" strokeWidth="1.5" />
          <circle cx="100" cy="150" r="6" fill="#4ECDC4" />
          <text x="100" y="153" fontSize="8" fontWeight="bold" fill="white" textAnchor="middle">bank</text>
          <text x="100" y="173" fontSize="8" fill="#4ECDC4" textAnchor="middle">River context</text>
          
          {/* Rely on context */}
          <circle cx="160" cy="150" r="15" fill="rgba(255, 142, 83, 0.2)" stroke="#FF8E53" strokeWidth="1.5" />
          <circle cx="160" cy="150" r="6" fill="#FF8E53" />
          <text x="160" y="153" fontSize="8" fontWeight="bold" fill="white" textAnchor="middle">bank</text>
          <text x="160" y="173" fontSize="8" fill="#FF8E53" textAnchor="middle">Rely on context</text>
          
          {/* Context sentences */}
          <text x="40" y="185" fontSize="8" fill="rgba(255, 255, 255, 0.6)" textAnchor="middle">"deposit"</text>
          <text x="100" y="185" fontSize="8" fill="rgba(255, 255, 255, 0.6)" textAnchor="middle">"river"</text>
          <text x="160" y="185" fontSize="8" fill="rgba(255, 255, 255, 0.6)" textAnchor="middle">"count on"</text>
          
          {/* Footer */}
          <text x="100" y="195" fontSize="9" fill="rgba(255, 255, 255, 0.8)" textAnchor="middle">
            Surrounding words determine the specific meaning
          </text>
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

export default E1_VectorsMeaning; 