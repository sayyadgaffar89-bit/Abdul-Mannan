import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const Cinematic3DCanvas: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 2, 14);

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 3. Architectural Wireframe Structural Group
    const architectureGroup = new THREE.Group();
    scene.add(architectureGroup);

    // Primary cantilevered pavilion wireframe
    const boxGeometry = new THREE.BoxGeometry(7, 3.5, 4.5);
    const boxEdges = new THREE.EdgesGeometry(boxGeometry);
    const boxLineMaterial = new THREE.LineBasicMaterial({
      color: 0xf59e0b,
      transparent: true,
      opacity: 0.38,
      linewidth: 1.5,
    });
    const pavilionMesh = new THREE.LineSegments(boxEdges, boxLineMaterial);
    pavilionMesh.position.set(2.5, 1, -1);
    architectureGroup.add(pavilionMesh);

    // Secondary vertical column tower
    const towerGeometry = new THREE.BoxGeometry(2.5, 6, 2.5);
    const towerEdges = new THREE.EdgesGeometry(towerGeometry);
    const towerLineMaterial = new THREE.LineBasicMaterial({
      color: 0xd97706,
      transparent: true,
      opacity: 0.3,
    });
    const towerMesh = new THREE.LineSegments(towerEdges, towerLineMaterial);
    towerMesh.position.set(-3.5, 2, -2.5);
    architectureGroup.add(towerMesh);

    // Cantilevered overhang roof slab
    const roofGeometry = new THREE.BoxGeometry(9, 0.4, 6);
    const roofEdges = new THREE.EdgesGeometry(roofGeometry);
    const roofLineMaterial = new THREE.LineBasicMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.28,
    });
    const roofMesh = new THREE.LineSegments(roofEdges, roofLineMaterial);
    roofMesh.position.set(2, 3.2, -1);
    architectureGroup.add(roofMesh);

    // Ground blueprint grid plane
    const gridHelper = new THREE.GridHelper(36, 36, 0xf59e0b, 0x1f2937);
    gridHelper.position.set(0, -2.5, 0);
    // Subtle opacity
    (gridHelper.material as THREE.Material).transparent = true;
    (gridHelper.material as THREE.Material).opacity = 0.25;
    scene.add(gridHelper);

    // Floating Golden Light Motes / Architectural Particles
    const particleCount = 220;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleScales = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 28;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 18;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 22;
      particleScales[i] = Math.random();
    }

    particleGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(particlePositions, 3)
    );

    const particleMaterial = new THREE.PointsMaterial({
      color: 0xfbbf24,
      size: 0.12,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // Scroll & Mouse Target Coordinates
    let scrollProgress = 0;
    let targetCameraY = 2;
    let targetCameraZ = 14;
    let targetRotY = 0;
    let targetRotX = 0;

    const onScroll = () => {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      scrollProgress = window.scrollY / maxScroll;
      // Camera moves gracefully down and forward through the 3D space
      targetCameraY = 2 - scrollProgress * 7;
      targetCameraZ = 14 - scrollProgress * 6;
      targetRotY = scrollProgress * Math.PI * 0.8;
      targetRotX = -scrollProgress * 0.35;
    };

    let mouseX = 0;
    let mouseY = 0;
    const onMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    // Animation Loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth camera interpolation
      camera.position.y += (targetCameraY - camera.position.y + mouseY * 0.5) * 0.05;
      camera.position.z += (targetCameraZ - camera.position.z) * 0.05;
      camera.position.x += (mouseX * 0.8 - camera.position.x) * 0.05;

      camera.rotation.y += (targetRotY * 0.4 - camera.rotation.y) * 0.05;
      camera.rotation.x += (targetRotX * 0.5 - camera.rotation.x) * 0.05;

      // Gentle structural breath
      pavilionMesh.rotation.y = Math.sin(elapsedTime * 0.25) * 0.08;
      towerMesh.rotation.y = -Math.cos(elapsedTime * 0.2) * 0.06;
      architectureGroup.rotation.y = targetRotY * 0.5 + Math.sin(elapsedTime * 0.15) * 0.04;

      // Particle float
      particles.rotation.y = elapsedTime * 0.03;
      particles.rotation.x = Math.sin(elapsedTime * 0.02) * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      boxGeometry.dispose();
      towerGeometry.dispose();
      roofGeometry.dispose();
      particleGeometry.dispose();
      boxLineMaterial.dispose();
      towerLineMaterial.dispose();
      roofLineMaterial.dispose();
      particleMaterial.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden opacity-85 transition-opacity duration-1000"
      style={{
        maskImage: 'linear-gradient(to bottom, black 0%, black 85%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 85%, transparent 100%)',
      }}
    />
  );
};
