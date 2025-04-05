import React, { useState, useEffect } from 'react';

// Import diagram components
import VectorExplanationDiagram from './diagrams/VectorExplanationDiagram';
import DefaultDiagram from './diagrams/DefaultDiagram';

const DiagramComponent = ({ essayTitle, scrollPosition }) => {
  const [activeDiagram, setActiveDiagram] = useState('default');
  
  // Update diagram based on essay title and scroll position
  useEffect(() => {
    if (essayTitle === 'Introduction') {
      // Change diagrams based on scroll position for the Introduction essay
      if (scrollPosition < 500) {
        setActiveDiagram('vectorExplanation');
      } else if (scrollPosition < 1000) {
        setActiveDiagram('vectorComparison');
      } else {
        setActiveDiagram('transformerModel');
      }
    } else if (essayTitle === 'Essay1') {
      // Different set of diagrams for Essay1
      if (scrollPosition < 800) {
        setActiveDiagram('essay1Diagram1');
      } else {
        setActiveDiagram('essay1Diagram2');
      }
    } else {
      // Default diagram if essay not recognized
      setActiveDiagram('default');
    }
  }, [essayTitle, scrollPosition]);
  
  // Render the appropriate diagram based on active state
  const renderDiagram = () => {
    switch (activeDiagram) {
      case 'vectorExplanation':
        return <VectorExplanationDiagram />;
      case 'vectorComparison':
        return <DefaultDiagram title="Vector Comparison" />;
      case 'transformerModel':
        return <DefaultDiagram title="Transformer Model" />;
      case 'essay1Diagram1':
        return <DefaultDiagram title="Essay 1 - Diagram 1" />;
      case 'essay1Diagram2':
        return <DefaultDiagram title="Essay 1 - Diagram 2" />;
      default:
        return <DefaultDiagram title="Diagram Component" />;
    }
  };
  
  return (
    <div className="diagram-component">
      <div className="diagram-title">
        Diagram Component
      </div>
      <div className="diagram-content">
        {renderDiagram()}
      </div>
      
      <style jsx="true">{`
        .diagram-component {
          display: flex;
          flex-direction: column;
          height: 100%;
        }
        
        .diagram-title {
          font-size: 1.2rem;
          font-weight: 500;
          padding: 1rem;
          border-bottom: 1px solid #e0e0e0;
        }
        
        .diagram-content {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default DiagramComponent; 