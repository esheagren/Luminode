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
    camera.position.set(10, 10, 10); // Adjusted from 20,20,20 to match new scale
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
    controls.minDistance = 3; // Adjusted from 5 to match new scale
    controls.maxDistance = 25; // Adjusted from 50 to match new scale
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
    const gridHelper = new THREE.GridHelper(10, 10, 0x444444, 0x222222); // Adjusted from 20,20 to match new scale
    scene.add(gridHelper);
    objectsRef.current.push(gridHelper);
    
    // Add axes helper with size matching normalized space
    const axesHelper = new THREE.AxesHelper(5); // Adjusted from 10 to match new scale
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
    const scale = 5; // Reduced from 10 to 5 for more compact visualization
    
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
        radius: isPrimaryWord ? 0.4 : 0.2
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
      textSprite.position.set(normalizedX, normalizedY + (isPrimaryWord ? 0.7 : 0.5), normalizedZ);
      sceneRef.current.add(textSprite);
      objectsRef.current.push(textSprite);
    });
    
    // Create geometry for regular points
    if (pointsData.length > 0) {
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.Float32BufferAttribute(pointsData, 3));
      geometry.setAttribute('color', new THREE.Float32BufferAttribute(pointsColors, 3));
      
      const material = new THREE.PointsMaterial({
        size: 0.2,
        vertexColors: true,
        transparent: true,
        opacity: 0.8
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
        size: 0.4,
        vertexColors: true
      });
      
      const points = new THREE.Points(geometry, material);
      points.userData = { isDataPoint: true };
      sceneRef.current.add(points);
      objectsRef.current.push(points);
    }
    
    // Store point info for raycasting
    pointsRef.current = pointInfos;
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
    const scale = 5; // Keep same scale as in create3DPoints
    
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
        const extractVector = (vecStr) => {
          if (typeof vecStr !== 'string') return null;
          const matches = vecStr.match(/\[(.*?)\.\.\.]/);
          if (!matches || !matches[1]) return null;
          return matches[1].split(',').map(num => parseFloat(num.trim()));
        };
        
        const vec1 = extractVector(point1.truncatedVector);
        const vec2 = extractVector(point2.truncatedVector);
        
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
        
        // Create line geometry
        const lineGeometry = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(sourcePoint.x, sourcePoint.y, sourcePoint.z || 0),
          new THREE.Vector3(analogyPoint.x, analogyPoint.y, analogyPoint.z || 0)
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
      
      // Create line geometry
      const lineGeometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(point1.x, point1.y, point1.z || 0),
        new THREE.Vector3(point2.x, point2.y, point2.z || 0)
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