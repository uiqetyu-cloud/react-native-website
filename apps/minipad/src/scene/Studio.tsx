import React, { useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import { Mesh, Object3D, Color } from 'three';
import { useSceneStore } from './sceneStore';

function AnimatedRotation({ children }: { children: React.ReactNode }) {
  const group = useRef<Object3D>(null);
  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.2;
  });
  return <group ref={group}>{children}</group>;
}

function Items(): React.ReactElement {
  const items = useSceneStore((s) => s.items);
  return (
    <AnimatedRotation>
      {items.map((it) => {
        const color = new Color(it.color);
        switch (it.kind) {
          case 'box':
            return (
              <mesh key={it.id} position={it.position} castShadow>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial color={color} metalness={0.1} roughness={0.6} />
              </mesh>
            );
          case 'sphere':
            return (
              <mesh key={it.id} position={it.position} castShadow>
                <sphereGeometry args={[0.6, 48, 48]} />
                <meshStandardMaterial color={color} metalness={0.2} roughness={0.4} />
              </mesh>
            );
          case 'donut':
          case 'torus':
            return (
              <mesh key={it.id} position={it.position} castShadow>
                <torusGeometry args={[0.6, 0.22, 48, 128]} />
                <meshStandardMaterial color={color} metalness={0.3} roughness={0.35} />
              </mesh>
            );
          case 'pedestal':
            return (
              <mesh key={it.id} position={[it.position[0], 0.1, it.position[2]]} receiveShadow castShadow>
                <cylinderGeometry args={[0.9, 0.95, 0.2, 48]} />
                <meshStandardMaterial color={color} metalness={0.0} roughness={0.9} />
              </mesh>
            );
          default:
            return null;
        }
      })}
    </AnimatedRotation>
  );
}

export function Studio(): React.ReactElement {
  const exportGlb = useSceneStore((s) => s.exportGlb);
  const rootRef = useRef<Object3D>(null);

  useEffect(() => {
    const btn = document.getElementById('export-glb');
    if (!btn) return;
    const onClick = async () => {
      if (!rootRef.current) return;
      const blob = await exportGlb(rootRef.current);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'minipad-scene.glb';
      a.click();
      URL.revokeObjectURL(url);
    };
    btn.addEventListener('click', onClick);
    return () => btn.removeEventListener('click', onClick);
  }, [exportGlb]);

  return (
    <Canvas shadows camera={{ position: [3, 2.5, 5], fov: 50 }}>
      <group ref={rootRef}>
        <ambientLight intensity={0.35} />
        <directionalLight castShadow intensity={1.2} position={[5, 7, 3]} shadow-mapSize-width={2048} shadow-mapSize-height={2048} />
        <Environment preset="city" background={false} />
        <Items />
        <ContactShadows opacity={0.6} scale={10} blur={2.8} far={6} />
      </group>
      <OrbitControls makeDefault enableDamping />
    </Canvas>
  );
}
