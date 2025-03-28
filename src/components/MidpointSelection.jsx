import React from 'react';
import './ToolbarStyles.css';

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
    <div className="toolbar compact">
      <div className="toolbar-inner">
        <div className="selected-points">
          {selectedPoints.length === 0 ? (
            <span className="no-points">No points selected yet. Click on points in the visualization.</span>
          ) : (
            <div className="point-list">
              {selectedPoints.map((word, index) => (
                <div key={index} className="result-item">
                  <span className="result-word">{word}</span>
                </div>
              ))}
              
              {selectedPoints.length < 2 && (
                <span className="point-instruction">Click to select {selectedPoints.length === 0 ? 'first' : 'second'} point</span>
              )}
            </div>
          )}
        </div>
        
        <div className="selection-actions">
          {selectedPoints.length > 0 && (
            <button 
              className="search-btn"
              onClick={onReset}
              disabled={loading}
              style={{ background: 'rgba(255, 255, 255, 0.1)' }}
            >
              Reset
            </button>
          )}
          
          <button 
            className="search-btn"
            onClick={onCancel}
            disabled={loading}
            style={{ background: 'rgba(220, 0, 0, 0.1)', color: '#FF7272' }}
          >
            Cancel
          </button>
          
          <button 
            className="search-btn midpoint-btn"
            onClick={onFindMidpoint}
            disabled={selectedPoints.length !== 2 || loading}
          >
            {loading ? 'Finding...' : 'Find Midpoint'}
          </button>
        </div>
      </div>
      
      <style jsx="true">{`
        .toolbar.compact {
          background-color: rgba(15, 23, 42, 0.8);
        }
        
        .selected-points {
          flex: 1;
          display: flex;
          align-items: center;
        }
        
        .no-points {
          color: #888;
          font-size: 0.9rem;
        }
        
        .point-list {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .point-instruction {
          color: #aaa;
          font-size: 0.85rem;
          font-style: italic;
          margin-left: 0.5rem;
        }
        
        .selection-actions {
          display: flex;
          gap: 0.5rem;
          margin-left: auto;
        }
      `}</style>
    </div>
  );
};

export default MidpointSelection; 