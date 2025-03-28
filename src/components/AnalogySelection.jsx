import React from 'react';
import './ToolbarStyles.css';

const AnalogySelection = ({ 
  selectedPoints,
  onReset,
  onCancel,
  loading,
  analogyStep
}) => {
  // Calculate elapsed time for loading indication
  const [elapsed, setElapsed] = React.useState(0);
  
  // Start timer when loading begins
  React.useEffect(() => {
    let timer;
    if (loading && analogyStep === 3) {
      const startTime = Date.now();
      timer = setInterval(() => {
        setElapsed(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    } else {
      setElapsed(0);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [loading, analogyStep]);
  
  // Determine the message based on the current step and selection status
  const getMessage = () => {
    if (loading) {
      if (analogyStep === 3) {
        const loadingMsg = `Searching for words that relate to ${selectedPoints[2]} as ${selectedPoints[1]} relates to ${selectedPoints[0]}...`;
        
        // Add elapsed time if it's taking a while
        if (elapsed > 3) {
          return `${loadingMsg} (${elapsed}s)`;
        }
        return loadingMsg;
      }
      return "Finding analogous words...";
    }
    
    switch (analogyStep) {
      case 0:
        return "Click on the first word to begin analogy";
      case 1:
        return `${selectedPoints[0]} → Click on the second word for comparison`;
      case 2:
        return `${selectedPoints[0]}:${selectedPoints[1]} → Click on the third word to find analogy`;
      case 3:
        return `Searching for words that relate to ${selectedPoints[2]} as ${selectedPoints[1]} relates to ${selectedPoints[0]}...`;
      case 4:
        return `Analogy complete: ${selectedPoints[0]}:${selectedPoints[1]}::${selectedPoints[2]}:?`;
      default:
        return "Select words for analogy";
    }
  };
  
  return (
    <div className="toolbar compact">
      <div className="analogy-selection-status">
        <div className={`analogy-status-text ${loading ? 'analogy-searching' : ''}`}>
          {getMessage()}
        </div>
        
        {selectedPoints.length > 0 && !loading && (
          <div className="analogy-controls">
            <button
              className="reset-btn"
              onClick={onReset}
              disabled={loading}
            >
              Reset
            </button>
            <button
              className="cancel-btn"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        )}
      </div>
      
      {analogyStep === 4 && (
        <div className="analogy-explanation">
          <div className="analogy-explanation-text">
            The connected lines show words that have a similar relationship to each other.
            Hover over points to see more details.
          </div>
        </div>
      )}
      
      {loading && analogyStep === 3 && elapsed > 10 && (
        <div className="analogy-explanation">
          <div className="analogy-explanation-text">
            This is taking longer than usual. The backend service might be experiencing high load.
            You can wait or try again later.
          </div>
        </div>
      )}
      
      <style jsx="true">{`
        .analogy-selection-status {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          padding: 0.5rem;
        }
        
        .analogy-status-text {
          color: #FF8008;
          font-weight: 500;
          font-size: 0.95rem;
          animation: ${loading ? 'pulse 1.5s infinite' : 'none'};
        }
        
        .analogy-controls {
          display: flex;
          gap: 0.5rem;
        }
        
        .reset-btn, .cancel-btn {
          padding: 0.3rem 0.5rem;
          border: none;
          border-radius: 4px;
          font-size: 0.8rem;
          cursor: pointer;
        }
        
        .reset-btn {
          background: rgba(255, 193, 7, 0.2);
          color: #ffc107;
        }
        
        .cancel-btn {
          background: rgba(244, 67, 54, 0.2);
          color: #f44336;
        }
        
        .analogy-explanation {
          padding: 0.5rem;
          margin-top: 0.25rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .analogy-explanation-text {
          font-size: 0.8rem;
          color: #aaa;
          font-style: italic;
        }
        
        @keyframes pulse {
          0% { opacity: 0.7; }
          50% { opacity: 1; }
          100% { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
};

export default AnalogySelection; 