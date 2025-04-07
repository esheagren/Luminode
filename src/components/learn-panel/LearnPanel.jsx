import React from 'react';
import VectorEmbeddingContent from './content/VectorEmbeddingContent';
import PcaContent from './content/PcaContent';
import DistanceContent from './content/DistanceContent';
import AnalogyContent from './content/AnalogyContent';
import SliceContent from './content/SliceContent';

const LearnPanel = ({ activeTool, onClose }) => {
  // Determine which content to show based on the active tool
  const renderContent = () => {
    switch (activeTool) {
      case '3D':
        return <PcaContent />;
      case 'Measure':
        return <DistanceContent />;
      case 'Analogy':
        return <AnalogyContent />;
      case 'Slice':
        return <SliceContent />;
      default:
        return <VectorEmbeddingContent />;
    }
  };

  return (
    <div className="learn-panel">
      <div className="learn-panel-header">
        <h2>Understanding {activeTool || 'Vector Embeddings'}</h2>
        {onClose && (
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        )}
      </div>
      <div className="learn-panel-content">
        {renderContent()}
      </div>
      <style jsx="true">{`
        .learn-panel {
          height: 100%;
          background-color: #0f0f10;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.05);
          padding: 1.5rem;
          color: #f8fafc;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.2);
        }
        
        .learn-panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          border-bottom: 1px solid rgba(255, 157, 66, 0.3);
          padding-bottom: 0.75rem;
        }
        
        .learn-panel h2 {
          margin: 0;
          font-size: 1.5rem;
          font-weight: 600;
          color: #FF9D42;
          letter-spacing: 0.5px;
        }
        
        .close-button {
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.6);
          font-size: 1.5rem;
          line-height: 1;
          cursor: pointer;
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          transition: all 0.2s ease;
        }
        
        .close-button:hover {
          color: #FF9D42;
          background: rgba(255, 157, 66, 0.1);
        }
        
        .learn-panel-content {
          flex: 1;
          overflow-y: auto;
          scrollbar-width: none; /* Firefox */
          font-size: 1rem;
          line-height: 1.7;
          padding-right: 0.5rem; /* Add padding to compensate for the hidden scrollbar */
          color: rgba(248, 250, 252, 0.92);
          letter-spacing: 0.2px;
        }
        
        .learn-panel-content::-webkit-scrollbar {
          display: none; /* Chrome, Safari and Opera */
        }
        
        .learn-panel-content p {
          margin: 1.4rem 0;
          text-align: justify;
        }
        
        .learn-panel-content p:first-child {
          margin-top: 0;
        }
        
        .learn-panel-content p strong {
          color: #FF9D42;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
};

export default LearnPanel; 