import React from 'react';

const E3_VectorDatabases = ({ caption = 'Specialized storage for embedding vectors' }) => {
  return (
    <div className="vector-databases-diagram">
      <div className="diagram-box">
        <svg width="100%" height="100%" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
          {/* Title */}
          <text x="150" y="30" textAnchor="middle" fontSize="14" fontWeight="bold" fill="rgba(255, 255, 255, 0.9)">Vector Database Architecture</text>
          
          {/* Database structure */}
          <rect x="50" y="50" width="200" height="200" rx="5" fill="rgba(26, 26, 46, 0.5)" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="1.5" />
          
          {/* Index section */}
          <rect x="60" y="60" width="180" height="70" rx="3" fill="rgba(78, 205, 196, 0.2)" stroke="rgba(78, 205, 196, 0.6)" strokeWidth="1" />
          <text x="150" y="75" textAnchor="middle" fontSize="11" fontWeight="bold" fill="rgba(255, 255, 255, 0.9)">Vector Index</text>
          
          {/* Index visualization */}
          <g transform="translate(70, 85)">
            <circle cx="10" cy="10" r="3" fill="rgba(255, 255, 255, 0.7)" />
            <circle cx="40" cy="20" r="3" fill="rgba(255, 255, 255, 0.7)" />
            <circle cx="70" cy="10" r="3" fill="rgba(255, 255, 255, 0.7)" />
            <circle cx="100" cy="25" r="3" fill="rgba(255, 255, 255, 0.7)" />
            <circle cx="130" cy="15" r="3" fill="rgba(255, 255, 255, 0.7)" />
            <circle cx="160" cy="20" r="3" fill="rgba(255, 255, 255, 0.7)" />
            
            {/* HNSW connections */}
            <line x1="10" y1="10" x2="40" y2="20" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="0.5" />
            <line x1="40" y1="20" x2="70" y2="10" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="0.5" />
            <line x1="70" y1="10" x2="100" y2="25" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="0.5" />
            <line x1="100" y1="25" x2="130" y2="15" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="0.5" />
            <line x1="130" y1="15" x2="160" y2="20" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="0.5" />
            
            <line x1="10" y1="10" x2="70" y2="10" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="0.5" />
            <line x1="40" y1="20" x2="100" y2="25" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="0.5" />
            <line x1="70" y1="10" x2="130" y2="15" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="0.5" />
            
            <text x="85" y="35" textAnchor="middle" fontSize="8" fill="rgba(255, 255, 255, 0.6)">Hierarchical Graph Structure</text>
          </g>
          
          {/* Storage section */}
          <rect x="60" y="140" width="180" height="100" rx="3" fill="rgba(255, 165, 0, 0.2)" stroke="rgba(255, 165, 0, 0.6)" strokeWidth="1" />
          <text x="150" y="155" textAnchor="middle" fontSize="11" fontWeight="bold" fill="rgba(255, 255, 255, 0.9)">Vector Storage</text>
          
          {/* Vector records */}
          <g transform="translate(70, 165)">
            <rect x="0" y="0" width="160" height="20" rx="2" fill="rgba(26, 26, 46, 0.7)" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="0.5" />
            <text x="5" y="14" fontSize="8" fill="rgba(255, 255, 255, 0.8)">ID: 001</text>
            <text x="50" y="14" fontSize="8" fill="rgba(255, 255, 255, 0.8)">[0.2, 0.5, 0.1, ...]</text>
            <text x="140" y="14" fontSize="8" fill="rgba(255, 165, 0, 0.8)">Metadata</text>
            
            <rect x="0" y="25" width="160" height="20" rx="2" fill="rgba(26, 26, 46, 0.7)" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="0.5" />
            <text x="5" y="39" fontSize="8" fill="rgba(255, 255, 255, 0.8)">ID: 002</text>
            <text x="50" y="39" fontSize="8" fill="rgba(255, 255, 255, 0.8)">[0.8, 0.1, 0.7, ...]</text>
            <text x="140" y="39" fontSize="8" fill="rgba(255, 165, 0, 0.8)">Metadata</text>
            
            <rect x="0" y="50" width="160" height="20" rx="2" fill="rgba(26, 26, 46, 0.7)" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="0.5" />
            <text x="5" y="64" fontSize="8" fill="rgba(255, 255, 255, 0.8)">ID: 003</text>
            <text x="50" y="64" fontSize="8" fill="rgba(255, 255, 255, 0.8)">[0.4, 0.9, 0.3, ...]</text>
            <text x="140" y="64" fontSize="8" fill="rgba(255, 165, 0, 0.8)">Metadata</text>
          </g>
          
          {/* Query Process */}
          <g transform="translate(20, 260)">
            <rect x="0" y="0" width="260" height="30" rx="5" fill="rgba(255, 107, 107, 0.2)" stroke="rgba(255, 107, 107, 0.6)" strokeWidth="1" />
            
            <text x="10" y="20" fontSize="9" fill="rgba(255, 255, 255, 0.8)">Query: [0.3, 0.6, 0.2, ...]</text>
            <text x="130" y="20" fontSize="9" fill="rgba(255, 255, 255, 0.8)">→</text>
            <text x="145" y="20" fontSize="9" fill="rgba(255, 255, 255, 0.8)">HNSW Search</text>
            <text x="215" y="20" fontSize="9" fill="rgba(255, 255, 255, 0.8)">→</text>
            <text x="230" y="20" fontSize="9" fill="rgba(255, 255, 255, 0.8)">Results</text>
          </g>
          
          {/* Implementations callout */}
          <g transform="translate(150, 215)">
            <text x="0" y="0" textAnchor="middle" fontSize="8" fontWeight="bold" fill="rgba(255, 255, 255, 0.8)">Implementations:</text>
            <text x="0" y="12" textAnchor="middle" fontSize="7" fill="rgba(255, 255, 255, 0.7)">Pinecone, Milvus, Weaviate, FAISS, Chroma</text>
          </g>
        </svg>
        <div className="diagram-caption"><em>{caption}</em></div>
      </div>
      
      <style jsx="true">{`
        .vector-databases-diagram {
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

export default E3_VectorDatabases; 