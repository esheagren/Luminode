import React from 'react';

const E1_Algorithms = ({ caption = 'Evolution of embedding techniques' }) => {
  return (
    <div className="embedding-algorithms-diagram">
      <div className="diagram-box">
        <svg width="100%" height="100%" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          {/* Timeline */}
          <line x1="20" y1="100" x2="180" y2="100" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="1" />
          
          {/* Word2Vec */}
          <circle cx="50" cy="100" r="6" fill="#FF8E53" />
          <text x="50" y="85" textAnchor="middle" fontSize="10" fill="rgba(255, 255, 255, 0.9)">Word2Vec</text>
          <text x="50" y="120" textAnchor="middle" fontSize="8" fill="rgba(255, 255, 255, 0.7)">2013</text>
          
          {/* GloVe */}
          <circle cx="90" cy="100" r="6" fill="#4ECDC4" />
          <text x="90" y="85" textAnchor="middle" fontSize="10" fill="rgba(255, 255, 255, 0.9)">GloVe</text>
          <text x="90" y="120" textAnchor="middle" fontSize="8" fill="rgba(255, 255, 255, 0.7)">2014</text>
          
          {/* BERT */}
          <circle cx="130" cy="100" r="6" fill="#FF6B6B" />
          <text x="130" y="85" textAnchor="middle" fontSize="10" fill="rgba(255, 255, 255, 0.9)">BERT</text>
          <text x="130" y="120" textAnchor="middle" fontSize="8" fill="rgba(255, 255, 255, 0.7)">2018</text>
          
          {/* LLaMa */}
          <circle cx="170" cy="100" r="6" fill="#C0B3E1" />
          <text x="170" y="85" textAnchor="middle" fontSize="10" fill="rgba(255, 255, 255, 0.9)">LLaMa</text>
          <text x="170" y="120" textAnchor="middle" fontSize="8" fill="rgba(255, 255, 255, 0.7)">2023</text>
          
          {/* Arrows and descriptions */}
          <path d="M50,150 L90,150" stroke="#CCCCCC" strokeWidth="1" fill="none" markerEnd="url(#arrowhead)" />
          <text x="70" y="145" textAnchor="middle" fontSize="8" fill="rgba(255, 255, 255, 0.7)">global statistics</text>
          
          <path d="M90,160 L130,160" stroke="#CCCCCC" strokeWidth="1" fill="none" markerEnd="url(#arrowhead)" />
          <text x="110" y="155" textAnchor="middle" fontSize="8" fill="rgba(255, 255, 255, 0.7)">contextual awareness</text>
          
          <path d="M130,170 L170,170" stroke="#CCCCCC" strokeWidth="1" fill="none" markerEnd="url(#arrowhead)" />
          <text x="150" y="165" textAnchor="middle" fontSize="8" fill="rgba(255, 255, 255, 0.7)">scale & performance</text>
          
          {/* Arrow marker definition */}
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" 
                    refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#CCCCCC"/>
            </marker>
          </defs>
          
          {/* Title */}
          <text x="100" y="30" textAnchor="middle" fontSize="12" fontWeight="bold" fill="rgba(255, 255, 255, 0.9)">Evolution of Embedding Models</text>
          
          {/* Examples */}
          <text x="50" y="190" textAnchor="middle" fontSize="8" fill="rgba(255, 165, 0, 0.9)">static embeddings</text>
          <text x="150" y="190" textAnchor="middle" fontSize="8" fill="rgba(255, 165, 0, 0.9)">contextual embeddings</text>
        </svg>
        <div className="diagram-caption"><em>{caption}</em></div>
      </div>
      
      <style jsx="true">{`
        .embedding-algorithms-diagram {
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

export default E1_Algorithms; 