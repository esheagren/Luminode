import React from 'react';

const DefaultDiagram = ({ title = 'Diagram' }) => {
  return (
    <div className="default-diagram">
      <div className="diagram-box">
        <div className="diagram-title">{title}</div>
        <div className="diagram-placeholder">
          <svg width="100%" height="100%" viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg">
            <rect x="10" y="10" width="180" height="130" rx="5" fill="#f0f0f0" stroke="#ccc" strokeWidth="1" />
            <line x1="10" y1="10" x2="190" y2="140" stroke="#ddd" strokeWidth="1" />
            <line x1="10" y1="140" x2="190" y2="10" stroke="#ddd" strokeWidth="1" />
            <circle cx="100" cy="75" r="30" fill="#e3f2fd" stroke="#90caf9" strokeWidth="1" />
            <text x="100" y="80" textAnchor="middle" fontSize="12" fill="#333">Diagram</text>
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
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          background-color: #fff;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
        
        .diagram-title {
          padding: 0.5rem;
          background-color: #f5f5f5;
          border-bottom: 1px solid #e0e0e0;
          font-size: 0.9rem;
          font-weight: 500;
          text-align: center;
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