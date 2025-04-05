import React, { useState, useEffect } from 'react';
import DefaultDiagram from './diagrams/DefaultDiagram';

// Essay 1 diagrams
import E1_DictionaryVsAssociation from './diagrams/essay1/E1_DictionaryVsAssociation';
import E1_Introduction from './diagrams/essay1/E1_SemanticSpace';
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

const DiagramComponent = ({ essayTitle, scrollPosition }) => {
  const [activeDiagram, setActiveDiagram] = useState('default');
  const [caption, setCaption] = useState('');
  
  // Update diagram based on essay title and scroll position
  useEffect(() => {
    if (essayTitle === 'The Why and How of Vector Embeddings') {
      if (scrollPosition < 300) {
        setActiveDiagram('dictionaryVsAssociation');
        setCaption('Dictionary definition vs. Associative view of language');
      } else if (scrollPosition < 800) {
        setActiveDiagram('vectorIntroduction');
        setCaption('Words as coordinates in semantic space');
      } else if (scrollPosition < 1300) {
        setActiveDiagram('vectorMeaning');
        setCaption('Distance corresponds to semantic similarity');
      } else if (scrollPosition < 1800) {
        setActiveDiagram('embeddingAlgorithms');
        setCaption('Evolution of embedding techniques');
      } else if (scrollPosition < 2300) {
        setActiveDiagram('embeddingApplications');
        setCaption('Applying embeddings in real-world systems');
      } else {
        setActiveDiagram('embeddingSummary');
        setCaption('The complete embedding ecosystem');
      }
    } else if (essayTitle === 'Exploring and Visualizing Vector Embeddings') {
      if (scrollPosition < 500) {
        setActiveDiagram('dimensionalityReduction');
        setCaption('Projecting high-dimensional data to 2D/3D');
      } else if (scrollPosition < 1000) {
        setActiveDiagram('nearestNeighborSearch');
        setCaption('Finding similar vectors efficiently');
      } else if (scrollPosition < 1500) {
        setActiveDiagram('distanceMetrics');
        setCaption('Measuring similarity between vectors');
      } else if (scrollPosition < 2000) {
        setActiveDiagram('vectorAnalogies');
        setCaption('king - man + woman ≈ queen');
      } else {
        setActiveDiagram('vectorCrossSections');
        setCaption('Finding meanings between concepts');
      }
    } else if (essayTitle === 'Vector Databases and Large-Scale Retrieval') {
      if (scrollPosition < 500) {
        setActiveDiagram('vectorDatabases');
        setCaption('Specialized storage for embedding vectors');
      } else if (scrollPosition < 1000) {
        setActiveDiagram('documentChunking');
        setCaption('Breaking documents into manageable pieces');
      } else if (scrollPosition < 1500) {
        setActiveDiagram('retrievalAugmentedGeneration');
        setCaption('Grounding LLMs with external knowledge');
      } else {
        setActiveDiagram('vectorEcosystem');
        setCaption('Building with vector operations at scale');
      }
    } else {
      // Default diagram if essay not recognized
      setActiveDiagram('default');
      setCaption('');
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
        return <DefaultDiagram title="Diagram Component" />;
    }
  };
  
  return (
    <div className="diagram-component">
      <div className="diagram-content">
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
        }
      `}</style>
    </div>
  );
};

export default DiagramComponent; 