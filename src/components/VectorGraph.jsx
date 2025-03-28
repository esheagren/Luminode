import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import ViewButton from './ViewButton';
import VectorGraph2D from './visualization/VectorGraph2D';
import VectorGraph3D from './visualization/VectorGraph3D';
import LoadingOverlay from './visualization/LoadingOverlay';
import ErrorOverlay from './visualization/ErrorOverlay';
import { getApiUrl } from '../utils/environment';

const VectorGraph = ({ 
  words, 
  midpointWords, 
  numMidpoints, 
  viewMode = '2D', 
  setViewMode,
  rulerActive,
  selectionMode = false,
  onPointSelected = null,
  selectedPoints = [],
  analogyMode = false,
  analogyStep = 0,
  isSearchingAnalogy = false
}) => {
  const [coordinates, setCoordinates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [midpointClusters, setMidpointClusters] = useState([]);
  
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  
  // Fetch coordinates when words or viewMode changes
  useEffect(() => {
    if (!words || words.length === 0) {
      // Clear coordinates when there are no words
      console.log('No words to visualize, clearing the graph');
      setCoordinates([]);
      return;
    }
    
    const fetchCoordinates = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Create array of all words to visualize
        const allWords = [...words];
        
        // Add related words if available
        const hasRelatedWords = midpointWords && midpointWords.length > 0;
        
        if (hasRelatedWords) {
          // Add all words from all clusters
          midpointWords.forEach(cluster => {
            if (cluster && cluster.words) {
              allWords.push(...cluster.words.map(item => item.word));
            }
          });
        }
        
        // Make sure we have unique words only
        const uniqueWords = [...new Set(allWords)];
        
        console.log(`Fetching ${viewMode} coordinates for words:`, uniqueWords);
        
        // Get the vector coordinates for visualization
        const response = await axios.post(getApiUrl('/api/getVectorCoordinates'), { 
          words: uniqueWords,
          dimensions: viewMode === '3D' ? 3 : 2
        });
        
        // Now fetch the actual vector data for each word for the tooltips
        const vectorPromises = uniqueWords.map(async (word) => {
          try {
            const vectorResponse = await axios.post(getApiUrl('/api/checkWord'), { word });
            return {
              word,
              vector: vectorResponse.data.data.word.vector
            };
          } catch (error) {
            console.error(`Error fetching vector for ${word}:`, error);
            return { word, vector: null };
          }
        });
        
        const vectorResults = await Promise.all(vectorPromises);
        const vectorMap = Object.fromEntries(
          vectorResults.map(item => [item.word, item.vector])
        );
        
        // Combine coordinate data with vector data
        const coordinatesWithVectors = response.data.data.map(point => {
          // Check if this point is part of an analogy result
          const analogyCluster = midpointWords.find(cluster => 
            cluster.type === 'analogy' && 
            cluster.words.some(w => w.word === point.word)
          );
          
          let isAnalogy = false;
          let analogySource = null;
          
          if (analogyCluster) {
            const analogyWord = analogyCluster.words.find(w => w.word === point.word);
            isAnalogy = !!analogyWord?.isAnalogy;
            analogySource = analogyWord?.analogySource || null;
          }
          
          // Check if this point is part of a midpoint result
          const midpointCluster = midpointWords.find(cluster => 
            cluster.type === 'midpoint' && 
            cluster.words.some(w => w.word === point.word)
          );
          
          let isMidpoint = false;
          let midpointLevel = null;
          let midpointSource = null;
          
          if (midpointCluster) {
            const midpointWord = midpointCluster.words.find(w => w.word === point.word);
            isMidpoint = !!midpointWord?.isMidpoint;
            midpointLevel = midpointWord?.midpointLevel || 'primary';
            midpointSource = midpointWord?.midpointSource || null;
            
            console.log(`Found midpoint word ${point.word} with level ${midpointLevel}`, midpointWord);
          }
          
          // Check if this point is part of a slice result
          const sliceCluster = midpointWords.find(cluster => 
            cluster.type === 'slice' && 
            cluster.words.some(w => w.word === point.word)
          );
          
          let isSlice = false;
          let isMainPoint = false;
          let isEndpoint = false;
          let sliceLevel = null;
          let sliceIndex = null;
          let sliceDepth = null;
          let sliceSource = null;
          let similarity = null;
          
          if (sliceCluster) {
            const sliceWord = sliceCluster.words.find(w => w.word === point.word);
            if (sliceWord) {
              isSlice = !!sliceWord.isSlice;
              isMainPoint = !!sliceWord.isMainPoint;
              isEndpoint = !!sliceWord.isEndpoint;
              sliceLevel = sliceWord.sliceLevel || 'neighbor';
              sliceIndex = sliceWord.sliceIndex || 0;
              sliceDepth = sliceWord.sliceDepth || 0;
              sliceSource = sliceWord.sliceSource || null;
              similarity = sliceWord.similarity || null;
              
              console.log(`Found slice word ${point.word} with level ${sliceLevel}`, sliceWord);
            }
          }
          
          return {
            ...point,
            truncatedVector: vectorMap[point.word] || `Vector for ${point.word}`,
            isAnalogy,
            analogySource,
            isMidpoint,
            midpointLevel,
            midpointSource,
            isSlice,
            isMainPoint,
            isEndpoint,
            sliceLevel,
            sliceIndex,
            sliceDepth,
            sliceSource,
            similarity
          };
        });
        
        // Debug the coordinates data after processing
        console.log('Processed coordinates with clusters:', coordinatesWithVectors.filter(c => c.isMidpoint || c.isAnalogy));
        
        setCoordinates(coordinatesWithVectors);
      } catch (error) {
        console.error('Error fetching vector coordinates:', error);
        setError('Failed to load visualization data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCoordinates();
  }, [words, viewMode, midpointWords, numMidpoints]);
  
  // Handle point selection
  const handlePointSelected = (word) => {
    if (onPointSelected) {
      onPointSelected(word);
    }
  };
  
  // Add transition animation when switching view modes
  useEffect(() => {
    if (!canvasRef.current) return;
    
    // Add transition effect
    canvasRef.current.style.transition = 'transform 0.5s ease-in-out, opacity 0.3s ease-in-out';
    
    // Apply animation
    if (viewMode === '3D') {
      // Animate to 3D
      canvasRef.current.style.opacity = '0';
      setTimeout(() => {
        canvasRef.current.style.transform = 'rotateY(180deg)';
        setTimeout(() => {
          canvasRef.current.style.opacity = '1';
          canvasRef.current.style.transform = 'rotateY(0deg)';
        }, 300);
      }, 300);
    } else {
      // Animate to 2D
      canvasRef.current.style.opacity = '0';
      setTimeout(() => {
        canvasRef.current.style.transform = 'rotateX(180deg)';
        setTimeout(() => {
          canvasRef.current.style.opacity = '1';
          canvasRef.current.style.transform = 'rotateX(0deg)';
        }, 300);
      }, 300);
    }
  }, [viewMode]);

  return (
    <div className="graph-container" ref={containerRef}>
      {loading && <LoadingOverlay />}
      
      {error && <ErrorOverlay error={error} />}
      
      <div ref={canvasRef}>
        {viewMode === '2D' ? (
          <VectorGraph2D 
            coordinates={coordinates} 
            words={words} 
            containerRef={containerRef}
            rulerActive={rulerActive}
            selectionMode={selectionMode}
            onPointSelected={handlePointSelected}
            selectedPoints={selectedPoints}
            analogyMode={analogyMode}
            analogyStep={analogyStep}
            isSearchingAnalogy={isSearchingAnalogy}
          />
        ) : (
          <VectorGraph3D 
            coordinates={coordinates} 
            words={words} 
            containerRef={containerRef}
            rulerActive={rulerActive}
          />
        )}
      </div>
      
      <style jsx="true">{`
        .graph-container {
          width: 100%;
          height: 100%;
          position: relative;
          overflow: hidden;
          background: linear-gradient(135deg, #0f0f10 0%, #1a1a1c 100%);
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.05);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        }
        
        .vector-canvas {
          position: absolute;
          top: 20px;
          left: 20px;
          background-color: transparent;
          border-radius: 8px;
        }
      `}</style>
    </div>
  );
};

export default VectorGraph;