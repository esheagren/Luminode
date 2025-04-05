import React from 'react';

const E3_VectorEcosystem = ({ caption = 'Building with vector operations at scale' }) => {
  return (
    <div className="vector-ecosystem-diagram">
      <div className="diagram-box">
        <svg width="100%" height="100%" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
          {/* Title */}
          <text x="150" y="30" textAnchor="middle" fontSize="14" fontWeight="bold" fill="rgba(255, 255, 255, 0.9)">Vector Ecosystem</text>
          
          {/* Central Platform */}
          <rect x="100" y="120" width="100" height="60" rx="5" fill="rgba(78, 205, 196, 0.2)" stroke="rgba(78, 205, 196, 0.6)" strokeWidth="1.5" />
          <text x="150" y="140" textAnchor="middle" fontSize="11" fontWeight="bold" fill="rgba(255, 255, 255, 0.9)">Vector Database</text>
          <text x="150" y="155" textAnchor="middle" fontSize="8" fill="rgba(255, 255, 255, 0.7)">Semantic Search</text>
          <text x="150" y="168" textAnchor="middle" fontSize="8" fill="rgba(255, 255, 255, 0.7)">Similarity Matching</text>
          
          {/* Data sources */}
          <g transform="translate(50, 70)">
            <rect x="0" y="0" width="70" height="40" rx="5" fill="rgba(255, 165, 0, 0.2)" stroke="rgba(255, 165, 0, 0.6)" strokeWidth="1.5" />
            <text x="35" y="15" textAnchor="middle" fontSize="9" fontWeight="bold" fill="rgba(255, 255, 255, 0.9)">Data Sources</text>
            <text x="35" y="28" textAnchor="middle" fontSize="7" fill="rgba(255, 255, 255, 0.7)">Documents, Images,</text>
            <text x="35" y="38" textAnchor="middle" fontSize="7" fill="rgba(255, 255, 255, 0.7)">Audio, etc.</text>
            
            <path d="M35,40 L100,120" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="1.5" markerEnd="url(#ecoarrow)" />
            <text x="60" y="85" transform="rotate(-45, 60, 85)" fontSize="8" fill="rgba(255, 255, 255, 0.6)">ingest</text>
            
            <defs>
              <marker id="ecoarrow" markerWidth="10" markerHeight="7" 
                      refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="rgba(255, 255, 255, 0.4)"/>
              </marker>
            </defs>
          </g>
          
          {/* Embedding Models */}
          <g transform="translate(180, 70)">
            <rect x="0" y="0" width="70" height="40" rx="5" fill="rgba(255, 107, 107, 0.2)" stroke="rgba(255, 107, 107, 0.6)" strokeWidth="1.5" />
            <text x="35" y="15" textAnchor="middle" fontSize="9" fontWeight="bold" fill="rgba(255, 255, 255, 0.9)">Embedding</text>
            <text x="35" y="28" textAnchor="middle" fontSize="7" fill="rgba(255, 255, 255, 0.7)">Transformer Models</text>
            <text x="35" y="38" textAnchor="middle" fontSize="7" fill="rgba(255, 255, 255, 0.7)">Sentence Encoders</text>
            
            <path d="M35,40 L200,120" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="1.5" markerEnd="url(#ecoarrow)" />
            <text x="80" y="85" transform="rotate(45, 80, 85)" fontSize="8" fill="rgba(255, 255, 255, 0.6)">convert</text>
          </g>
          
          {/* Applications section */}
          
          {/* Search */}
          <g transform="translate(40, 190)">
            <rect x="0" y="0" width="70" height="40" rx="5" fill="rgba(255, 255, 255, 0.1)" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="1" />
            <text x="35" y="15" textAnchor="middle" fontSize="9" fontWeight="bold" fill="rgba(255, 255, 255, 0.9)">Semantic Search</text>
            <text x="35" y="30" textAnchor="middle" fontSize="7" fill="rgba(255, 255, 255, 0.7)">Find relevant content</text>
            
            <path d="M70,20 L100,150" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="1.5" markerEnd="url(#ecoarrow)" />
          </g>
          
          {/* Recommendations */}
          <g transform="translate(40, 240)">
            <rect x="0" y="0" width="70" height="40" rx="5" fill="rgba(255, 255, 255, 0.1)" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="1" />
            <text x="35" y="15" textAnchor="middle" fontSize="9" fontWeight="bold" fill="rgba(255, 255, 255, 0.9)">Recommendations</text>
            <text x="35" y="30" textAnchor="middle" fontSize="7" fill="rgba(255, 255, 255, 0.7)">Product suggestions</text>
            
            <path d="M70,20 L100,150" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="1.5" markerEnd="url(#ecoarrow)" />
          </g>
          
          {/* RAG */}
          <g transform="translate(190, 190)">
            <rect x="0" y="0" width="70" height="40" rx="5" fill="rgba(255, 255, 255, 0.1)" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="1" />
            <text x="35" y="15" textAnchor="middle" fontSize="9" fontWeight="bold" fill="rgba(255, 255, 255, 0.9)">RAG Systems</text>
            <text x="35" y="30" textAnchor="middle" fontSize="7" fill="rgba(255, 255, 255, 0.7)">Ground LLM outputs</text>
            
            <path d="M0,20 L200,150" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="1.5" markerEnd="url(#ecoarrow)" />
          </g>
          
          {/* AI Agents */}
          <g transform="translate(190, 240)">
            <rect x="0" y="0" width="70" height="40" rx="5" fill="rgba(255, 255, 255, 0.1)" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="1" />
            <text x="35" y="15" textAnchor="middle" fontSize="9" fontWeight="bold" fill="rgba(255, 255, 255, 0.9)">AI Agents</text>
            <text x="35" y="30" textAnchor="middle" fontSize="7" fill="rgba(255, 255, 255, 0.7)">Knowledge workers</text>
            
            <path d="M0,20 L200,150" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="1.5" markerEnd="url(#ecoarrow)" />
          </g>
          
          {/* Flow line labels */}
          <text x="20" y="210" transform="rotate(-90, 20, 210)" fontSize="10" fontWeight="bold" fill="rgba(255, 255, 255, 0.5)">Applications</text>
          <text x="280" y="210" transform="rotate(90, 280, 210)" fontSize="10" fontWeight="bold" fill="rgba(255, 255, 255, 0.5)">Applications</text>
          
          {/* Core technologies label */}
          <text x="150" y="110" textAnchor="middle" fontSize="10" fontWeight="bold" fill="rgba(255, 255, 255, 0.5)">Core Technologies</text>
        </svg>
        <div className="diagram-caption"><em>{caption}</em></div>
      </div>
      
      <style jsx="true">{`
        .vector-ecosystem-diagram {
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

export default E3_VectorEcosystem; 