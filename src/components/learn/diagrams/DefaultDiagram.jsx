import React from 'react';

const DefaultDiagram = ({ title = 'Diagram' }) => {
  return (
    <div className="default-diagram">
      <div className="diagram-box">
        <div className="diagram-title">{title}</div>
        <div className="diagram-placeholder">
          <svg width="100%" height="100%" viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg">
            <rect x="10" y="10" width="180" height="130" rx="5" fill="rgba(255, 165, 0, 0.1)" stroke="rgba(255, 165, 0, 0.3)" strokeWidth="1" />
            <line x1="10" y1="10" x2="190" y2="140" stroke="rgba(255, 165, 0, 0.2)" strokeWidth="1" />
            <line x1="10" y1="140" x2="190" y2="10" stroke="rgba(255, 165, 0, 0.2)" strokeWidth="1" />
            <circle cx="100" cy="75" r="30" fill="rgba(255, 165, 0, 0.15)" stroke="rgba(255, 165, 0, 0.4)" strokeWidth="1" />
            <text x="100" y="80" textAnchor="middle" fontSize="12" fill="rgba(255, 255, 255, 0.8)">Diagram</text>
          </svg>
        </div>
      </div>
      
      <style jsx="true">{`
        .default-diagram {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .diagram-box {
          width: 100%;
          height: 100%;
          max-width: 280px;
          max-height: 210px;
          border: 1px solid rgba(255, 165, 0, 0.3);
          border-radius: 8px;
          background-color: rgba(26, 26, 46, 0.7);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2), 0 0 20px rgba(255, 165, 0, 0.1);
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
        
        .diagram-title {
          padding: 0.5rem;
          background-color: rgba(26, 26, 46, 0.9);
          border-bottom: 1px solid rgba(255, 165, 0, 0.2);
          font-size: 0.9rem;
          font-weight: 500;
          text-align: center;
          color: rgba(255, 255, 255, 0.8);
        }
        
        .diagram-placeholder {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
        }
      `}</style>
    </div>
  );
};

export default DefaultDiagram; 