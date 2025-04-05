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
    } else if (essayTitle === 'Vector Basics') {
      // Different diagrams for Vector Basics
      if (scrollPosition < 400) {
        setActiveDiagram('multidimensionalSpace');
      } else if (scrollPosition < 800) {
        setActiveDiagram('kingQueenAnalogy');
      } else {
        setActiveDiagram('wordClusters');
      }
    } else if (essayTitle === 'Transformer Models') {
      if (scrollPosition < 500) {
        setActiveDiagram('transformerArchitecture');
      } else {
        setActiveDiagram('contextualEmbeddings');
      }
    } else if (essayTitle === 'Similarity & Distance') {
      if (scrollPosition < 400) {
        setActiveDiagram('cosineSimilarity');
      } else if (scrollPosition < 800) {
        setActiveDiagram('nearestNeighbors');
      } else {
        setActiveDiagram('analogyTransformations');
      }
    } else if (essayTitle === 'Vector Databases') {
      if (scrollPosition < 400) {
        setActiveDiagram('vectorDatabaseStructure');
      } else {
        setActiveDiagram('retrievalAugmentedGeneration');
      }
    } else if (essayTitle === 'Visualization Techniques') {
      if (scrollPosition < 400) {
        setActiveDiagram('pcaVisualization');
      } else {
        setActiveDiagram('tsneUmapComparison');
      }
    } else if (essayTitle === 'Conclusion') {
      setActiveDiagram('embeddingsOverview');
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
        return <DefaultDiagram title="Retrieval-Augmented Generation" />;
      
      // Visualization Techniques diagrams
      case 'pcaVisualization':
        return <DefaultDiagram title="PCA Visualization" />;
      case 'tsneUmapComparison':
        return <DefaultDiagram title="t-SNE & UMAP Comparison" />;
      
      // Conclusion diagram
      case 'embeddingsOverview':
        return <DefaultDiagram title="Vector Embeddings Overview" />;
      
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