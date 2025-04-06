import React from 'react';
import { useScroll } from './ScrollContext';

// Essay 1 diagrams
import E1_DictionaryVsAssociation from './diagrams/essay1/E1_DictionaryVsAssociation';
import E1_SemanticSpace from './diagrams/essay1/E1_SemanticSpace';
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

// Mapping of diagram IDs to components and captions
const diagramMap = {
  // Essay 1: The Why and How of Vector Embeddings
  'E1_DictionaryVsAssociation': {
    component: E1_DictionaryVsAssociation,
    caption: 'Dictionary definition vs. Associative view of language'
  },
  'E1_SemanticSpace': {
    component: E1_SemanticSpace,
    caption: 'Semantic relationships in vector space'
  },
  'E1_VectorDimensions': {
    component: E1_VectorDimensions,
    caption: 'Understanding vectors across dimensions'
  },
  'E1_VectorsMeaning': {
    component: E1_VectorsMeaning,
    caption: 'Static vs. Contextual Embeddings for Polysemous Words'
  },
  'E1_Algorithms': {
    component: E1_Algorithms,
    caption: 'Evolution of embedding techniques'
  },
  'E1_Applications': {
    component: E1_Applications,
    caption: 'Applying embeddings in real-world systems'
  },
  'E1_Summary': {
    component: E1_Summary,
    caption: 'The complete embedding ecosystem'
  },
  
  // Essay 2: Exploring and Visualizing Vector Embeddings
  'E2_DimensionalityReduction': {
    component: E2_DimensionalityReduction,
    caption: 'Projecting high-dimensional data to 2D/3D'
  },
  'E2_NearestNeighbor': {
    component: E2_NearestNeighbor,
    caption: 'Finding similar vectors efficiently'
  },
  'E2_DistanceMetrics': {
    component: E2_DistanceMetrics,
    caption: 'Measuring similarity between vectors'
  },
  'E2_VectorAnalogies': {
    component: E2_VectorAnalogies,
    caption: 'king - man + woman ≈ queen'
  },
  'E2_CrossSections': {
    component: E2_CrossSections,
    caption: 'Finding meanings between concepts'
  },
  
  // Essay 3: Vector Databases and Large-Scale Retrieval
  'E3_VectorDatabases': {
    component: E3_VectorDatabases,
    caption: 'Specialized storage for embedding vectors'
  },
  'E3_DocumentChunking': {
    component: E3_DocumentChunking,
    caption: 'Breaking documents into manageable pieces'
  },
  'E3_RAG': {
    component: E3_RAG,
    caption: 'Grounding LLMs with external knowledge'
  },
  'E3_VectorEcosystem': {
    component: E3_VectorEcosystem,
    caption: 'Building with vector operations at scale'
  }
};

const DiagramComponent = () => {
  const { currentDiagram, currentDiagramColor } = useScroll();
  
  // Get the diagram details from our mapping
  const diagramInfo = currentDiagram ? diagramMap[currentDiagram] : null;
  
  // Render the appropriate diagram
  const renderDiagram = () => {
    if (!diagramInfo) {
      return <DefaultDiagram />;
    }
    
    const DiagramToRender = diagramInfo.component;
    return <DiagramToRender caption={diagramInfo.caption} />;
  };
  
  return (
    <div className="diagram-component">
      <div 
        className="diagram-content" 
        style={{ 
          backgroundColor: currentDiagramColor || 'rgba(26, 26, 46, 0.4)',
          transition: 'background-color 0.3s ease-in-out'
        }}
      >
        {renderDiagram()}
      </div>
      
      <style jsx="true">{`
        .diagram-component {
          display: flex;
          flex-direction: column;
          height: 100%;
        }
        
        .diagram-content {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
      `}</style>
    </div>
  );
};

export default DiagramComponent; 