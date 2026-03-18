import React from 'react';
import './ToolbarStyles.css';

/**
 * Component displayed during axis projection selection mode.
 * Two-phase selection: first pick 2 axis words, then pick N words to project.
 */
const ProjectionSelection = ({
  selectedPoints,
  onReset,
  onCancel,
  onCalculate,
  loading
}) => {
  const axisComplete = selectedPoints.length >= 2;
  const projectionWords = selectedPoints.slice(2);
  const canCalculate = axisComplete && projectionWords.length > 0;

  return (
    <div className="projection-selection">
      <div className="info-text">
        <p>
          {selectedPoints.length === 0 && (
            "Define a semantic axis: select the first word (the \"from\" direction)."
          )}
          {selectedPoints.length === 1 && (
            "Now select the second axis word (the \"to\" direction)."
          )}
          {axisComplete && projectionWords.length === 0 && (
            `Axis: "${selectedPoints[0]}" → "${selectedPoints[1]}". Now select words to project onto this axis.`
          )}
          {axisComplete && projectionWords.length > 0 && (
            `Axis: "${selectedPoints[0]}" → "${selectedPoints[1]}". ${projectionWords.length} word${projectionWords.length > 1 ? 's' : ''} selected. Add more or click Calculate.`
          )}
        </p>
      </div>

      <div className="selection-info">
        {selectedPoints.length > 0 && (
          <div className="selected-points">
            <div className="point-tag projection-axis">
              <span className="point-label">From:</span>
              <span className="point-value">{selectedPoints[0] || "None"}</span>
            </div>

            {selectedPoints.length > 1 && (
              <div className="point-tag projection-axis">
                <span className="point-label">To:</span>
                <span className="point-value">{selectedPoints[1]}</span>
              </div>
            )}

            {projectionWords.map((word, i) => (
              <div key={i} className="point-tag projection-word">
                <span className="point-value">{word}</span>
              </div>
            ))}
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

        {canCalculate && (
          <button
            className="control-button calculate projection"
            onClick={onCalculate}
            disabled={loading}
          >
            {loading ? 'Calculating...' : 'Calculate Projection'}
          </button>
        )}
      </div>

      <style jsx="true">{`
        .projection-selection {
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
          border-radius: 4px;
          padding: 0.3rem 0.5rem;
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          gap: 0.3rem;
        }

        .point-tag.projection-axis {
          background: rgba(255, 152, 0, 0.2);
        }

        .point-tag.projection-word {
          background: rgba(156, 39, 176, 0.2);
        }

        .point-label {
          color: #FFB74D;
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

        .control-button.reset,
        .control-button.cancel {
          background: transparent;
        }

        .control-button.reset:hover,
        .control-button.cancel:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .control-button.calculate.projection {
          background: #FF9800;
          color: white;
        }

        .control-button.calculate.projection:hover {
          background: #FFB74D;
        }

        @media (max-width: 480px) {
          .projection-selection {
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

export default ProjectionSelection;
