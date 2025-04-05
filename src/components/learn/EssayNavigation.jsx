import React from 'react';

const EssayNavigation = ({ essays, selectedEssay, onSelectEssay }) => {
  return (
    <div className="essay-nav-container">
      <div className="essay-nav-header">
        <h3>Overview</h3>
      </div>
      <div className="essay-nav-list">
        {essays.map((essay) => (
          <div 
            key={essay}
            className={`essay-nav-item ${selectedEssay === essay ? 'selected' : ''}`}
            onClick={() => onSelectEssay(essay)}
          >
            {essay}
          </div>
        ))}
      </div>
      
      <style jsx="true">{`
        .essay-nav-container {
          display: flex;
          flex-direction: column;
          height: 100%;
        }
        
        .essay-nav-header {
          padding: 1rem;
          border-bottom: 1px solid #e0e0e0;
        }
        
        .essay-nav-header h3 {
          margin: 0;
          font-size: 1.2rem;
          font-weight: 500;
        }
        
        .essay-nav-list {
          flex: 1;
          overflow-y: auto;
        }
        
        .essay-nav-item {
          padding: 0.75rem 1rem;
          cursor: pointer;
          transition: background-color 0.2s ease;
          border-bottom: 1px solid #f0f0f0;
        }
        
        .essay-nav-item:hover {
          background-color: #f5f5f5;
        }
        
        .essay-nav-item.selected {
          background-color: #e3f2fd;
          font-weight: 500;
          border-left: 3px solid #2196f3;
        }
      `}</style>
    </div>
  );
};

export default EssayNavigation; 