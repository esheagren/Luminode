import React from 'react';

/**
 * Component displayed during midpoint selection mode
 */
const MidpointSelection = ({ 
  selectedPoints = [], 
  onReset, 
  onFindMidpoint, 
  onCancel,
  loading = false 
}) => {
  return (
    <div className="midpoint-selection">
      <div className="selection-header">
        <h3>Point Selection Mode</h3>
        <p>Click on two points in the visualization to find their midpoint</p>
      </div>
      
      <div className="selected-words">
        {selectedPoints.length > 0 ? (
          <div className="word-list">
            {selectedPoints.map((word, index) => (
              <div key={index} className="selected-word">
                <span className="word-number">{index + 1}</span>
                <span className="word-text">{word}</span>
              </div>
            ))}
            
            {selectedPoints.length < 2 && (
              <div className="selected-word empty">
                <span className="word-number">{selectedPoints.length + 1}</span>
                <span className="word-text empty">Click a point...</span>
              </div>
            )}
          </div>
        ) : (
          <div className="no-selection">
            No points selected yet. Click on points in the visualization.
          </div>
        )}
      </div>
      
      <div className="selection-actions">
        <button 
          className="action-btn reset"
          onClick={onReset}
          disabled={selectedPoints.length === 0 || loading}
        >
          Reset
        </button>
        
        <button 
          className="action-btn cancel"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </button>
        
        <button 
          className="action-btn find"
          onClick={onFindMidpoint}
          disabled={selectedPoints.length !== 2 || loading}
        >
          {loading ? 'Finding...' : 'Find Midpoint'}
        </button>
      </div>
      
      <style jsx="true">{`
        .midpoint-selection {
          padding: 0.75rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        
        .selection-header {
          text-align: center;
        }
        
        .selection-header h3 {
          margin: 0;
          font-size: 1rem;
          color: #4285F4;
        }
        
        .selection-header p {
          margin: 0.25rem 0 0;
          font-size: 0.8rem;
          color: #aaa;
        }
        
        .selected-words {
          background: rgba(25, 25, 28, 0.5);
          border-radius: 4px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 0.75rem;
          min-height: 60px;
        }
        
        .word-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        
        .selected-word {
          display: flex;
          align-items: center;
          background: rgba(66, 133, 244, 0.15);
          border-radius: 4px;
          overflow: hidden;
        }
        
        .selected-word.empty {
          background: rgba(255, 255, 255, 0.05);
        }
        
        .word-number {
          background: rgba(66, 133, 244, 0.5);
          color: white;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 0.8rem;
          position: relative;
        }
        
        .selected-word.empty .word-number {
          background: rgba(255, 255, 255, 0.2);
        }
        
        .word-text {
          padding: 0.4rem 0.75rem;
          color: #e0e0e0;
          font-size: 0.9rem;
        }
        
        .word-text.empty {
          color: #888;
          font-style: italic;
        }
        
        .no-selection {
          color: #888;
          font-size: 0.9rem;
          text-align: center;
          padding: 0.5rem;
        }
        
        .selection-actions {
          display: flex;
          gap: 0.5rem;
          margin-top: 0.5rem;
        }
        
        .action-btn {
          padding: 0.5rem 0.75rem;
          border-radius: 4px;
          border: none;
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .action-btn:hover:not(:disabled) {
          transform: translateY(-1px);
        }
        
        .action-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .action-btn.reset {
          background: rgba(255, 255, 255, 0.1);
          color: #e0e0e0;
        }
        
        .action-btn.cancel {
          background: rgba(220, 0, 0, 0.1);
          color: #FF7272;
        }
        
        .action-btn.find {
          background: linear-gradient(135deg, #4285F4 0%, #34A853 100%);
          color: white;
          flex: 1;
        }
        
        .action-btn.find:hover:not(:disabled) {
          box-shadow: 0 2px 4px rgba(52, 168, 83, 0.3);
        }
      `}</style>
    </div>
  );
};

export default MidpointSelection; 