import React from 'react';
import './ToolbarStyles.css';

/**
 * Component displayed during midpoint selection mode
 */
const MidpointSelection = ({ 
  selectedPoints = [], 
  onReset, 
  onCancel,
  onCalculate,
  loading = false 
}) => {
  return (
    <div className="toolbar compact">
      <div className="toolbar-inner">
        <div className="selected-points">
          {selectedPoints.length === 0 ? (
            <span className="no-points">Click on a point in the visualization to select it.</span>
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
              
              {selectedPoints.length === 2 && loading && (
                <span className="point-instruction">Finding midpoint...</span>
              )}
              
              {selectedPoints.length === 2 && !loading && onCalculate && (
                <button 
                  className="search-btn calculate-btn"
                  onClick={onCalculate}
                  style={{ background: 'rgba(6, 182, 72, 0.2)', color: '#4ada7c', marginLeft: '10px' }}
                >
                  Calculate Midpoint
                </button>
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
        
        .calculate-btn {
          font-weight: bold;
        }
      `}</style>
    </div>
  );
};

export default MidpointSelection; 