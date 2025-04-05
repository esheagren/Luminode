import React from 'react';

const E1_Summary = ({ caption = 'The complete embedding ecosystem' }) => {
  return (
    <div className="embedding-summary-diagram">
      <div className="diagram-box">
        <svg width="100%" height="100%" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
          {/* Central concept */}
          <circle cx="200" cy="200" r="35" fill="rgba(255, 165, 0, 0.3)" stroke="rgba(255, 165, 0, 0.7)" strokeWidth="2" />
          <text x="200" y="200" textAnchor="middle" dominantBaseline="middle" fill="rgba(255, 255, 255, 0.9)" fontSize="10" fontWeight="bold">Vector Embeddings</text>
          
          {/* Surrounding concepts */}
          {/* Word2Vec */}
          <circle cx="120" cy="120" r="25" fill="rgba(78, 205, 196, 0.2)" stroke="rgba(78, 205, 196, 0.6)" strokeWidth="1.5" />
          <text x="120" y="120" textAnchor="middle" dominantBaseline="middle" fill="rgba(255, 255, 255, 0.9)" fontSize="9">Word2Vec</text>
          <line x1="144" y1="144" x2="175" y2="175" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="1" strokeDasharray="4" />
          
          {/* Transformers */}
          <circle cx="280" cy="120" r="25" fill="rgba(78, 205, 196, 0.2)" stroke="rgba(78, 205, 196, 0.6)" strokeWidth="1.5" />
          <text x="280" y="120" textAnchor="middle" dominantBaseline="middle" fill="rgba(255, 255, 255, 0.9)" fontSize="9">Transformers</text>
          <line x1="256" y1="144" x2="225" y2="175" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="1" strokeDasharray="4" />
          
          {/* LLMs */}
          <circle cx="280" cy="280" r="25" fill="rgba(78, 205, 196, 0.2)" stroke="rgba(78, 205, 196, 0.6)" strokeWidth="1.5" />
          <text x="280" y="280" textAnchor="middle" dominantBaseline="middle" fill="rgba(255, 255, 255, 0.9)" fontSize="9">LLMs</text>
          <line x1="256" y1="256" x2="225" y2="225" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="1" strokeDasharray="4" />
          
          {/* Recommendations */}
          <circle cx="120" cy="280" r="25" fill="rgba(78, 205, 196, 0.2)" stroke="rgba(78, 205, 196, 0.6)" strokeWidth="1.5" />
          <text x="120" y="280" textAnchor="middle" dominantBaseline="middle" fill="rgba(255, 255, 255, 0.9)" fontSize="9">Recommendations</text>
          <line x1="144" y1="256" x2="175" y2="225" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="1" strokeDasharray="4" />
          
          {/* Databases */}
          <circle cx="90" cy="200" r="25" fill="rgba(78, 205, 196, 0.2)" stroke="rgba(78, 205, 196, 0.6)" strokeWidth="1.5" />
          <text x="90" y="200" textAnchor="middle" dominantBaseline="middle" fill="rgba(255, 255, 255, 0.9)" fontSize="9">Databases</text>
          <line x1="115" y1="200" x2="165" y2="200" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="1" strokeDasharray="4" />
          
          {/* Visualization */}
          <circle cx="310" cy="200" r="25" fill="rgba(78, 205, 196, 0.2)" stroke="rgba(78, 205, 196, 0.6)" strokeWidth="1.5" />
          <text x="310" y="200" textAnchor="middle" dominantBaseline="middle" fill="rgba(255, 255, 255, 0.9)" fontSize="9">Visualization</text>
          <line x1="285" y1="200" x2="235" y2="200" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="1" strokeDasharray="4" />
          
          {/* Text Search */}
          <circle cx="200" cy="90" r="25" fill="rgba(78, 205, 196, 0.2)" stroke="rgba(78, 205, 196, 0.6)" strokeWidth="1.5" />
          <text x="200" y="90" textAnchor="middle" dominantBaseline="middle" fill="rgba(255, 255, 255, 0.9)" fontSize="9">Text Search</text>
          <line x1="200" y1="115" x2="200" y2="165" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="1" strokeDasharray="4" />
          
          {/* Similarity Metrics */}
          <circle cx="200" cy="310" r="25" fill="rgba(78, 205, 196, 0.2)" stroke="rgba(78, 205, 196, 0.6)" strokeWidth="1.5" />
          <text x="200" y="310" textAnchor="middle" dominantBaseline="middle" fill="rgba(255, 255, 255, 0.9)" fontSize="9">Similarity Metrics</text>
          <line x1="200" y1="285" x2="200" y2="235" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="1" strokeDasharray="4" />
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

export default E1_Summary; 