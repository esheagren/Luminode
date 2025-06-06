import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { createTooltip, removeTooltip } from './VectorTooltip';
import { 
  getPointColor, 
  hexToThreeColor, 
  createTextSprite, 
  calculateCosineSimilarity, 
  formatSimilarity 
} from './VectorUtils';

const VectorGraph3D = ({ coordinates, words, containerRef, rulerActive }) => {
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const objectsRef = useRef([]);
  const pointsRef = useRef([]);
  const rulerLinesRef = useRef([]);
  const analogyLinesRef = useRef([]);
  
  // Set up canvas size based on container
  useEffect(() => {
    const resizeCanvas = () => {
      if (!containerRef.current || !canvasRef.current) return;
      
      const container = containerRef.current;
      const width = container.clientWidth - 20; // 20px padding on each side
      const height = container.clientHeight - 20;
      
      // Resize 3D canvas
      canvasRef.current.width = width;
      canvasRef.current.height = height;
      
      // Update 3D renderer if it exists
      if (rendererRef.current) {
        rendererRef.current.setSize(width, height);
        
        // Update camera aspect ratio
        if (sceneRef.current) {
          const camera = sceneRef.current.children.find(child => child.isCamera);
          if (camera) {
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
          }
        }
      }
    };
    
    // Initial resize
    resizeCanvas();
    
    // Add resize event listener
    window.addEventListener('resize', resizeCanvas);
    
    // Clean up
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [containerRef]);
  
  // Initialize or update 3D scene when coordinates or ruler state changes
  useEffect(() => {
    if (coordinates.length > 0) {
      setup3DScene();
      
      if (rulerActive) {
        addRulerLines();
      }
      
      addAnalogyLines();
    }
    
    // Clean up 3D scene when component unmounts
    return () => {
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
      
      if (objectsRef.current.length > 0) {
        objectsRef.current.forEach(obj => {
          if (obj.geometry) obj.geometry.dispose();
          if (obj.material) obj.material.dispose();
        });
      }
      
      // Clean up ruler lines
      if (rulerLinesRef.current.length > 0) {
        rulerLinesRef.current.forEach(obj => {
          if (obj.geometry) obj.geometry.dispose();
          if (obj.material) obj.material.dispose();
          if (obj.parent) obj.parent.remove(obj);
        });
        rulerLinesRef.current = [];
      }
      
      // Clean up analogy lines
      if (analogyLinesRef.current.length > 0) {
        analogyLinesRef.current.forEach(line => {
          if (line.geometry) line.geometry.dispose();
          if (line.material) line.material.dispose();
          if (line.parent) line.parent.remove(line);
        });
        analogyLinesRef.current = [];
      }
    };
  }, [coordinates, words, rulerActive]);
  
  // Set up 3D scene
  const setup3DScene = () => {
    if (!canvasRef.current || !containerRef.current) return;
    
    const canvas = canvasRef.current;
    const width = canvas.width;
    const height = canvas.height;
    
    // Create scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f172a); // Dark blue background
    sceneRef.current = scene;
    
    // Create camera with adjusted position for normalized space
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(6, 6, 6);
    camera.lookAt(0, 0, 0);
    scene.add(camera);
    
    // Create renderer
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(width, height);
    rendererRef.current = renderer;
    
    // Add orbit controls for interactive rotation
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.screenSpacePanning = false;
    controls.minDistance = 2;
    controls.maxDistance = 100;
    controls.addEventListener('change', renderThreeScene);
    controlsRef.current = controls;
    
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Add grid helper with size matching normalized space
    const gridHelper = new THREE.GridHelper(10, 10, 0x444444, 0x222222); // Increased grid size for better reference
    scene.add(gridHelper);
    objectsRef.current.push(gridHelper);
    
    // Add axes helper with size matching normalized space
    const axesHelper = new THREE.AxesHelper(5); // Increased axes length for better reference
    scene.add(axesHelper);
    objectsRef.current.push(axesHelper);
    
    // Create points from coordinates
    create3DPoints();
    
    // Add ruler lines if active
    if (rulerActive) {
      addRulerLines();
    } else {
      // Remove existing ruler lines
      rulerLinesRef.current.forEach(line => {
        if (line.parent) line.parent.remove(line);
      });
      rulerLinesRef.current = [];
    }
    
    // Set up animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      if (controlsRef.current) {
        controlsRef.current.update();
      }
      renderThreeScene();
    };
    
    animate();
    
    // Add raycaster for point interaction
    setupRaycasting(canvas);
  };
  
  // Render the THREE.js scene
  const renderThreeScene = () => {
    if (rendererRef.current && sceneRef.current) {
      const camera = sceneRef.current.children.find(child => child.isCamera);
      if (camera) {
        rendererRef.current.render(sceneRef.current, camera);
      }
    }
  };
  
  // Create 3D points from coordinates
  const create3DPoints = () => {
    if (!sceneRef.current || !coordinates || coordinates.length === 0) return;
    
    // Clear existing points
    objectsRef.current.forEach(obj => {
      if (obj !== sceneRef.current.children[0] && // Don't remove camera
          obj !== sceneRef.current.children[1] && // Don't remove ambient light
          obj !== sceneRef.current.children[2] && // Don't remove directional light
          obj !== sceneRef.current.children[3] && // Don't remove grid helper
          obj !== sceneRef.current.children[4]) { // Don't remove axes helper
        sceneRef.current.remove(obj);
      }
    });
    
    objectsRef.current = objectsRef.current.slice(0, 5); // Keep only the first 5 objects
    
    // Find min/max values to normalize coordinates
    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;
    let minZ = Infinity, maxZ = -Infinity;
    
    coordinates.forEach(point => {
      minX = Math.min(minX, point.x);
      maxX = Math.max(maxX, point.x);
      minY = Math.min(minY, point.y);
      maxY = Math.max(maxY, point.y);
      minZ = Math.min(minZ, point.z || 0);
      maxZ = Math.max(maxZ, point.z || 0);
    });
    
    // Calculate ranges
    const rangeX = maxX - minX || 1;
    const rangeY = maxY - minY || 1;
    const rangeZ = maxZ - minZ || 1;
    
    // Scale factor to spread points out in 3D space
    const scale = 2.5; // Reduced from 3 to 1.5 for closer point spacing
    
    // Arrays to store point data
    const pointsData = [];
    const pointsColors = [];
    const primaryPointsData = [];
    const primaryPointsColors = [];
    const pointInfos = [];
    
    // Process each coordinate
    coordinates.forEach(point => {
      // Normalize coordinates to [-scale, scale] range
      const normalizedX = ((point.x - minX) / rangeX * 2 - 1) * scale;
      const normalizedY = ((point.y - minY) / rangeY * 2 - 1) * scale;
      const normalizedZ = ((point.z || 0 - minZ) / rangeZ * 2 - 1) * scale;
      
      // Alternate approach for clearer gradient - use point color based on type
      const isPrimaryWord = words.includes(point.word);
      const isContextSample = point.isContextSample === true;
      const isAnalogy = point.isAnalogy === true;
      
      const colorHex = getPointColor(
        point.word, 
        words, 
        isPrimaryWord, 
        isContextSample, 
        isAnalogy,
        point.isSlice,
        point.isMainPoint,
        point.isEndpoint,
        point.sliceLevel
      );
      const color = hexToThreeColor(colorHex);
      
      // Store point info for raycasting
      pointInfos.push({
        position: new THREE.Vector3(normalizedX, normalizedY, normalizedZ),
        word: point.word,
        color: color,
        isPrimary: isPrimaryWord,
        truncatedVector: point.truncatedVector,
        radius: isPrimaryWord ? 0.3 : 0.15
      });
      
      // Add to appropriate arrays
      if (isPrimaryWord) {
        primaryPointsData.push(normalizedX, normalizedY, normalizedZ);
        primaryPointsColors.push(color.r, color.g, color.b);
      } else {
        pointsData.push(normalizedX, normalizedY, normalizedZ);
        pointsColors.push(color.r, color.g, color.b);
      }
      
      // Add text label for all words, not just primary ones
      const textSprite = createTextSprite(point.word, isPrimaryWord);
      textSprite.position.set(normalizedX, normalizedY + (isPrimaryWord ? 0.6 : 0.4), normalizedZ);
      sceneRef.current.add(textSprite);
      objectsRef.current.push(textSprite);
    });
    
    // Create geometry for regular points
    if (pointsData.length > 0) {
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.Float32BufferAttribute(pointsData, 3));
      geometry.setAttribute('color', new THREE.Float32BufferAttribute(pointsColors, 3));
      
      const material = new THREE.PointsMaterial({
        size: 0.12,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        sizeAttenuation: true,
        // Use round points instead of squares
        map: createCircleTexture('#ffffff', 64),
        alphaTest: 0.5
      });
      
      const points = new THREE.Points(geometry, material);
      points.userData = { isDataPoint: true };
      sceneRef.current.add(points);
      objectsRef.current.push(points);
    }
    
    // Create geometry for primary points (larger)
    if (primaryPointsData.length > 0) {
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.Float32BufferAttribute(primaryPointsData, 3));
      geometry.setAttribute('color', new THREE.Float32BufferAttribute(primaryPointsColors, 3));
      
      const material = new THREE.PointsMaterial({
        size: 0.25,
        vertexColors: true,
        transparent: true,
        opacity: 1.0,
        sizeAttenuation: true,
        // Use round points instead of squares
        map: createCircleTexture('#ffffff', 64),
        alphaTest: 0.5
      });
      
      const points = new THREE.Points(geometry, material);
      points.userData = { isDataPoint: true };
      sceneRef.current.add(points);
      objectsRef.current.push(points);
    }
    
    // Store point info for raycasting
    pointsRef.current = pointInfos;
  };
  
  // Helper function to create circular point texture
  const createCircleTexture = (color, size) => {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const context = canvas.getContext('2d');
    
    // Draw a circle
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size / 2 - 2;
    
    context.beginPath();
    context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    context.closePath();
    
    // Fill with gradient for softer edges
    const gradient = context.createRadialGradient(
      centerX, centerY, 0,
      centerX, centerY, radius
    );
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    
    context.fillStyle = gradient;
    context.fill();
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  };
  
  // Add ruler lines between primary points
  const addRulerLines = () => {
    if (!sceneRef.current || !coordinates || coordinates.length === 0) return;
    
    // Clean up existing ruler lines
    rulerLinesRef.current.forEach(line => {
      if (line.parent) line.parent.remove(line);
      if (line.geometry) line.geometry.dispose();
      if (line.material) line.material.dispose();
    });
    rulerLinesRef.current = [];
    
    // Find min/max values to normalize coordinates
    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;
    let minZ = Infinity, maxZ = -Infinity;
    
    coordinates.forEach(point => {
      minX = Math.min(minX, point.x);
      maxX = Math.max(maxX, point.x);
      minY = Math.min(minY, point.y);
      maxY = Math.max(maxY, point.y);
      minZ = Math.min(minZ, point.z || 0);
      maxZ = Math.max(maxZ, point.z || 0);
    });
    
    // Calculate ranges
    const rangeX = maxX - minX || 1;
    const rangeY = maxY - minY || 1;
    const rangeZ = maxZ - minZ || 1;
    
    // Scale factor to spread points out in 3D space
    const scale = 2.5; // Use the same scale factor as in create3DPoints
    
    // Filter to only get primary words
    const primaryPoints = coordinates.filter(point => words.includes(point.word));
    
    // Draw lines between each pair of primary points
    for (let i = 0; i < primaryPoints.length; i++) {
      for (let j = i + 1; j < primaryPoints.length; j++) {
        const point1 = primaryPoints[i];
        const point2 = primaryPoints[j];
        
        // Normalize coordinates
        const normalizedX1 = ((point1.x - minX) / rangeX * 2 - 1) * scale;
        const normalizedY1 = ((point1.y - minY) / rangeY * 2 - 1) * scale;
        const normalizedZ1 = ((point1.z || 0 - minZ) / rangeZ * 2 - 1) * scale;
        
        const normalizedX2 = ((point2.x - minX) / rangeX * 2 - 1) * scale;
        const normalizedY2 = ((point2.y - minY) / rangeY * 2 - 1) * scale;
        const normalizedZ2 = ((point2.z || 0 - minZ) / rangeZ * 2 - 1) * scale;
        
        // Create line geometry with normalized coordinates
        const lineGeometry = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(normalizedX1, normalizedY1, normalizedZ1),
          new THREE.Vector3(normalizedX2, normalizedY2, normalizedZ2)
        ]);
        
        // Create dashed line material
        const lineMaterial = new THREE.LineDashedMaterial({
          color: 0xffffff,
          linewidth: 1,
          scale: 1,
          dashSize: 0.1,
          gapSize: 0.05,
          opacity: 0.5,
          transparent: true
        });
        
        // Create line
        const line = new THREE.Line(lineGeometry, lineMaterial);
        line.computeLineDistances(); // Required for dashed lines
        sceneRef.current.add(line);
        rulerLinesRef.current.push(line);
        
        // Calculate midpoint for label using normalized coordinates
        const midX = (normalizedX1 + normalizedX2) / 2;
        const midY = (normalizedY1 + normalizedY2) / 2;
        const midZ = (normalizedZ1 + normalizedZ2) / 2;
        
        // Extract vectors for similarity calculation
        const extractVector = (vecStr, point) => {
          // Enhanced debugging
          console.log('3D: Attempting to extract vector for:', point?.word || 'unknown word');
        
          // First try to use the measureVector if available (most accurate)
          if (point && point.measureVector && Array.isArray(point.measureVector)) {
            console.log('3D: Using measureVector property:', point.measureVector.length, 'elements');
            return point.measureVector;
          }
          
          // Try to use vectors array if available (fallback for direct JSON conversion)
          if (point && point.vectors && Array.isArray(point.vectors)) {
            console.log('3D: Using vectors array property:', point.vectors.length, 'elements');
            return point.vectors;
          }

          // Special fallback: If we have coordinates but no vectors, create synthetic vectors
          // This allows for visual measurement even if real vector data is missing
          if (point && point.x !== undefined && point.y !== undefined) {
            const syntheticVector = [point.x, point.y];
            if (point.z !== undefined) {
              syntheticVector.push(point.z);
            }
            console.log('3D FALLBACK: Created synthetic vector from coordinates:', syntheticVector);
            return syntheticVector;
          }
          
          // Debug information about the vector string
          console.log('3D: Vector string to extract:', vecStr, typeof vecStr);
          
          if (!vecStr) {
            console.log('3D: Missing vector string');
            return null;
          }

          // Try different patterns to extract vector values
          // Pattern 1: Standard format with [...] notation
          if (typeof vecStr === 'string') {
            let matches = vecStr.match(/\[(.*?)\.\.\.]/);
            if (matches && matches[1]) {
              try {
                const values = matches[1].split(',').map(num => parseFloat(num.trim()));
                console.log('3D: Pattern 1 extracted vector:', values.length, 'elements');
                return values;
              } catch (e) {
                console.error('3D: Failed to parse vector format 1:', e);
              }
            }

            // Pattern 2: Try to extract array content with any character separator
            matches = vecStr.match(/\[(.*?)\]/);
            if (matches && matches[1]) {
              try {
                const values = matches[1].split(/[,\s]+/).map(num => parseFloat(num.trim()));
                console.log('3D: Pattern 2 extracted vector:', values.length, 'elements');
                return values;
              } catch (e) {
                console.error('3D: Failed to parse vector format 2:', e);
              }
            }
          }
          
          // Pattern 3: If it's already an array, use it directly
          if (Array.isArray(vecStr)) {
            console.log('3D: Pattern 3 using existing array:', vecStr.length, 'elements');
            return vecStr;
          }
          
          // Pattern 4: If point has a fullVector property (might be in some deployments)
          if (point && point.fullVector && Array.isArray(point.fullVector)) {
            console.log('3D: Pattern 4 using fullVector property:', point.fullVector.length, 'elements');
            return point.fullVector.slice(0, 5); // Just use first few dimensions
          }
          
          console.log('3D: No vector extraction patterns matched');
          return null;
        };
        
        const vec1 = extractVector(point1.truncatedVector, point1);
        const vec2 = extractVector(point2.truncatedVector, point2);
        
        // Calculate similarity
        let similarityText = "N/A";
        if (vec1 && vec2) {
          const similarity = calculateCosineSimilarity(vec1, vec2);
          similarityText = formatSimilarity(similarity);
        }
        
        // Create text sprite for similarity
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 128;
        canvas.height = 64;
        
        // Draw background
        context.fillStyle = 'rgba(0, 0, 0, 0.7)';
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw text
        context.font = 'bold 24px Arial';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillStyle = '#ffffff';
        context.fillText(similarityText, canvas.width / 2, canvas.height / 2);
        
        // Create texture and sprite
        const texture = new THREE.CanvasTexture(canvas);
        const material = new THREE.SpriteMaterial({ 
          map: texture,
          transparent: true
        });
        const sprite = new THREE.Sprite(material);
        sprite.position.set(midX, midY, midZ);
        sprite.scale.set(1, 0.5, 1);
        
        sceneRef.current.add(sprite);
        rulerLinesRef.current.push(sprite);
      }
    }
  };
  
  // Set up raycasting for tooltips in 3D
  const setupRaycasting = (canvas) => {
    if (!sceneRef.current) return;
    
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    
    canvas.addEventListener('mousemove', (event) => {
      // Calculate mouse position in normalized device coordinates
      const rect = canvas.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / canvas.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / canvas.height) * 2 + 1;
      
      // Update the raycaster
      raycaster.setFromCamera(mouse, sceneRef.current.children.find(child => child.isCamera));
      
      // Find intersections with points
      const intersects = raycaster.intersectObjects(objectsRef.current.filter(obj => obj.userData?.isDataPoint));
      
      if (intersects.length > 0) {
        canvas.style.cursor = 'pointer';
        
        // Find the closest point to the intersection
        const intersection = intersects[0].point;
        let closestPoint = null;
        let minDistance = Infinity;
        
        pointsRef.current.forEach(point => {
          const distance = intersection.distanceTo(point.position);
          if (distance < minDistance) {
            minDistance = distance;
            closestPoint = point;
          }
        });
        
        if (closestPoint) {
          createTooltip(closestPoint, event);
        }
      } else {
        canvas.style.cursor = 'default';
        removeTooltip();
      }
    });
    
    canvas.addEventListener('mouseleave', () => {
      // Remove tooltip when mouse leaves canvas
      removeTooltip();
    });
  };
  
  // Add analogy lines between primary points
  const addAnalogyLines = () => {
    if (!sceneRef.current || coordinates.length === 0) return;
    
    // Clean up existing analogy lines
    analogyLinesRef.current.forEach(line => {
      if (line.parent) line.parent.remove(line);
      if (line.geometry) line.geometry.dispose();
      if (line.material) line.material.dispose();
    });
    analogyLinesRef.current = [];
    
    // Find min/max values to normalize coordinates
    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;
    let minZ = Infinity, maxZ = -Infinity;
    
    coordinates.forEach(point => {
      minX = Math.min(minX, point.x);
      maxX = Math.max(maxX, point.x);
      minY = Math.min(minY, point.y);
      maxY = Math.max(maxY, point.y);
      minZ = Math.min(minZ, point.z || 0);
      maxZ = Math.max(maxZ, point.z || 0);
    });
    
    // Calculate ranges
    const rangeX = maxX - minX || 1;
    const rangeY = maxY - minY || 1;
    const rangeZ = maxZ - minZ || 1;
    
    // Scale factor to spread points out in 3D space
    const scale = 2.5; // Use the same scale as in create3DPoints
    
    // Find primary words and analogy points
    const primaryPoints = coordinates.filter(point => words.includes(point.word));
    const analogyPoints = coordinates.filter(point => point.isAnalogy);
    
    // Early return if no analogy points
    if (analogyPoints.length === 0) return;
    
    // Draw connections for each analogy point
    analogyPoints.forEach(analogyPoint => {
      if (!analogyPoint.analogySource || !analogyPoint.analogySource.fromWords) return;
      
      // In an analogy like "man:woman::king:queen", king is the relevant source word
      // that should connect to the result (queen)
      const word3 = analogyPoint.analogySource.fromWords[2]; // This should be "king" in the example
      
      if (word3) {
        const sourcePoint = coordinates.find(p => p.word === word3);
        if (!sourcePoint) return;
        
        // Normalize coordinates
        const normalizedX1 = ((sourcePoint.x - minX) / rangeX * 2 - 1) * scale;
        const normalizedY1 = ((sourcePoint.y - minY) / rangeY * 2 - 1) * scale;
        const normalizedZ1 = ((sourcePoint.z || 0 - minZ) / rangeZ * 2 - 1) * scale;
        
        const normalizedX2 = ((analogyPoint.x - minX) / rangeX * 2 - 1) * scale;
        const normalizedY2 = ((analogyPoint.y - minY) / rangeY * 2 - 1) * scale;
        const normalizedZ2 = ((analogyPoint.z || 0 - minZ) / rangeZ * 2 - 1) * scale;
        
        // Create line geometry
        const lineGeometry = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(normalizedX1, normalizedY1, normalizedZ1),
          new THREE.Vector3(normalizedX2, normalizedY2, normalizedZ2)
        ]);
        
        // Create dashed line material for analogy connections
        const lineMaterial = new THREE.LineDashedMaterial({
          color: 0x9c27b0, // Purple for analogy lines
          linewidth: 1,
          scale: 1,
          dashSize: 0.1,
          gapSize: 0.05,
          opacity: 0.7,
          transparent: true
        });
        
        // Create line
        const line = new THREE.Line(lineGeometry, lineMaterial);
        line.computeLineDistances(); // Required for dashed lines
        sceneRef.current.add(line);
        analogyLinesRef.current.push(line);
      }
    });
    
    // Draw line between the first two primary words (e.g., man:woman)
    if (primaryPoints.length >= 2) {
      const point1 = primaryPoints[0];
      const point2 = primaryPoints[1];
      
      // Normalize coordinates
      const normalizedX1 = ((point1.x - minX) / rangeX * 2 - 1) * scale;
      const normalizedY1 = ((point1.y - minY) / rangeY * 2 - 1) * scale;
      const normalizedZ1 = ((point1.z || 0 - minZ) / rangeZ * 2 - 1) * scale;
      
      const normalizedX2 = ((point2.x - minX) / rangeX * 2 - 1) * scale;
      const normalizedY2 = ((point2.y - minY) / rangeY * 2 - 1) * scale;
      const normalizedZ2 = ((point2.z || 0 - minZ) / rangeZ * 2 - 1) * scale;
      
      // Create line geometry
      const lineGeometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(normalizedX1, normalizedY1, normalizedZ1),
        new THREE.Vector3(normalizedX2, normalizedY2, normalizedZ2)
      ]);
      
      // Create dashed line material
      const lineMaterial = new THREE.LineDashedMaterial({
        color: 0x9c27b0, // Purple for analogy lines
        linewidth: 1,
        scale: 1,
        dashSize: 0.1,
        gapSize: 0.05,
        opacity: 0.7,
        transparent: true
      });
      
      // Create line
      const line = new THREE.Line(lineGeometry, lineMaterial);
      line.computeLineDistances(); // Required for dashed lines
      sceneRef.current.add(line);
      analogyLinesRef.current.push(line);
    }
  };
  
  return (
    <canvas ref={canvasRef} className="vector-canvas" />
  );
};

export default VectorGraph3D; 