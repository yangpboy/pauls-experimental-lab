import { useRef, Suspense, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Center } from '@react-three/drei';
import * as THREE from 'three';
import WebGLErrorBoundary from './WebGLErrorBoundary';

// 這是用來跟隨滑鼠轉動的組件
function InteractiveModel({ 
  onModelEnter, 
  onModelLeave, 
  onModelClick 
}: { 
  onModelEnter?: () => void, 
  onModelLeave?: () => void, 
  onModelClick?: () => void 
}) {
  const groupRef = useRef<THREE.Group>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const { scene } = useGLTF('/head02.glb', true, undefined, (error: unknown) => {
    console.error('Error loading GLTF:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error loading model';
    setLoadError(errorMessage);
  });

  const [isClicked, setIsClicked] = useState(false);
  const materialsRef = useRef<THREE.MeshStandardMaterial[]>([]);
  
  useEffect(() => {
    if (!scene) return;
    console.log('Model scene loaded:', scene);
    
    // Calculate bounding box
    const box = new THREE.Box3().setFromObject(scene);
    const size = new THREE.Vector3();
    box.getSize(size);
    console.log('Model bounds size:', size);
    console.log('Model bounds center:', box.getCenter(new THREE.Vector3()));

    materialsRef.current = [];
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        // 關閉複雜模型的射線檢測，避免卡頓
        child.raycast = () => null;

        // 全部用淺藍 (All in light blue)
        if (child.material) {
          const mat = child.material as THREE.MeshStandardMaterial;
          mat.color.set('#4db8d3'); // Restore original light blue
          mat.emissive = new THREE.Color('#000000');
          mat.emissiveIntensity = 0;
          materialsRef.current.push(mat);
        }
      }
    });
  }, [scene]);

  useFrame((state) => {
    if (!groupRef.current) return;
    
    // 取得滑鼠的 X 和 Y 座標 (範圍從 -1 到 1)
    const targetX = (state.pointer.x * Math.PI) / 4;
    const targetY = (state.pointer.y * Math.PI) / 4;

    // 平滑地旋轉模型朝向滑鼠 (使用 lerp 達到滑順效果)
    groupRef.current.rotation.y += (targetX - groupRef.current.rotation.y) * 0.05;
    groupRef.current.rotation.x += (-targetY - groupRef.current.rotation.x) * 0.05;
    
    // Smoothly animate color and glow based on isClicked state
    const targetColor = new THREE.Color(isClicked ? '#FFD700' : '#4db8d3');
    const targetEmissive = new THREE.Color(isClicked ? '#FFaa00' : '#000000');
    const targetIntensity = isClicked ? 2 : 0; // Intensity > 1 triggers bloom

    materialsRef.current.forEach(mat => {
      mat.color.lerp(targetColor, 0.05);
      mat.emissive.lerp(targetEmissive, 0.05);
      mat.emissiveIntensity += (targetIntensity - mat.emissiveIntensity) * 0.05;
    });

    // Smoothly animate scale when clicked
    const targetScale = isClicked ? 1.15 : 1.0;
    groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.05);
  });

  if (loadError) {
    return (
      <mesh>
        <boxGeometry args={[100, 100, 100]} />
        <meshStandardMaterial color="red" wireframe />
      </mesh>
    );
  }

  const handleClick = () => {
    if (isClicked) return;
    setIsClicked(true);
    
    // Wait 1 second for color transition, then trigger navigation
    setTimeout(() => {
      onModelClick?.();
      // Reset after navigation
      setTimeout(() => {
        setIsClicked(false);
      }, 1000);
    }, 1000);
  };

  return (
    <group ref={groupRef}>
      {/* 隱藏的碰撞體，用來接收滑鼠事件，避免複雜模型造成卡頓 */}
      <mesh 
        visible={false} 
        position={[0, 0, 0]}
        onPointerEnter={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'pointer';
          onModelEnter?.();
        }}
        onPointerLeave={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'auto';
          onModelLeave?.();
        }}
        onClick={(e) => {
          e.stopPropagation();
          handleClick();
        }}
      >
        <boxGeometry args={[400, 500, 400]} />
      </mesh>
      <Center>
        <primitive object={scene} scale={800} rotation={[0, Math.PI, 0]} />
      </Center>
    </group>
  );
}

export default function PlasterModelViewer({ 
  theme = 'light',
  onModelEnter,
  onModelLeave,
  onModelClick
}: { 
  theme?: 'dark' | 'light',
  onModelEnter?: () => void,
  onModelLeave?: () => void,
  onModelClick?: () => void
}) {
  return (
    <div className="w-full h-screen pointer-events-auto flex items-center justify-center">
      <WebGLErrorBoundary fallback={
        <div className="flex flex-col items-center justify-center p-8 text-center bg-neutral-100 dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 max-w-md mx-auto">
          <h2 className="text-xl font-bold mb-2 text-neutral-900 dark:text-white">3D Content Error</h2>
          <p className="text-neutral-600 dark:text-neutral-400 mb-4">
            WebGL context could not be created. This might be due to hardware limitations or too many active WebGL contexts.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-all font-bold"
          >
            REFRESH
          </button>
        </div>
      }>
        <Canvas 
          camera={{ position: [0, 0, 600], fov: 45 }} 
          style={{ width: '100%', height: '100%' }}
          gl={{ 
            powerPreference: 'high-performance',
            antialias: false,
            alpha: true,
            preserveDrawingBuffer: false,
            failIfMajorPerformanceCaveat: false
          }}
          dpr={[1, 1]}
        >
          <ambientLight intensity={theme === 'dark' ? 1.5 : 2} />
          <directionalLight position={[10, 10, 10]} intensity={theme === 'dark' ? 2 : 2.5} />
          <directionalLight position={[-10, -10, -10]} intensity={0.5} />
          {/* 主要模型 */}
          <Suspense fallback={null}>
            <InteractiveModel 
              onModelEnter={onModelEnter}
              onModelLeave={onModelLeave}
              onModelClick={onModelClick}
            />
          </Suspense>
        </Canvas>
      </WebGLErrorBoundary>
    </div>
  );
}
