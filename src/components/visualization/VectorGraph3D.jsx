import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { createTooltip, removeTooltip } from './VectorTooltip';
import { getPointColor, hexToThreeColor, createTextSprite } from './VectorUtils';

const VectorGraph3D = ({ coordinates, words, containerRef }) => {
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const objectsRef = useRef([]);
  const pointsRef = useRef([]);
  
  // Set up canvas size based on container
  useEffect(() => {
    const resizeCanvas = () => {
      if (!containerRef.current || !canvasRef.current) return;
      
      const container = containerRef.current;
      const width = container.clientWidth - 40; // 20px padding on each side
      const height = container.clientHeight - 40;
      
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
  
  // Initialize or update 3D scene when coordinates change
  useEffect(() => {
    if (coordinates.length > 0) {
      setup3DScene();
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
    };
  }, [coordinates]);
  
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
    
    // Create camera
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 15;
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
    
    // Add grid helper
    const gridHelper = new THREE.GridHelper(20, 20, 0x444444, 0x222222);
    scene.add(gridHelper);
    objectsRef.current.push(gridHelper);
    
    // Add axes helper
    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);
    objectsRef.current.push(axesHelper);
    
    // Create points from coordinates
    create3DPoints();
    
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
    
    // Arrays to store point data
    const pointsData = [];
    const pointsColors = [];
    const primaryPointsData = [];
    const primaryPointsColors = [];
    const pointInfos = [];
    
    // Process each coordinate
    coordinates.forEach(point => {
      // Determine if this is a primary word or a related word
      const isPrimaryWord = words.includes(point.word);
      
      // Get coordinates
      const x = point.x;
      const y = point.y;
      const z = point.hasOwnProperty('z') ? point.z : 0; // Use z if available, otherwise 0
      
      // Get color for the point
      const colorHex = getPointColor(point.word, words, isPrimaryWord);
      const color = hexToThreeColor(colorHex);
      
      // Store point info for raycasting
      pointInfos.push({
        position: new THREE.Vector3(x, y, z),
        word: point.word,
        color: color,
        isPrimary: isPrimaryWord,
        truncatedVector: point.truncatedVector,
        radius: isPrimaryWord ? 0.4 : 0.2
      });
      
      // Add to appropriate arrays
      if (isPrimaryWord) {
        primaryPointsData.push(x, y, z);
        primaryPointsColors.push(color.r, color.g, color.b);
      } else {
        pointsData.push(x, y, z);
        pointsColors.push(color.r, color.g, color.b);
      }
      
      // Add text label for all words, not just primary ones
      const textSprite = createTextSprite(point.word, isPrimaryWord);
      textSprite.position.set(x, y + (isPrimaryWord ? 0.7 : 0.5), z);
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
  
  return (
    <canvas ref={canvasRef} className="vector-canvas" />
  );
};

export default VectorGraph3D; 