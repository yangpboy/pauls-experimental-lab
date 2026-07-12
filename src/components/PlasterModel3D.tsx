import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Center, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import WebGLErrorBoundary from './WebGLErrorBoundary';

type HeadAction = () => void;

type PlasterModel3DProps = {
  theme?: 'dark' | 'light';
  onModelEnter?: (label: string) => void;
  onModelLeave?: HeadAction;
  onModelClick?: HeadAction;
  onAboutClick?: HeadAction;
};

function HeadMesh({
  onAboutClick,
  onModelEnter,
  onModelLeave,
}: {
  onAboutClick?: HeadAction;
  onModelEnter?: (label: string) => void;
  onModelLeave?: HeadAction;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const materialsRef = useRef<THREE.MeshStandardMaterial[]>([]);
  const navigationTimeoutRef = useRef<number | null>(null);
  const resetTimeoutRef = useRef<number | null>(null);
  const frameAccumulatorRef = useRef(0);
  const targetScaleVec = useRef(new THREE.Vector3(1, 1, 1));
  const [isClicked, setIsClicked] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const { size } = useThree();
  const { scene } = useGLTF('/head02.glb', true, undefined, (error: unknown) => {
    setLoadError(error instanceof Error ? error.message : 'Unknown error loading model');
  });
  const isMobileCanvas = size.width < 640;
  const modelX = 0;
  const modelY = 0;
  const modelScale = isMobileCanvas ? 625 : 530;

  const baseColor = useMemo(() => new THREE.Color('#DE5D4E'), []);
  const clickedColor = useMemo(() => new THREE.Color('#ffffff'), []);
  const black = useMemo(() => new THREE.Color('#000000'), []);

  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);

    clone.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.raycast = () => null;

        if (child.material) {
          const material = (child.material as THREE.MeshStandardMaterial).clone();
          material.color = baseColor.clone();
          material.emissive = black.clone();
          material.emissiveIntensity = 0;
          child.material = material;
        }
      }
    });

    return clone;
  }, [baseColor, black, scene]);

  useEffect(() => {
    materialsRef.current = [];
    clonedScene.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        materialsRef.current.push(child.material as THREE.MeshStandardMaterial);
      }
    });
  }, [clonedScene]);

  useEffect(() => {
    return () => {
      if (navigationTimeoutRef.current) window.clearTimeout(navigationTimeoutRef.current);
      if (resetTimeoutRef.current) window.clearTimeout(resetTimeoutRef.current);
      document.body.style.cursor = 'auto';
    };
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    frameAccumulatorRef.current += delta;
    if (frameAccumulatorRef.current < 1 / 30) return;
    frameAccumulatorRef.current = 0;

    const pointerRotationRange = Math.PI / 8.5;
    const targetX = state.pointer.x * pointerRotationRange;
    const targetY = state.pointer.y * pointerRotationRange;

    groupRef.current.rotation.y += (targetX - groupRef.current.rotation.y) * 0.075;
    groupRef.current.rotation.x += (-targetY - groupRef.current.rotation.x) * 0.075;

    const targetColor = isClicked ? clickedColor : baseColor;
    const targetEmissive = isClicked ? baseColor : black;
    const targetIntensity = isClicked ? 2.2 : 0;

    materialsRef.current.forEach((material) => {
      material.color.lerp(targetColor, 0.12);
      material.emissive.lerp(targetEmissive, 0.12);
      material.emissiveIntensity += (targetIntensity - material.emissiveIntensity) * 0.12;
    });

    const targetScale = isClicked ? 1.08 : 1;
    targetScaleVec.current.set(targetScale, targetScale, targetScale);
    groupRef.current.scale.lerp(targetScaleVec.current, 0.1);
  });

  const handleClick = () => {
    if (isClicked || navigationTimeoutRef.current) return;

    setIsClicked(true);
    document.body.style.cursor = 'progress';

    navigationTimeoutRef.current = window.setTimeout(() => {
      navigationTimeoutRef.current = null;
      onAboutClick?.();

      resetTimeoutRef.current = window.setTimeout(() => {
        resetTimeoutRef.current = null;
        setIsClicked(false);
        document.body.style.cursor = 'auto';
      }, 350);
    }, 1000);
  };

  if (loadError) {
    return (
      <mesh>
        <boxGeometry args={[100, 100, 100]} />
        <meshStandardMaterial color="red" wireframe />
      </mesh>
    );
  }

  return (
    <group ref={groupRef} position={[modelX, modelY, 0]}>
      <mesh
        visible={false}
        onPointerEnter={(event) => {
          event.stopPropagation();
          document.body.style.cursor = 'pointer';
          onModelEnter?.('About');
        }}
        onPointerLeave={(event) => {
          event.stopPropagation();
          document.body.style.cursor = 'auto';
          onModelLeave?.();
        }}
        onClick={(event) => {
          event.stopPropagation();
          handleClick();
        }}
      >
        <boxGeometry args={[230, 270, 230]} />
      </mesh>
      <Center position={[0, 0, 0]}>
        <primitive object={clonedScene} scale={modelScale} rotation={[0, Math.PI, 0]} />
      </Center>
    </group>
  );
}

export default function PlasterModel3D({
  theme = 'light',
  onModelEnter,
  onModelLeave,
  onModelClick,
  onAboutClick,
}: PlasterModel3DProps) {
  const [hoverTarget, setHoverTarget] = useState<string | null>(null);
  const aboutMeIcon = theme === 'dark' ? '/icons/ABOUT ME_w.png' : '/icons/ABOUT ME_b.png';

  return (
    <div className="relative h-full w-full pointer-events-auto">
      {hoverTarget && (
        <div className="pointer-events-none absolute left-[66%] top-[66%] z-20 md:left-[78%] md:top-[68%]">
          <img
            src={aboutMeIcon}
            alt="About me"
            className="w-[min(52vw,280px)] max-w-none drop-shadow-[8px_8px_0_rgba(43,43,43,0.18)]"
          />
        </div>
      )}
      <div className="relative flex h-full w-full items-center justify-center scale-[1.12] transition-transform duration-700 md:scale-[1.28] lg:scale-[1.34]">
        <WebGLErrorBoundary
          fallback={
            <div className="flex max-w-md flex-col items-center justify-center rounded-2xl border border-neutral-200 bg-neutral-100 p-8 text-center dark:border-neutral-800 dark:bg-neutral-900">
              <h2 className="mb-2 text-xl font-bold text-neutral-900 dark:text-white">3D Content Error</h2>
              <p className="mb-4 text-neutral-600 dark:text-neutral-400">
                WebGL context could not be created. Switch to low performance mode if this keeps happening.
              </p>
            </div>
          }
        >
          <Canvas
            camera={{ position: [0, 0, 940], fov: 50 }}
            style={{ width: '100%', height: '100%' }}
            gl={{
              powerPreference: 'high-performance',
              antialias: false,
              alpha: true,
              preserveDrawingBuffer: false,
              failIfMajorPerformanceCaveat: false,
            }}
            dpr={[0.75, 1]}
          >
            <ambientLight intensity={theme === 'dark' ? 1.5 : 2} />
            <directionalLight position={[10, 10, 10]} intensity={theme === 'dark' ? 2 : 2.5} />
            <directionalLight position={[-10, -10, -10]} intensity={0.5} />
            <Suspense fallback={null}>
              <HeadMesh
                onAboutClick={onAboutClick ?? onModelClick}
                onModelEnter={(label) => {
                  setHoverTarget(label);
                  onModelEnter?.(label);
                }}
                onModelLeave={() => {
                  setHoverTarget(null);
                  onModelLeave?.();
                }}
              />
            </Suspense>
          </Canvas>
        </WebGLErrorBoundary>
      </div>
    </div>
  );
}
