import React from 'react';
import './ToolbarStyles.css';

/**
 * Component displayed during linear path selection mode
 */
const LinearPathSelection = ({
  selectedPoints,
  onReset,
  onCancel,
  onCalculate,
  loading
}) => {
  return (
    <div className="linear-path-selection">
      <div className="info-text">
        <p>
          {selectedPoints.length === 0 && (
            "Select two points to find evenly-spaced words along the geometric line between them."
          )}
          {selectedPoints.length === 1 && (
            "Now select the end point to complete the linear path."
          )}
          {selectedPoints.length === 2 && (
            `Ready to calculate linear path from "${selectedPoints[0]}" to "${selectedPoints[1]}".`
          )}
        </p>
      </div>

      <div className="selection-info">
        {selectedPoints.length > 0 && (
          <div className="selected-points">
            <div className="point-tag linear-path">
              <span className="point-label">Start:</span>
              <span className="point-value">{selectedPoints[0] || "None"}</span>
            </div>

            {selectedPoints.length > 1 && (
              <div className="point-tag linear-path">
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
            className="control-button calculate linear-path"
            onClick={onCalculate}
            disabled={loading}
          >
            {loading ? 'Calculating...' : 'Calculate Linear Path'}
          </button>
        )}
      </div>

      <style jsx="true">{`
        .linear-path-selection {
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
          background: rgba(33, 150, 243, 0.2);
          border-radius: 4px;
          padding: 0.3rem 0.5rem;
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          gap: 0.3rem;
        }

        .point-tag.linear-path {
          background: rgba(33, 150, 243, 0.2);
        }

        .point-label {
          color: #64B5F6;
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

        .control-button.calculate.linear-path {
          background: #2196F3;
          color: white;
        }

        .control-button.calculate.linear-path:hover {
          background: #42A5F5;
        }

        /* Mobile responsive */
        @media (max-width: 480px) {
          .linear-path-selection {
            padding: 0.5rem;
          }

          .info-text {
            font-size: 0.85rem;
            text-align: center;
          }

          .selected-points {
            justify-content: center;
          }

          .point-tag {
            padding: 0.35rem 0.6rem;
            font-size: 0.8rem;
          }

          .selection-controls {
            flex-wrap: wrap;
            justify-content: center;
            gap: 0.5rem;
          }

          .control-button {
            min-height: 44px;
            padding: 0.5rem 1rem;
            font-size: 0.9rem;
            flex: 1;
            min-width: 80px;
          }

          .control-button.calculate {
            flex: 2;
          }
        }
      `}</style>
    </div>
  );
};

export default LinearPathSelection;
