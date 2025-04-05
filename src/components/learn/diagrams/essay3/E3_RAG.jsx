import React from 'react';

const E3_RAG = ({ caption = 'Grounding LLMs with external knowledge' }) => {
  return (
    <div className="rag-diagram">
      <div className="diagram-box">
        <svg width="100%" height="100%" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
          {/* Title */}
          <text x="150" y="30" textAnchor="middle" fontSize="14" fontWeight="bold" fill="rgba(255, 255, 255, 0.9)">Retrieval-Augmented Generation</text>
          
          {/* User query */}
          <g transform="translate(30, 60)">
            <rect x="0" y="0" width="240" height="35" rx="5" fill="rgba(78, 205, 196, 0.2)" stroke="rgba(78, 205, 196, 0.6)" strokeWidth="1.5" />
            <text x="120" y="15" textAnchor="middle" fontSize="10" fontWeight="bold" fill="rgba(255, 255, 255, 0.9)">User Query</text>
            <text x="120" y="28" textAnchor="middle" fontSize="9" fill="rgba(255, 255, 255, 0.8)">"How to reduce motion blur in low light?"</text>
          </g>
          
          {/* Query to embedding process arrow */}
          <g transform="translate(150, 105)">
            <path d="M0,-5 L0,15" stroke="rgba(255, 255, 255, 0.7)" strokeWidth="2" markerEnd="url(#ragarrow)" />
            <rect x="-50" y="0" width="100" height="20" rx="10" fill="rgba(255, 165, 0, 0.2)" stroke="rgba(255, 165, 0, 0.6)" strokeWidth="1" />
            <text x="0" y="14" textAnchor="middle" fontSize="9" fill="rgba(255, 255, 255, 0.8)">Embedding Model</text>
            
            <defs>
              <marker id="ragarrow" markerWidth="10" markerHeight="7" 
                      refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="rgba(255, 255, 255, 0.7)"/>
              </marker>
            </defs>
          </g>
          
          {/* Query Vector */}
          <g transform="translate(150, 135)">
            <rect x="-40" y="0" width="80" height="25" rx="3" fill="rgba(255, 107, 107, 0.2)" stroke="rgba(255, 107, 107, 0.6)" strokeWidth="1" />
            <text x="0" y="16" textAnchor="middle" fontSize="9" fill="rgba(255, 255, 255, 0.8)">Query Vector</text>
          </g>
          
          {/* Vector DB Search */}
          <g transform="translate(50, 175)">
            <rect x="0" y="0" width="80" height="60" rx="5" fill="rgba(26, 26, 46, 0.5)" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="1.5" />
            <text x="40" y="20" textAnchor="middle" fontSize="10" fontWeight="bold" fill="rgba(255, 255, 255, 0.9)">Vector DB</text>
            <g transform="translate(15, 30)">
              <circle cx="0" cy="0" r="3" fill="rgba(255, 255, 255, 0.5)" />
              <circle cx="15" cy="10" r="3" fill="rgba(255, 255, 255, 0.5)" />
              <circle cx="30" cy="5" r="3" fill="rgba(255, 255, 255, 0.5)" />
              <circle cx="45" cy="15" r="3" fill="rgba(255, 255, 255, 0.5)" />
              <circle cx="50" cy="0" r="3" fill="rgba(255, 255, 255, 0.5)" />
              
              <line x1="0" y1="0" x2="15" y2="10" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="0.5" />
              <line x1="15" y1="10" x2="30" y2="5" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="0.5" />
              <line x1="30" y1="5" x2="45" y2="15" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="0.5" />
              <line x1="45" y1="15" x2="50" y2="0" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="0.5" />
            </g>
          </g>
          
          {/* Search arrow */}
          <path d="M150,160 L90,175" stroke="rgba(255, 255, 255, 0.7)" strokeWidth="1.5" markerEnd="url(#ragarrow)" />
          <text x="115" y="160" fontSize="9" fill="rgba(255, 255, 255, 0.7)">search</text>
          
          {/* Document Chunks */}
          <g transform="translate(170, 175)">
            <rect x="0" y="0" width="80" height="60" rx="5" fill="rgba(255, 165, 0, 0.2)" stroke="rgba(255, 165, 0, 0.6)" strokeWidth="1.5" />
            <text x="40" y="15" textAnchor="middle" fontSize="10" fontWeight="bold" fill="rgba(255, 255, 255, 0.9)">Chunks</text>
            
            <rect x="10" y="25" width="60" height="8" rx="1" fill="rgba(255, 255, 255, 0.1)" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="0.5" />
            <rect x="10" y="38" width="60" height="8" rx="1" fill="rgba(255, 255, 255, 0.1)" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="0.5" />
            <rect x="10" y="51" width="60" height="8" rx="1" fill="rgba(255, 255, 255, 0.1)" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="0.5" />
          </g>
          
          {/* Results arrow */}
          <path d="M130,175 L170,175" stroke="rgba(255, 255, 255, 0.7)" strokeWidth="1.5" markerEnd="url(#ragarrow)" />
          <text x="150" y="170" fontSize="9" fill="rgba(255, 255, 255, 0.7)">retrieve</text>
          
          {/* LLM Processing */}
          <g transform="translate(150, 245)">
            <path d="M0,-5 L0,15" stroke="rgba(255, 255, 255, 0.7)" strokeWidth="2" markerEnd="url(#ragarrow)" />
            <text x="50" y="0" fontSize="9" fill="rgba(255, 255, 255, 0.7)">prompt with context</text>
            
            <rect x="-100" y="20" width="200" height="35" rx="5" fill="rgba(192, 179, 225, 0.2)" stroke="rgba(192, 179, 225, 0.6)" strokeWidth="1.5" />
            <text x="0" y="35" textAnchor="middle" fontSize="10" fontWeight="bold" fill="rgba(255, 255, 255, 0.9)">Large Language Model</text>
            <text x="0" y="48" textAnchor="middle" fontSize="8" fill="rgba(255, 255, 255, 0.7)">Generates accurate, grounded response</text>
          </g>
        </svg>
        <div className="diagram-caption"><em>{caption}</em></div>
      </div>
      
      <style jsx="true">{`
        .rag-diagram {
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

export default E3_RAG; 