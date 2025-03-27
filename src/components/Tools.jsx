import React, { useState } from 'react';
import MidpointToolbar from './MidpointToolbar';
import AnalogyToolbar from './AnalogyToolbar';
import ViewButton from './ViewButton';

// Wrapper function for better debugging of setMidpointClusters
const createDebugSetMidpointClusters = (setMidpointClusters) => {
  return (clusters) => {
    console.log('Setting midpoint clusters:', clusters);
    return setMidpointClusters(clusters);
  };
};

const Tools = ({
  words,
  numMidpoints,
  setMidpointClusters,
  setLoading,
  setError,
  loading,
  wordsValid,
  viewMode,
  setViewMode,
  rulerActive,
  setRulerActive
}) => {
  const [activeTab, setActiveTab] = useState('midpoint');
  
  // Debug: Check the type of setMidpointClusters
  console.log('Tools component:', {
    hasSetMidpointClusters: !!setMidpointClusters,
    typeSetMidpointClusters: typeof setMidpointClusters
  });
  
  // Create debug wrapper for setMidpointClusters
  const debugSetMidpointClusters = createDebugSetMidpointClusters(setMidpointClusters);

  const renderToolContent = () => {
    switch (activeTab) {
      case 'midpoint':
        return (
          <MidpointToolbar
            words={words}
            numMidpoints={numMidpoints}
            setMidpointClusters={debugSetMidpointClusters}
            setLoading={setLoading}
            setError={setError}
            loading={loading}
            wordsValid={wordsValid}
          />
        );
      case 'analogy':
        return (
          <AnalogyToolbar
            words={words}
            setLoading={setLoading}
            setError={setError}
            loading={loading}
            wordsValid={wordsValid}
            setMidpointClusters={debugSetMidpointClusters}
          />
        );
      default:
        return <div>Select a tool</div>;
    }
  };

  const tabButtonClass = (tab) => {
    return `tab-button ${activeTab === tab ? 'active' : ''}`;
  };

  return (
    <div className="tools-container">
      <div className="tabs">
        <button
          className={tabButtonClass('midpoint')}
          onClick={() => setActiveTab('midpoint')}
          disabled={loading}
        >
          Midpoint
        </button>
        <button
          className={tabButtonClass('analogy')}
          onClick={() => setActiveTab('analogy')}
          disabled={loading}
        >
          Analogy
        </button>
      </div>
      
      <div className="tool-content">
        {renderToolContent()}
      </div>
      
      <div className="view-controls">
        <ViewButton 
          viewMode={viewMode} 
          setViewMode={setViewMode} 
        />
        
        <div className="ruler-toggle">
          <label className="ruler-label">
            <input
              type="checkbox"
              checked={rulerActive}
              onChange={() => setRulerActive(!rulerActive)}
              className="ruler-checkbox"
            />
            <span className="ruler-text">Ruler</span>
          </label>
        </div>
      </div>
      
      <style jsx="true">{`
        .tools-container {
          display: flex;
          flex-direction: column;
          background-color: #0f0f10;
          border-radius: 8px;
          padding: 0.25rem;
          margin-bottom: 0.5rem;
        }
        
        .tabs {
          display: flex;
          margin-bottom: 0.25rem;
        }
        
        .tab-button {
          flex: 1;
          background-color: transparent;
          color: #94a3b8;
          border: none;
          border-bottom: 2px solid transparent;
          padding: 0.3rem 0.5rem;
          cursor: pointer;
          font-size: 0.85rem;
          transition: all 0.2s ease;
        }
        
        .tab-button:hover:not(:disabled) {
          color: #e2e8f0;
        }
        
        .tab-button.active {
          color: #FFC837;
          border-bottom: 2px solid #FFC837;
        }
        
        .tab-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .tool-content {
          padding: 0.25rem 0;
        }
        
        .view-controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 0.25rem;
          padding-top: 0.25rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .ruler-toggle {
          display: flex;
          align-items: center;
        }
        
        .ruler-label {
          display: flex;
          align-items: center;
          cursor: pointer;
        }
        
        .ruler-checkbox {
          margin-right: 0.25rem;
          cursor: pointer;
        }
        
        .ruler-text {
          font-size: 0.75rem;
          color: #94a3b8;
        }
      `}</style>
    </div>
  );
};

export default Tools;