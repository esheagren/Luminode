import React from 'react';

const EssayNavigation = ({ essays, selectedEssay, onSelectEssay }) => {
  return (
    <div className="essay-nav-container">
      {essays.map((essay) => (
        <div 
          key={essay}
          className={`essay-nav-item ${selectedEssay === essay ? 'selected' : ''}`}
          onClick={() => onSelectEssay(essay)}
        >
          {essay}
        </div>
      ))}
      
      <style jsx="true">{`
        .essay-nav-container {
          display: flex;
          flex-direction: row;
          height: 100%;
          align-items: center;
        }
        
        .essay-nav-item {
          padding: 0.75rem 1.2rem;
          margin-right: 0.5rem;
          cursor: pointer;
          transition: all 0.2s ease;
          color: rgba(255, 255, 255, 0.7);
          border-radius: 4px;
          white-space: nowrap;
        }
        
        .essay-nav-item:hover {
          background-color: rgba(255, 255, 255, 0.05);
          color: rgba(255, 255, 255, 1);
        }
        
        .essay-nav-item.selected {
          background-color: rgba(255, 165, 0, 0.15);
          color: #FFA500;
          font-weight: 500;
          border-bottom: 3px solid #FFA500;
        }
      `}</style>
    </div>
  );
};

export default EssayNavigation; 