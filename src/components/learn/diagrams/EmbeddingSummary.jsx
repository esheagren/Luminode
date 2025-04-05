import React from 'react';

const EmbeddingSummary = ({ caption = 'The complete embedding ecosystem' }) => {
  return (
    <div className="embedding-summary-diagram">
      <div className="diagram-box">
        <svg width="100%" height="100%" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          {/* Central Embedding Concept */}
          <circle cx="100" cy="100" r="30" fill="rgba(255, 165, 0, 0.2)" stroke="rgba(255, 165, 0, 0.6)" strokeWidth="1.5" />
          <text x="100" y="100" textAnchor="middle" fontSize="10" fontWeight="bold" fill="rgba(255, 255, 255, 0.9)">Vector</text>
          <text x="100" y="112" textAnchor="middle" fontSize="10" fontWeight="bold" fill="rgba(255, 255, 255, 0.9)">Embeddings</text>
          
          {/* Surrounding Concepts with Connecting Lines */}
          {/* Word2Vec */}
          <circle cx="45" cy="45" r="15" fill="rgba(78, 205, 196, 0.2)" stroke="rgba(78, 205, 196, 0.5)" strokeWidth="1" />
          <text x="45" y="45" textAnchor="middle" fontSize="8" fill="rgba(255, 255, 255, 0.9)">Word2Vec</text>
          <line x1="61" y1="61" x2="80" y2="80" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="1" strokeDasharray="2,2" />
          
          {/* Transformers */}
          <circle cx="45" cy="155" r="15" fill="rgba(78, 205, 196, 0.2)" stroke="rgba(78, 205, 196, 0.5)" strokeWidth="1" />
          <text x="45" y="155" textAnchor="middle" fontSize="8" fill="rgba(255, 255, 255, 0.9)">Transformers</text>
          <line x1="61" y1="139" x2="80" y2="120" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="1" strokeDasharray="2,2" />
          
          {/* LLMs */}
          <circle cx="155" cy="45" r="15" fill="rgba(255, 107, 107, 0.2)" stroke="rgba(255, 107, 107, 0.5)" strokeWidth="1" />
          <text x="155" y="45" textAnchor="middle" fontSize="8" fill="rgba(255, 255, 255, 0.9)">LLMs</text>
          <line x1="139" y1="61" x2="120" y2="80" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="1" strokeDasharray="2,2" />
          
          {/* Recommendations */}
          <circle cx="155" cy="155" r="15" fill="rgba(255, 107, 107, 0.2)" stroke="rgba(255, 107, 107, 0.5)" strokeWidth="1" />
          <text x="155" y="151" textAnchor="middle" fontSize="8" fill="rgba(255, 255, 255, 0.9)">Recom-</text>
          <text x="155" y="159" textAnchor="middle" fontSize="8" fill="rgba(255, 255, 255, 0.9)">mendations</text>
          <line x1="139" y1="139" x2="120" y2="120" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="1" strokeDasharray="2,2" />
          
          {/* Databases */}
          <circle cx="100" cy="30" r="15" fill="rgba(192, 179, 225, 0.2)" stroke="rgba(192, 179, 225, 0.5)" strokeWidth="1" />
          <text x="100" y="30" textAnchor="middle" fontSize="8" fill="rgba(255, 255, 255, 0.9)">Databases</text>
          <line x1="100" y1="45" x2="100" y2="70" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="1" strokeDasharray="2,2" />
          
          {/* Visualization */}
          <circle cx="100" cy="170" r="15" fill="rgba(192, 179, 225, 0.2)" stroke="rgba(192, 179, 225, 0.5)" strokeWidth="1" />
          <text x="100" y="170" textAnchor="middle" fontSize="8" fill="rgba(255, 255, 255, 0.9)">Visualization</text>
          <line x1="100" y1="155" x2="100" y2="130" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="1" strokeDasharray="2,2" />
          
          {/* Text Search */}
          <circle cx="30" cy="100" r="15" fill="rgba(255, 222, 121, 0.2)" stroke="rgba(255, 222, 121, 0.5)" strokeWidth="1" />
          <text x="30" y="96" textAnchor="middle" fontSize="8" fill="rgba(255, 255, 255, 0.9)">Text</text>
          <text x="30" y="104" textAnchor="middle" fontSize="8" fill="rgba(255, 255, 255, 0.9)">Search</text>
          <line x1="45" y1="100" x2="70" y2="100" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="1" strokeDasharray="2,2" />
          
          {/* Similarity */}
          <circle cx="170" cy="100" r="15" fill="rgba(255, 222, 121, 0.2)" stroke="rgba(255, 222, 121, 0.5)" strokeWidth="1" />
          <text x="170" y="96" textAnchor="middle" fontSize="8" fill="rgba(255, 255, 255, 0.9)">Similarity</text>
          <text x="170" y="104" textAnchor="middle" fontSize="8" fill="rgba(255, 255, 255, 0.9)">Metrics</text>
          <line x1="155" y1="100" x2="130" y2="100" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="1" strokeDasharray="2,2" />
        </svg>
        <div className="diagram-caption"><em>{caption}</em></div>
      </div>
      
      <style jsx="true">{`
        .embedding-summary-diagram {
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

export default EmbeddingSummary; 