import React from 'react';

const EssayNavigation = ({ essays, selectedEssay, onSelectEssay }) => {
  return (
    <div className="essay-nav-container">
      <div className="essay-nav-header">
        <h3>Learn</h3>
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
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .essay-nav-header h3 {
          margin: 0;
          font-size: 1.2rem;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.9);
        }
        
        .essay-nav-list {
          flex: 1;
          overflow-y: auto;
        }
        
        .essay-nav-item {
          padding: 0.75rem 1rem;
          cursor: pointer;
          transition: all 0.2s ease;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          color: rgba(255, 255, 255, 0.7);
        }
        
        .essay-nav-item:hover {
          background-color: rgba(255, 255, 255, 0.05);
          color: rgba(255, 255, 255, 1);
        }
        
        .essay-nav-item.selected {
          background-color: rgba(255, 165, 0, 0.15);
          color: #FFA500;
          font-weight: 500;
          border-left: 3px solid #FFA500;
        }
      `}</style>
    </div>
  );
};

export default EssayNavigation; 