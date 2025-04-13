import React from 'react';
import { useScroll } from './ScrollContext';

// Create an empty diagram component instead of the default "Vector Embeddings" stand-in
const EmptyDiagram = () => {
  return (
    <div className="empty-diagram">
      <style jsx="true">{`
        .empty-diagram {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
        }
      `}</style>
    </div>
  );
};

// Create placeholder components for each diagram type
const PlaceholderDiagram = ({ caption }) => (
  <EmptyDiagram />
);

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

// Mapping of diagram IDs to components and captions
const diagramMap = {
  // Essay 1: The Why and How of Vector Embeddings
  'E1_DictionaryVsAssociation': {
    component: PlaceholderDiagram,
    caption: 'Dictionary definition vs. Associative view of language'
  },
  'E1_SemanticSpace': {
    component: PlaceholderDiagram,
    caption: 'Semantic relationships in vector space'
  },
  'E1_VectorDimensions': {
    component: PlaceholderDiagram,
    caption: 'Understanding vectors across dimensions'
  },
  'E1_VectorsMeaning': {
    component: PlaceholderDiagram,
    caption: 'Static vs. Contextual Embeddings for Polysemous Words'
  },
  'E1_Algorithms': {
    component: PlaceholderDiagram,
    caption: 'Evolution of embedding techniques'
  },
  'E1_Applications': {
    component: PlaceholderDiagram,
    caption: 'Applying embeddings in real-world systems'
  },
  'E1_Summary': {
    component: PlaceholderDiagram,
    caption: 'The complete embedding ecosystem'
  },
  
  // Essay 2: Exploring and Visualizing Vector Embeddings
  'E2_DimensionalityReduction': {
    component: PlaceholderDiagram,
    caption: 'Projecting high-dimensional data to 2D/3D'
  },
  'E2_NearestNeighbor': {
    component: PlaceholderDiagram,
    caption: 'Finding similar vectors efficiently'
  },
  'E2_DistanceMetrics': {
    component: PlaceholderDiagram,
    caption: 'Measuring similarity between vectors'
  },
  'E2_VectorAnalogies': {
    component: PlaceholderDiagram,
    caption: 'king - man + woman ≈ queen'
  },
  'E2_CrossSections': {
    component: PlaceholderDiagram,
    caption: 'Finding meanings between concepts'
  },
  
  // Essay 3: Vector Databases and Large-Scale Retrieval
  'E3_VectorDatabases': {
    component: PlaceholderDiagram,
    caption: 'Specialized storage for embedding vectors'
  },
  'E3_DocumentChunking': {
    component: PlaceholderDiagram,
    caption: 'Breaking documents into manageable pieces'
  },
  'E3_RAG': {
    component: PlaceholderDiagram,
    caption: 'Grounding LLMs with external knowledge'
  },
  'E3_VectorEcosystem': {
    component: PlaceholderDiagram,
    caption: 'Building with vector operations at scale'
  }
};

const DiagramComponent = () => {
  const { currentDiagram, currentDiagramColor, scrollDirection, userHasScrolled } = useScroll();
  
  // Get the diagram details from our mapping
  const diagramInfo = currentDiagram && currentDiagram.trim() !== '' ? diagramMap[currentDiagram] : null;
  
  // Render the appropriate diagram
  const renderDiagram = () => {
    if (!diagramInfo) {
      return <EmptyDiagram />;
    }
    
    const DiagramToRender = diagramInfo.component;
    return <DiagramToRender caption={diagramInfo.caption} />;
  };
  
  // Determine transition speed based on scroll direction
  const getTransitionStyle = () => {
    // For scrolling up, use much faster transition
    if (scrollDirection === 'up') {
      return 'background-color 0.1s ease';
    }
    // For scrolling down or no scrolling, use the normal transition
    return 'background-color 0.3s ease-in-out';
  };
  
  // Calculate opacity based on whether user has scrolled
  const getOpacity = () => {
    if (!userHasScrolled) return 0;
    return 1;
  };
  
  return (
    <div 
      className="diagram-component"
      style={{
        opacity: getOpacity(),
        transition: 'opacity 0.5s ease-in-out'
      }}
    >
      <div 
        className="diagram-content" 
        style={{ 
          backgroundColor: currentDiagramColor || 'rgba(26, 26, 46, 0.4)',
          transition: getTransitionStyle()
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