import React, { useState, useEffect } from 'react';

// Essay 1 diagrams
import E1_DictionaryVsAssociation from './diagrams/essay1/E1_DictionaryVsAssociation';
import E1_Introduction from './diagrams/essay1/E1_SemanticSpace';
import E1_VectorDimensions from './diagrams/essay1/E1_VectorDimensions';
import E1_VectorsMeaning from './diagrams/essay1/E1_VectorsMeaning';
import E1_Algorithms from './diagrams/essay1/E1_Algorithms';
import E1_Applications from './diagrams/essay1/E1_Applications';
import E1_Summary from './diagrams/essay1/E1_Summary';

// Essay 2 diagrams
import E2_DimensionalityReduction from './diagrams/essay2/E2_DimensionalityReduction';
import E2_NearestNeighbor from './diagrams/essay2/E2_NearestNeighbor';
import E2_DistanceMetrics from './diagrams/essay2/E2_DistanceMetrics';
import E2_VectorAnalogies from './diagrams/essay2/E2_VectorAnalogies';
import E2_CrossSections from './diagrams/essay2/E2_CrossSections';

// Essay 3 diagrams
import E3_VectorDatabases from './diagrams/essay3/E3_VectorDatabases';
import E3_DocumentChunking from './diagrams/essay3/E3_DocumentChunking';
import E3_RAG from './diagrams/essay3/E3_RAG';
import E3_VectorEcosystem from './diagrams/essay3/E3_VectorEcosystem';

// Diagram section colors - should match the ones in EssayContent.jsx
const diagramColors = {
  dictionaryVsAssociation: 'rgba(153, 102, 255, 0.1)', // Purple
  vectorIntroduction: 'rgba(83, 123, 196, 0.1)', // Blue
  vectorDimensions: 'rgba(124, 179, 66, 0.15)', // Light green
  vectorMeaning: 'rgba(76, 125, 196, 0.15)', // Light blue
  embeddingAlgorithms: 'rgba(255, 142, 83, 0.1)', // Orange
  embeddingApplications: 'rgba(76, 205, 196, 0.1)', // Teal
  embeddingSummary: 'rgba(255, 165, 0, 0.1)', // Gold
};

// Inline DefaultDiagram component to avoid external dependencies
const DefaultDiagram = ({ title = 'Vector Embeddings', caption = 'Select an essay to view diagrams' }) => {
  return (
    <div className="default-diagram">
      <div className="diagram-content">
        <div className="diagram-title">{title}</div>
        <div className="diagram-caption">{caption}</div>
      </div>
      
      <style jsx="true">{`
        .default-diagram {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: rgba(26, 26, 46, 0.7);
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          padding: 20px;
        }
        
        .diagram-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
        }
        
        .diagram-title {
          font-size: 1.5rem;
          font-weight: bold;
          color: white;
          margin-bottom: 10px;
        }
        
        .diagram-caption {
          font-size: 1rem;
          color: rgba(255, 255, 255, 0.7);
          max-width: 80%;
        }
      `}</style>
    </div>
  );
};

const DiagramComponent = ({ essayTitle, scrollPosition }) => {
  const [activeDiagram, setActiveDiagram] = useState('default');
  const [caption, setCaption] = useState('');
  const [backgroundColor, setBackgroundColor] = useState('rgba(26, 26, 46, 0.4)');
  const [localScrollOffset, setLocalScrollOffset] = useState(0);
  
  // Update diagram based on essay title and scroll position
  useEffect(() => {
    if (essayTitle === 'The Why and How of Vector Embeddings') {
      if (scrollPosition < 300) {
        setActiveDiagram('dictionaryVsAssociation');
        setCaption('Dictionary definition vs. Associative view of language');
        setBackgroundColor(diagramColors.dictionaryVsAssociation);
        setLocalScrollOffset(0);
      } else if (scrollPosition < 600) {
        setActiveDiagram('vectorIntroduction');
        setCaption('Words as coordinates in semantic space');
        setBackgroundColor(diagramColors.vectorIntroduction);
        setLocalScrollOffset(0);
      } else if (scrollPosition < 950) {
        // New Vector Dimensions diagram
        setActiveDiagram('vectorDimensions');
        setCaption('Understanding vectors across dimensions');
        setBackgroundColor(diagramColors.vectorDimensions);
        setLocalScrollOffset(scrollPosition - 600); // Track local scroll within section
      } else if (scrollPosition < 1300) {
        // Show vectorMeaning after vector dimensions
        setActiveDiagram('vectorMeaning');
        setCaption('Polysemy: How context-aware embeddings handle word ambiguity');
        setBackgroundColor(diagramColors.vectorMeaning);
        setLocalScrollOffset(0);
      } else if (scrollPosition < 1800) {
        setActiveDiagram('embeddingAlgorithms');
        setCaption('Evolution of embedding techniques');
        setBackgroundColor(diagramColors.embeddingAlgorithms);
        setLocalScrollOffset(0);
      } else if (scrollPosition < 2300) {
        setActiveDiagram('embeddingApplications');
        setCaption('Applying embeddings in real-world systems');
        setBackgroundColor(diagramColors.embeddingApplications);
        setLocalScrollOffset(0);
      } else {
        setActiveDiagram('embeddingSummary');
        setCaption('The complete embedding ecosystem');
        setBackgroundColor(diagramColors.embeddingSummary);
        setLocalScrollOffset(0);
      }
    } else if (essayTitle === 'Exploring and Visualizing Vector Embeddings') {
      if (scrollPosition < 500) {
        setActiveDiagram('dimensionalityReduction');
        setCaption('Projecting high-dimensional data to 2D/3D');
        setBackgroundColor(diagramColors.vectorIntroduction);
      } else if (scrollPosition < 1000) {
        setActiveDiagram('nearestNeighborSearch');
        setCaption('Finding similar vectors efficiently');
        setBackgroundColor(diagramColors.vectorMeaning);
      } else if (scrollPosition < 1500) {
        setActiveDiagram('distanceMetrics');
        setCaption('Measuring similarity between vectors');
        setBackgroundColor(diagramColors.embeddingAlgorithms);
      } else if (scrollPosition < 2000) {
        setActiveDiagram('vectorAnalogies');
        setCaption('king - man + woman ≈ queen');
        setBackgroundColor(diagramColors.embeddingApplications);
      } else {
        setActiveDiagram('vectorCrossSections');
        setCaption('Finding meanings between concepts');
        setBackgroundColor(diagramColors.embeddingSummary);
      }
    } else if (essayTitle === 'Vector Databases and Large-Scale Retrieval') {
      if (scrollPosition < 500) {
        setActiveDiagram('vectorDatabases');
        setCaption('Specialized storage for embedding vectors');
        setBackgroundColor(diagramColors.vectorIntroduction);
      } else if (scrollPosition < 1000) {
        setActiveDiagram('documentChunking');
        setCaption('Breaking documents into manageable pieces');
        setBackgroundColor(diagramColors.vectorMeaning);
      } else if (scrollPosition < 1500) {
        setActiveDiagram('retrievalAugmentedGeneration');
        setCaption('Grounding LLMs with external knowledge');
        setBackgroundColor(diagramColors.embeddingAlgorithms);
      } else {
        setActiveDiagram('vectorEcosystem');
        setCaption('Building with vector operations at scale');
        setBackgroundColor(diagramColors.embeddingApplications);
      }
    } else {
      // Default diagram if essay not recognized
      setActiveDiagram('default');
      setCaption('');
      setBackgroundColor('rgba(26, 26, 46, 0.4)');
    }
  }, [essayTitle, scrollPosition]);
  
  // Render the appropriate diagram based on active state
  const renderDiagram = () => {
    switch (activeDiagram) {
      // Essay 1: The Why and How of Vector Embeddings
      case 'dictionaryVsAssociation':
        return <E1_DictionaryVsAssociation caption={caption} />;
      case 'vectorIntroduction':
        return <E1_Introduction caption={caption} />;
      case 'vectorDimensions':
        return <E1_VectorDimensions caption={caption} scrollOffset={localScrollOffset} />;
      case 'vectorMeaning':
        return <E1_VectorsMeaning caption={caption} />;
      case 'embeddingAlgorithms':
        return <E1_Algorithms caption={caption} />;
      case 'embeddingApplications':
        return <E1_Applications caption={caption} />;
      case 'embeddingSummary':
        return <E1_Summary caption={caption} />;
        
      // Essay 2: Exploring and Visualizing Vector Embeddings
      case 'dimensionalityReduction':
        return <E2_DimensionalityReduction caption={caption} />;
      case 'nearestNeighborSearch':
        return <E2_NearestNeighbor caption={caption} />;
      case 'distanceMetrics':
        return <E2_DistanceMetrics caption={caption} />;
      case 'vectorAnalogies':
        return <E2_VectorAnalogies caption={caption} />;
      case 'vectorCrossSections':
        return <E2_CrossSections caption={caption} />;
      
      // Essay 3: Vector Databases and Large-Scale Retrieval
      case 'vectorDatabases':
        return <E3_VectorDatabases caption={caption} />;
      case 'documentChunking':
        return <E3_DocumentChunking caption={caption} />;
      case 'retrievalAugmentedGeneration':
        return <E3_RAG caption={caption} />;
      case 'vectorEcosystem':
        return <E3_VectorEcosystem caption={caption} />;
      
      // Default case
      default:
        return <DefaultDiagram title="Diagram Component" caption={caption} />;
    }
  };
  
  return (
    <div className="diagram-component">
      <div className="diagram-content" style={{ backgroundColor }}>
        {renderDiagram()}
      </div>
      
      <style jsx="true">{`
        .diagram-component {
          display: flex;
          flex-direction: column;
          width: 100%;
          height: 100%;
          background-color: transparent;
        }
        
        .diagram-content {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.5rem;
          overflow: hidden;
          border-radius: 8px;
          transition: background-color 0.5s ease-in-out;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  );
};

export default DiagramComponent; 