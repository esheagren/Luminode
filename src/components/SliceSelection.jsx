import React from 'react';
import './ToolbarStyles.css';

/**
 * Component displayed during slice selection mode
 */
const SliceSelection = ({ 
  selectedPoints, 
  onReset, 
  onCancel, 
  onCalculate, 
  loading
}) => {
  return (
    <div className="slice-selection">
      <div className="info-text">
        <p>
          {selectedPoints.length === 0 && (
            "Select two points to create a semantic slice between them."
          )}
          {selectedPoints.length === 1 && (
            "Now select the end point to complete the slice."
          )}
          {selectedPoints.length === 2 && (
            `Ready to calculate slice from "${selectedPoints[0]}" to "${selectedPoints[1]}".`
          )}
        </p>
      </div>
      
      <div className="selection-info">
        {selectedPoints.length > 0 && (
          <div className="selected-points">
            <div className="point-tag">
              <span className="point-label">Start:</span>
              <span className="point-value">{selectedPoints[0] || "None"}</span>
            </div>
            
            {selectedPoints.length > 1 && (
              <div className="point-tag">
                <span className="point-label">End:</span>
                <span className="point-value">{selectedPoints[1]}</span>
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="selection-controls">
        {selectedPoints.length > 0 && (
          <button 
            className="control-button reset"
            onClick={onReset}
            disabled={loading}
          >
            Reset
          </button>
        )}
        
        <button 
          className="control-button cancel"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </button>
        
        {selectedPoints.length === 2 && (
          <button 
            className="control-button calculate"
            onClick={onCalculate}
            disabled={loading}
          >
            {loading ? 'Calculating...' : 'Calculate Slice'}
          </button>
        )}
      </div>
      
      <style jsx="true">{`
        .slice-selection {
          padding: 0.75rem;
          color: #eee;
        }
        
        .info-text {
          margin-bottom: 0.75rem;
          font-size: 0.9rem;
          color: #bbb;
        }
        
        .selection-info {
          margin-bottom: 0.75rem;
        }
        
        .selected-points {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 0.75rem;
        }
        
        .point-tag {
          background: rgba(142, 68, 173, 0.2);
          border-radius: 4px;
          padding: 0.3rem 0.5rem;
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          gap: 0.3rem;
        }
        
        .point-label {
          color: #a982c4;
          font-weight: 500;
        }
        
        .point-value {
          color: white;
        }
        
        .selection-controls {
          display: flex;
          justify-content: flex-end;
          gap: 0.5rem;
        }
        
        .control-button {
          background: #222;
          color: #ddd;
          border: none;
          border-radius: 4px;
          padding: 0.4rem 0.75rem;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .control-button:hover {
          background: #333;
        }
        
        .control-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .control-button.reset {
          background: transparent;
        }
        
        .control-button.reset:hover {
          background: rgba(255, 255, 255, 0.1);
        }
        
        .control-button.cancel {
          background: transparent;
        }
        
        .control-button.cancel:hover {
          background: rgba(255, 255, 255, 0.1);
        }
        
        .control-button.calculate {
          background: #8E44AD;
          color: white;
        }
        
        .control-button.calculate:hover {
          background: #9B59B6;
        }
      `}</style>
    </div>
  );
};

export default SliceSelection; 