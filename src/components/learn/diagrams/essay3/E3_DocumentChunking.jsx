import React from 'react';

const E3_DocumentChunking = ({ caption = 'Breaking documents into manageable pieces' }) => {
  return (
    <div className="document-chunking-diagram">
      <div className="diagram-box">
        <svg width="100%" height="100%" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
          {/* Title */}
          <text x="150" y="30" textAnchor="middle" fontSize="14" fontWeight="bold" fill="rgba(255, 255, 255, 0.9)">Document Chunking</text>
          
          {/* Original document */}
          <g transform="translate(50, 60)">
            <rect x="0" y="0" width="200" height="80" rx="3" fill="rgba(78, 205, 196, 0.2)" stroke="rgba(78, 205, 196, 0.6)" strokeWidth="1.5" />
            <text x="100" y="20" textAnchor="middle" fontSize="12" fontWeight="bold" fill="rgba(255, 255, 255, 0.9)">Large Document</text>
            
            {/* Document lines */}
            <g fill="rgba(255, 255, 255, 0.7)">
              <rect x="20" y="30" width="160" height="2" />
              <rect x="20" y="38" width="160" height="2" />
              <rect x="20" y="46" width="160" height="2" />
              <rect x="20" y="54" width="120" height="2" />
              <rect x="20" y="62" width="140" height="2" />
              <rect x="20" y="70" width="100" height="2" />
            </g>
          </g>
          
          {/* Chunking process arrow */}
          <g transform="translate(150, 150)">
            <path d="M0,-5 L0,15" stroke="rgba(255, 255, 255, 0.7)" strokeWidth="2" markerEnd="url(#chunkarrow)" />
            <text x="0" y="0" textAnchor="middle" fontSize="10" fill="rgba(255, 255, 255, 0.8)">chunk</text>
            
            <defs>
              <marker id="chunkarrow" markerWidth="10" markerHeight="7" 
                      refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="rgba(255, 255, 255, 0.7)"/>
              </marker>
            </defs>
          </g>
          
          {/* Chunks */}
          <g transform="translate(50, 170)">
            {/* Chunk 1 */}
            <rect x="0" y="0" width="60" height="45" rx="3" fill="rgba(255, 165, 0, 0.2)" stroke="rgba(255, 165, 0, 0.6)" strokeWidth="1" />
            <text x="30" y="15" textAnchor="middle" fontSize="9" fill="rgba(255, 255, 255, 0.8)">Chunk 1</text>
            <g fill="rgba(255, 255, 255, 0.5)" transform="translate(10, 0)">
              <rect x="0" y="20" width="40" height="1.5" />
              <rect x="0" y="26" width="40" height="1.5" />
              <rect x="0" y="32" width="40" height="1.5" />
              <rect x="0" y="38" width="25" height="1.5" />
            </g>
            
            {/* Chunk 2 */}
            <rect x="70" y="0" width="60" height="45" rx="3" fill="rgba(255, 165, 0, 0.2)" stroke="rgba(255, 165, 0, 0.6)" strokeWidth="1" />
            <text x="100" y="15" textAnchor="middle" fontSize="9" fill="rgba(255, 255, 255, 0.8)">Chunk 2</text>
            <g fill="rgba(255, 255, 255, 0.5)" transform="translate(80, 0)">
              <rect x="0" y="20" width="40" height="1.5" />
              <rect x="0" y="26" width="40" height="1.5" />
              <rect x="0" y="32" width="40" height="1.5" />
              <rect x="0" y="38" width="30" height="1.5" />
            </g>
            
            {/* Chunk 3 */}
            <rect x="140" y="0" width="60" height="45" rx="3" fill="rgba(255, 165, 0, 0.2)" stroke="rgba(255, 165, 0, 0.6)" strokeWidth="1" />
            <text x="170" y="15" textAnchor="middle" fontSize="9" fill="rgba(255, 255, 255, 0.8)">Chunk 3</text>
            <g fill="rgba(255, 255, 255, 0.5)" transform="translate(150, 0)">
              <rect x="0" y="20" width="40" height="1.5" />
              <rect x="0" y="26" width="40" height="1.5" />
              <rect x="0" y="32" width="25" height="1.5" />
              <rect x="0" y="38" width="35" height="1.5" />
            </g>
          </g>
          
          {/* Embedding process */}
          <g transform="translate(150, 230)">
            <path d="M0,-10 L0,10" stroke="rgba(255, 255, 255, 0.7)" strokeWidth="2" markerEnd="url(#chunkarrow)" />
            <text x="0" y="0" textAnchor="middle" fontSize="10" fill="rgba(255, 255, 255, 0.8)">embed</text>
          </g>
          
          {/* Vector outputs */}
          <g transform="translate(50, 245)">
            {/* Vector 1 */}
            <rect x="5" y="0" width="50" height="20" rx="3" fill="rgba(255, 107, 107, 0.2)" stroke="rgba(255, 107, 107, 0.6)" strokeWidth="1" />
            <text x="30" y="14" textAnchor="middle" fontSize="8" fill="rgba(255, 255, 255, 0.8)">[0.1, 0.5, ...]</text>
            
            {/* Vector 2 */}
            <rect x="75" y="0" width="50" height="20" rx="3" fill="rgba(255, 107, 107, 0.2)" stroke="rgba(255, 107, 107, 0.6)" strokeWidth="1" />
            <text x="100" y="14" textAnchor="middle" fontSize="8" fill="rgba(255, 255, 255, 0.8)">[0.7, 0.2, ...]</text>
            
            {/* Vector 3 */}
            <rect x="145" y="0" width="50" height="20" rx="3" fill="rgba(255, 107, 107, 0.2)" stroke="rgba(255, 107, 107, 0.6)" strokeWidth="1" />
            <text x="170" y="14" textAnchor="middle" fontSize="8" fill="rgba(255, 255, 255, 0.8)">[0.3, 0.8, ...]</text>
          </g>
          
          {/* Metadata section */}
          <g transform="translate(50, 275)">
            <text x="0" y="0" fontSize="9" fill="rgba(255, 255, 255, 0.7)">Metadata:</text>
            <text x="60" y="0" fontSize="8" fill="rgba(255, 255, 255, 0.6)">• Source document</text>
            <text x="150" y="0" fontSize="8" fill="rgba(255, 255, 255, 0.6)">• Position</text>
            <text x="205" y="0" fontSize="8" fill="rgba(255, 255, 255, 0.6)">• Timestamp</text>
          </g>
        </svg>
        <div className="diagram-caption"><em>{caption}</em></div>
      </div>
      
      <style jsx="true">{`
        .document-chunking-diagram {
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

export default E3_DocumentChunking; 