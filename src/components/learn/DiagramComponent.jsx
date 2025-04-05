import React, { useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from '../../app/store';

// Import diagram components
import VectorExplanationDiagram from './diagrams/VectorExplanationDiagram';
import DefaultDiagram from './diagrams/DefaultDiagram';

const DiagramComponent = ({ essayTitle, scrollPosition }) => {
  const [activeDiagram, setActiveDiagram] = useState('default');
  
  // Update diagram based on essay title and scroll position
  useEffect(() => {
    if (essayTitle === 'The Why and How of Vector Embeddings') {
      // Different diagrams for Vector Basics
      if (scrollPosition < 400) {
        setActiveDiagram('multidimensionalSpace');
      } else if (scrollPosition < 800) {
        setActiveDiagram('kingQueenAnalogy');
      } else {
        setActiveDiagram('wordClusters');
      }
    } else if (essayTitle === 'Exploring and Visualizing Vector Embeddings') {
      if (scrollPosition < 500) {
        setActiveDiagram('transformerArchitecture');
      } else {
        setActiveDiagram('contextualEmbeddings');
      }
    } else if (essayTitle === 'Vector Databases and Large-Scale Retrieval') {
      if (scrollPosition < 400) {
        setActiveDiagram('cosineSimilarity');
      } else if (scrollPosition < 800) {
        setActiveDiagram('nearestNeighbors');
      } else {
        setActiveDiagram('analogyTransformations');
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
        return (
          <Provider store={store}>
            <VectorExplanationDiagram />
          </Provider>
        );
      case 'vectorComparison':
        return <DefaultDiagram title="Vector Comparison" />;
      case 'transformerModel':
        return <DefaultDiagram title="Transformer Model" />;
      
      // Vector Basics diagrams
      case 'multidimensionalSpace':
        return <DefaultDiagram title="Multidimensional Space" />;
      case 'kingQueenAnalogy':
        return <DefaultDiagram title="King - Queen Analogy" />;
      case 'wordClusters':
        return <DefaultDiagram title="Word Clusters" />;
      
      // Transformer Models diagrams
      case 'transformerArchitecture':
        return <DefaultDiagram title="Transformer Architecture" />;
      case 'contextualEmbeddings':
        return <DefaultDiagram title="Contextual Embeddings" />;
      
      // Similarity & Distance diagrams
      case 'cosineSimilarity':
        return <DefaultDiagram title="Cosine Similarity" />;
      case 'nearestNeighbors':
        return <DefaultDiagram title="Nearest Neighbors" />;
      case 'analogyTransformations':
        return <DefaultDiagram title="Analogy Transformations" />;
      
      // Vector Databases diagrams
      case 'vectorDatabaseStructure':
        return <DefaultDiagram title="Vector Database Structure" />;
      case 'retrievalAugmentedGeneration':
        return <DefaultDiagram title="Retrieval Augmented Generation" />;
      
      // Visualization diagrams
      case 'pcaVisualization':
        return <DefaultDiagram title="PCA Visualization" />;
      case 'tsneUmapComparison':
        return <DefaultDiagram title="t-SNE & UMAP Comparison" />;
      
      // Default case
      default:
        return <DefaultDiagram title="Diagram Component" />;
    }
  };
  
  return (
    <div className="diagram-component">
      <h3 className="diagram-title">Diagram Component</h3>
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