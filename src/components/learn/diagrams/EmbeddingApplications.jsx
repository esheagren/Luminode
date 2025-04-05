import React from 'react';

const EmbeddingApplications = ({ caption = 'Applying embeddings in real-world systems' }) => {
  return (
    <div className="embedding-applications-diagram">
      <div className="diagram-box">
        <svg width="100%" height="100%" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          {/* LLM System */}
          <rect x="20" y="20" width="160" height="70" rx="4" fill="rgba(255, 165, 0, 0.1)" stroke="rgba(255, 165, 0, 0.5)" strokeWidth="1" />
          <text x="100" y="35" textAnchor="middle" fontSize="10" fontWeight="bold" fill="rgba(255, 255, 255, 0.9)">Language Understanding</text>
          
          {/* Input */}
          <rect x="30" y="45" width="60" height="15" rx="2" fill="rgba(255, 255, 255, 0.1)" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="1" />
          <text x="60" y="56" textAnchor="middle" fontSize="8" fill="rgba(255, 255, 255, 0.8)">User Query</text>
          
          {/* Embedding */}
          <rect x="70" y="70" width="60" height="15" rx="2" fill="rgba(255, 165, 0, 0.2)" stroke="rgba(255, 165, 0, 0.6)" strokeWidth="1" />
          <text x="100" y="81" textAnchor="middle" fontSize="8" fill="rgba(255, 255, 255, 0.8)">Embeddings</text>
          
          {/* Output */}
          <rect x="110" y="45" width="60" height="15" rx="2" fill="rgba(255, 255, 255, 0.1)" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="1" />
          <text x="140" y="56" textAnchor="middle" fontSize="8" fill="rgba(255, 255, 255, 0.8)">Response</text>
          
          {/* Arrows */}
          <path d="M60,60 L80,70" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="1" markerEnd="url(#arrow)" />
          <path d="M120,70 L140,60" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="1" markerEnd="url(#arrow)" />
          
          {/* Recommendation System */}
          <rect x="20" y="110" width="160" height="70" rx="4" fill="rgba(78, 205, 196, 0.1)" stroke="rgba(78, 205, 196, 0.5)" strokeWidth="1" />
          <text x="100" y="125" textAnchor="middle" fontSize="10" fontWeight="bold" fill="rgba(255, 255, 255, 0.9)">Recommendation System</text>
          
          {/* User Embeddings */}
          <rect x="30" y="135" width="60" height="15" rx="2" fill="rgba(78, 205, 196, 0.2)" stroke="rgba(78, 205, 196, 0.6)" strokeWidth="1" />
          <text x="60" y="146" textAnchor="middle" fontSize="8" fill="rgba(255, 255, 255, 0.8)">User Vector</text>
          
          {/* Item Embeddings */}
          <rect x="110" y="135" width="60" height="15" rx="2" fill="rgba(78, 205, 196, 0.2)" stroke="rgba(78, 205, 196, 0.6)" strokeWidth="1" />
          <text x="140" y="146" textAnchor="middle" fontSize="8" fill="rgba(255, 255, 255, 0.8)">Item Vectors</text>
          
          {/* Similarity Calculation */}
          <rect x="70" y="160" width="60" height="15" rx="2" fill="rgba(255, 255, 255, 0.1)" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="1" />
          <text x="100" y="171" textAnchor="middle" fontSize="8" fill="rgba(255, 255, 255, 0.8)">Similarity Match</text>
          
          {/* Arrows */}
          <path d="M60,150 L80,160" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="1" markerEnd="url(#arrow)" />
          <path d="M140,150 L120,160" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="1" markerEnd="url(#arrow)" />
          
          {/* Arrow definition */}
          <defs>
            <marker id="arrow" markerWidth="10" markerHeight="7" 
                    refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="rgba(255, 255, 255, 0.5)"/>
            </marker>
          </defs>
        </svg>
        <div className="diagram-caption"><em>{caption}</em></div>
      </div>
      
      <style jsx="true">{`
        .embedding-applications-diagram {
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

export default EmbeddingApplications; 