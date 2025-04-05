import React from 'react';

const E1_VectorsMeaning = ({ caption = 'Polysemy: How context-aware embeddings handle word ambiguity' }) => {
  return (
    <div className="vector-meaning-diagram">
      <div className="diagram-box">
        <svg width="100%" height="100%" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          {/* Title */}
          <text x="30" y="25" fontSize="12" fontWeight="bold" fill="rgba(255, 255, 255, 0.9)">Polysemy: Same Word, Different Meanings</text>
          
          {/* Water stream cluster */}
          <circle cx="65" cy="75" r="25" fill="rgba(76, 205, 196, 0.2)" stroke="#4ECDC4" strokeWidth="1.5" />
          <text x="65" y="50" fontSize="11" fontWeight="bold" fill="#4ECDC4" textAnchor="middle">Water Context</text>
          
          <circle cx="65" cy="75" r="8" fill="#4ECDC4" />
          <text x="65" y="78" fontSize="10" fontWeight="bold" fill="white" textAnchor="middle">stream</text>
          
          {/* Video stream cluster */}
          <circle cx="135" cy="75" r="25" fill="rgba(255, 142, 83, 0.2)" stroke="#FF8E53" strokeWidth="1.5" />
          <text x="135" y="50" fontSize="11" fontWeight="bold" fill="#FF8E53" textAnchor="middle">Video Context</text>
          
          <circle cx="135" cy="75" r="8" fill="#FF8E53" />
          <text x="135" y="78" fontSize="10" fontWeight="bold" fill="white" textAnchor="middle">stream</text>
          
          {/* Static embedding */}
          <circle cx="100" cy="140" r="8" fill="#FF6B6B" />
          <text x="100" y="143" fontSize="10" fontWeight="bold" fill="white" textAnchor="middle">stream</text>
          
          {/* Connect to static embedding */}
          <line x1="65" y1="75" x2="100" y2="140" stroke="#4ECDC4" strokeWidth="1.5" strokeDasharray="3,3" />
          <line x1="135" y1="75" x2="100" y2="140" stroke="#FF8E53" strokeWidth="1.5" strokeDasharray="3,3" />
          
          {/* Explanation arrows */}
          <path d="M70,110 L90,125" stroke="#4ECDC4" strokeWidth="1" fill="none" markerEnd="url(#arrowhead1)" />
          <path d="M130,110 L110,125" stroke="#FF8E53" strokeWidth="1" fill="none" markerEnd="url(#arrowhead2)" />
          
          {/* Arrowhead definitions */}
          <defs>
            <marker id="arrowhead1" markerWidth="5" markerHeight="5" refX="5" refY="2.5" orient="auto">
              <polygon points="0 0, 5 2.5, 0 5" fill="#4ECDC4" />
            </marker>
            <marker id="arrowhead2" markerWidth="5" markerHeight="5" refX="5" refY="2.5" orient="auto">
              <polygon points="0 0, 5 2.5, 0 5" fill="#FF8E53" />
            </marker>
          </defs>
          
          {/* Labels */}
          <text x="100" y="160" fontSize="10" fill="#FF6B6B" textAnchor="middle">Static embedding</text>
          <text x="100" y="175" fontSize="10" fill="rgba(255, 255, 255, 0.8)" textAnchor="middle">(combines both meanings)</text>
          
          {/* Footer */}
          <text x="100" y="195" fontSize="9" fill="rgba(255, 255, 255, 0.8)" textAnchor="middle">Context-aware models disambiguate the meanings</text>
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