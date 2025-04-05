import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import axios from 'axios';
import { getApiUrl } from '../../../utils/environment';
import { useDispatch } from 'react-redux';
import { fetchWordData } from '../../../features/wordCache/wordCacheSlice';

const VectorExplanationDiagram = () => {
  const [words, setWords] = useState(['food', 'meal', 'dinner']);
  const [viewMode, setViewMode] = useState('2D');
  const [selectedWord, setSelectedWord] = useState(null);
  const [newWord, setNewWord] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [coordinates, setCoordinates] = useState([]);
  
  const canvas2DRef = useRef(null);
  const canvas3DRef = useRef(null);
  const containerRef = useRef(null);
  const scene3DRef = useRef(null);
  const renderer3DRef = useRef(null);
  const animationFrameRef = useRef(null);
  
  // Get dispatch function from Redux
  const dispatch = useDispatch();
  
  // Predefined word vectors for when API is not available
  const wordVectors = {
    food: { x: 0.6, y: -0.2, z: 0.3 },
    meal: { x: 0.48, y: -0.4, z: 0.1 },
    dinner: { x: 0.4, y: -0.5, z: 0.2 },
    breakfast: { x: 0.5, y: -0.3, z: 0.4 },
    lunch: { x: 0.45, y: -0.35, z: 0.25 },
    snack: { x: 0.3, y: -0.2, z: 0.15 },
    eat: { x: 0.7, y: -0.3, z: 0.35 },
    cooking: { x: 0.55, y: -0.45, z: 0.4 },
  };
  
  const availableWords = Object.keys(wordVectors);

  // Fetch coordinates from the API
  useEffect(() => {
    if (words.length === 0) return;
    
    const fetchCoordinates = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Get the vector coordinates for visualization
        const apiUrl = getApiUrl('/api/getVectorCoordinates');
        console.log('Fetching coordinates for:', words);
        
        const response = await axios.post(apiUrl, { 
          words: words,
          dimensions: viewMode === '3D' ? 3 : 2
        });
        
        if (response.data && response.data.data) {
          console.log('API response:', response.data);
          setCoordinates(response.data.data);
        } else {
          // Fallback to predefined vectors if API fails
          console.log('Using default vectors');
          const defaultCoords = words.map(word => {
            const vector = wordVectors[word] || { x: 0, y: 0, z: 0 };
            return { word, x: vector.x, y: vector.y, z: vector.z };
          });
          setCoordinates(defaultCoords);
        }
      } catch (error) {
        console.error('Error fetching coordinates:', error);
        setError('Failed to load data');
        
        // Fallback to predefined vectors
        const defaultCoords = words.map(word => {
          const vector = wordVectors[word] || { x: 0, y: 0, z: 0 };
          return { word, x: vector.x, y: vector.y, z: vector.z };
        });
        setCoordinates(defaultCoords);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCoordinates();
  }, [words, viewMode]);
  
  // Set up the canvas when coordinates change
  useEffect(() => {
    if (viewMode === '2D') {
      setup2DCanvas();
    } else {
      setup3DCanvas();
    }
    
    // Cleanup function
    return () => {
      if (viewMode === '3D' && renderer3DRef.current) {
        renderer3DRef.current.dispose();
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [viewMode, coordinates, selectedWord]);
  
  // Setup 2D canvas
  const setup2DCanvas = () => {
    const canvas = canvas2DRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Set background
    ctx.fillStyle = 'rgba(26, 26, 46, 0.7)';
    ctx.fillRect(0, 0, width, height);
    
    // Draw coordinate system
    const originX = width / 2;
    const originY = height / 2;
    
    // Draw axes
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1;
    
    // X-axis
    ctx.beginPath();
    ctx.moveTo(20, originY);
    ctx.lineTo(width - 20, originY);
    ctx.stroke();
    
    // Y-axis
    ctx.beginPath();
    ctx.moveTo(originX, 20);
    ctx.lineTo(originX, height - 20);
    ctx.stroke();
    
    // Draw axis labels
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    
    // X-axis label
    ctx.fillText('x', width - 15, originY + 15);
    
    // Y-axis label
    ctx.fillText('y', originX + 15, 15);
    
    // Draw grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 0.5;
    
    // Vertical grid lines
    for (let x = 40; x < width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 20);
      ctx.lineTo(x, height - 20);
      ctx.stroke();
    }
    
    // Horizontal grid lines
    for (let y = 40; y < height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(20, y);
      ctx.lineTo(width - 20, y);
      ctx.stroke();
    }
    
    // Draw vectors for selected words
    coordinates.forEach(point => {
      // Scale vectors for visualization
      const scaleX = 150;
      const scaleY = 150;
      const deltaX = point.x * scaleX;
      const deltaY = -point.y * scaleY; // Invert Y for canvas coordinates
      
      // Determine color based on if this is the selected word
      const color = point.word === selectedWord ? '#FFC837' : '#6A5ACD';
      
      drawVector(ctx, originX, originY, deltaX, deltaY, color, point.word);
    });
  };
  
  // Setup 3D canvas
  const setup3DCanvas = () => {
    const canvas = canvas3DRef.current;
    if (!canvas) return;
    
    // Clear any existing scene
    if (scene3DRef.current) {
      while(scene3DRef.current.children.length > 0) { 
        const object = scene3DRef.current.children[0];
        scene3DRef.current.remove(object);
      }
    }
    
    // Dispose of previous renderer if it exists
    if (renderer3DRef.current) {
      renderer3DRef.current.dispose();
      renderer3DRef.current = null;
    }
    
    // Cancel any existing animation frame
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    
    const width = canvas.width;
    const height = canvas.height;
    
    try {
      // Create scene
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x1a1a2e);
      scene3DRef.current = scene;
      
      // Create camera
      const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
      camera.position.set(3, 3, 3);
      camera.lookAt(0, 0, 0);
      scene.add(camera);
      
      // Create renderer with specific parameters to avoid WebGL conflicts
      const renderer = new THREE.WebGLRenderer({ 
        canvas, 
        antialias: true,
        powerPreference: "high-performance",
        alpha: true,
        preserveDrawingBuffer: false
      });
      renderer.setSize(width, height);
      renderer3DRef.current = renderer;
      
      // Add orbit controls
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.25;
      
      // Add ambient light
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      scene.add(ambientLight);
      
      // Add directional light
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(1, 1, 1);
      scene.add(directionalLight);
      
      // Add axes helper
      const axesHelper = new THREE.AxesHelper(2);
      scene.add(axesHelper);
      
      // Add grid helper
      const gridHelper = new THREE.GridHelper(4, 10, 0x444444, 0x222222);
      scene.add(gridHelper);
      
      // Add sphere geometries for each word
      coordinates.forEach(point => {
        // Create sphere geometry - increase size from 0.1 to 0.25
        const geometry = new THREE.SphereGeometry(0.05, 32, 32);
        
        // Set material color based on if this is the selected word
        const color = point.word === selectedWord ? 0xFFC837 : 0x6A5ACD;
        const material = new THREE.MeshStandardMaterial({ 
          color: color,
          metalness: 0.3,
          roughness: 0.4,
          emissive: color, // Add emissive for glow effect
          emissiveIntensity: 0.3, // Moderate intensity
        });
        
        const sphere = new THREE.Mesh(geometry, material);
        // Scale the coordinates for better visibility
        sphere.position.set(
          point.x * 2,
          point.y * 2,
          (point.z || 0) * 2  // Handle case where z might be undefined in 2D data
        );
        sphere.userData = { word: point.word };
        scene.add(sphere);
        
        // Add vector line from origin - make lines thicker
        const lineGeometry = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(0, 0, 0),
          new THREE.Vector3(point.x * 2, point.y * 2, (point.z || 0) * 2)
        ]);
        const lineMaterial = new THREE.LineBasicMaterial({ 
          color: color,
          linewidth: 2 // Note: WebGL has limited support for line width
        });
        const line = new THREE.Line(lineGeometry, lineMaterial);
        scene.add(line);
        
        // Add text label - make sprite larger
        const labelCanvas = document.createElement('canvas');
        labelCanvas.width = 256; // Doubled from 128
        labelCanvas.height = 128; // Doubled from 64
        const ctx = labelCanvas.getContext('2d');
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, labelCanvas.width, labelCanvas.height);
        ctx.font = 'bold 36px Arial'; // Increased font size from 24px
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(point.word, labelCanvas.width / 2, labelCanvas.height / 2);
        
        const texture = new THREE.CanvasTexture(labelCanvas);
        const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
        const sprite = new THREE.Sprite(spriteMaterial);
        sprite.position.set(point.x * 2.2, point.y * 2.2, (point.z || 0) * 2.2);
        sprite.scale.set(1, 0.5, 1); // Doubled from 0.5, 0.25, 1
        scene.add(sprite);
      });
      
      // Animation loop
      const animate = () => {
        animationFrameRef.current = requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
      };
      
      animate();
    } catch (err) {
      console.error('Error setting up 3D canvas:', err);
      setError('Error setting up 3D view. Try refreshing the page.');
    }
  };
  
  // Function to draw a vector with label in 2D
  const drawVector = (ctx, startX, startY, deltaX, deltaY, color, label) => {
    const endX = startX + deltaX;
    const endY = startY + deltaY;
    
    // Draw a dot at the end point instead of an arrow
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(endX, endY, 6, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw label
    ctx.fillStyle = color;
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(label, endX, endY - 15);
    
    // Add glow effect
    ctx.shadowBlur = 10;
    ctx.shadowColor = color;
    ctx.fillText(label, endX, endY - 15);
    ctx.shadowBlur = 0;
  };
  
  // Handle word removal
  const handleWordRemove = (word) => {
    if (words.length > 1) { // Keep at least one word
      setWords(words.filter(w => w !== word));
      if (selectedWord === word) {
        setSelectedWord(null);
      }
    }
  };
  
  // Handle new word submission
  const handleAddWord = async (e) => {
    e.preventDefault();
    if (!newWord.trim()) return;
    
    const word = newWord.trim().toLowerCase();
    
    // Check if word is already in the list
    if (words.includes(word)) {
      setError("Word is already in your list");
      return;
    }
    
    // Reset previous errors
    setError(null);
    setLoading(true);
    
    try {
      // Use the Redux thunk to check word existence and fetch data
      console.log(`[VectorDiagram] Dispatching fetchWordData for: ${word}`);
      const result = await dispatch(fetchWordData(word)).unwrap();
      
      // Check existence from the thunk result
      if (result.data.exists) {
        // Add word to the list
        const updatedWords = [...words, word];
        setWords(updatedWords);
        setSelectedWord(word);
        setNewWord(''); // Clear input
      } else {
        // Word doesn't exist in embeddings
        setError(`"${word}" is not in our dictionary`);
      }
    } catch (fetchError) {
      console.error('[VectorDiagram] Error adding word via thunk:', fetchError);
      setError(fetchError.error || `Error adding "${word}"`);
      
      // Fallback for demo: if word is in our predefined list, add it anyway
      if (availableWords.includes(word)) {
        const updatedWords = [...words, word];
        setWords(updatedWords);
        setSelectedWord(word);
        setNewWord(''); // Clear input
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Handle canvas resize
  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current) return;
      
      const container = containerRef.current;
      const width = container.clientWidth;
      const height = container.clientHeight;
      
      if (viewMode === '2D' && canvas2DRef.current) {
        canvas2DRef.current.width = width;
        canvas2DRef.current.height = height;
        setup2DCanvas();
      } else if (viewMode === '3D' && canvas3DRef.current) {
        canvas3DRef.current.width = width;
        canvas3DRef.current.height = height;
        
        if (renderer3DRef.current) {
          renderer3DRef.current.setSize(width, height);
          
          // Update camera aspect ratio
          if (scene3DRef.current) {
            const camera = scene3DRef.current.children.find(child => child instanceof THREE.PerspectiveCamera);
            if (camera) {
              camera.aspect = width / height;
              camera.updateProjectionMatrix();
            }
          }
        } else {
          // If renderer doesn't exist, set up 3D canvas
          setup3DCanvas();
        }
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial resize
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [viewMode, coordinates]);
  
  return (
    <div className="vector-explanation-diagram" ref={containerRef}>
      <div className="controls">
        <form className="word-input" onSubmit={handleAddWord}>
          <input
            type="text"
            value={newWord}
            onChange={(e) => setNewWord(e.target.value)}
            placeholder="Add a word..."
            disabled={loading}
          />
          <button type="submit" disabled={loading || !newWord.trim()}>
            Add
          </button>
        </form>
        
        <div className="view-toggle">
          <button 
            className={viewMode === '2D' ? 'active' : ''} 
            onClick={() => setViewMode('2D')}
          >
            2D
          </button>
          <button 
            className={viewMode === '3D' ? 'active' : ''} 
            onClick={() => setViewMode('3D')}
          >
            3D
          </button>
        </div>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="words-container">
        {words.map((word) => (
          <div 
            key={word} 
            className={`word-tag ${selectedWord === word ? 'selected' : ''}`}
            onClick={() => setSelectedWord(word)}
          >
            {word}
            <button className="remove-word" onClick={(e) => {
              e.stopPropagation();
              handleWordRemove(word);
            }}>×</button>
          </div>
        ))}
      </div>
      
      <div className="canvas-container">
        {loading && <div className="loading-overlay">Loading...</div>}
        <canvas
          ref={canvas2DRef}
          width={300}
          height={300}
          style={{ display: viewMode === '2D' ? 'block' : 'none' }}
        />
        <canvas
          ref={canvas3DRef}
          width={300}
          height={300}
          style={{ display: viewMode === '3D' ? 'block' : 'none' }}
        />
      </div>
      
      <style jsx="true">{`
        .vector-explanation-diagram {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          border: 1px solid rgba(255, 165, 0, 0.3);
          border-radius: 8px;
          background-color: rgba(26, 26, 46, 0.7);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2), 0 0 20px rgba(255, 165, 0, 0.1);
          overflow: hidden;
          padding: 10px;
        }
        
        .controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }
        
        .view-toggle {
          display: flex;
          gap: 5px;
        }
        
        .view-toggle button {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: rgba(255, 255, 255, 0.7);
          padding: 5px 10px;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .view-toggle button.active {
          background: rgba(255, 165, 0, 0.2);
          border-color: rgba(255, 165, 0, 0.5);
          color: #FFA500;
        }
        
        .word-input {
          display: flex;
          gap: 5px;
        }
        
        .word-input input {
          background: rgba(26, 26, 46, 0.8);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.2);
          padding: 5px 10px;
          border-radius: 4px;
          outline: none;
          width: 120px;
        }
        
        .word-input button {
          background: rgba(255, 165, 0, 0.2);
          color: #FFA500;
          border: 1px solid rgba(255, 165, 0, 0.3);
          padding: 5px 10px;
          border-radius: 4px;
          cursor: pointer;
        }
        
        .word-input button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .error-message {
          color: #ff6b6b;
          font-size: 0.8rem;
          margin-bottom: 10px;
          padding: 5px;
          background: rgba(255, 107, 107, 0.1);
          border-radius: 4px;
        }
        
        .words-container {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 10px;
        }
        
        .word-tag {
          display: inline-flex;
          align-items: center;
          background-color: rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 4px 10px;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .word-tag.selected {
          background-color: rgba(255, 165, 0, 0.2);
          color: #FFA500;
        }
        
        .remove-word {
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.5);
          margin-left: 5px;
          cursor: pointer;
          font-size: 1rem;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .word-tag.selected .remove-word {
          color: #FFA500;
        }
        
        .canvas-container {
          flex: 1;
          position: relative;
          overflow: hidden;
        }
        
        .loading-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(26, 26, 46, 0.7);
          color: #FFA500;
          z-index: 10;
        }
        
        canvas {
          width: 100%;
          height: 100%;
        }
      `}</style>
    </div>
  );
};

export default VectorExplanationDiagram; 