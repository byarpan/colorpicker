import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function FloatingSpheres() {
  const groupRef = useRef<THREE.Group>(null!);
  const spheres = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 10 - 5,
      ] as [number, number, number],
      scale: Math.random() * 0.4 + 0.1,
      speed: Math.random() * 0.3 + 0.1,
      color: ['#00d4ff', '#a855f7', '#39ff14'][Math.floor(Math.random() * 3)],
      offset: Math.random() * Math.PI * 2,
    }));
  }, []);

  useFrame(({ clock, pointer }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = pointer.x * 0.05;
      groupRef.current.rotation.x = pointer.y * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      {spheres.map((s, i) => (
        <FloatingSphere key={i} {...s} />
      ))}
    </group>
  );
}

function FloatingSphere({
  position,
  scale,
  speed,
  color,
  offset,
}: {
  position: [number, number, number];
  scale: number;
  speed: number;
  color: string;
  offset: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      const t = clock.getElapsedTime();
      meshRef.current.position.y = position[1] + Math.sin(t * speed + offset) * 1.5;
      meshRef.current.position.x = position[0] + Math.cos(t * speed * 0.5 + offset) * 0.5;
    }
  });

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      <sphereGeometry args={[1, 16, 16]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.8}
        transparent
        opacity={0.6}
      />
    </mesh>
  );
}

function Particles() {
  const count = 200;
  const particlesRef = useRef<THREE.Points>(null!);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 30;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 30;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 15 - 5;
    }
    return arr;
  }, []);

  useFrame(({ clock, pointer }) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = clock.getElapsedTime() * 0.02 + pointer.x * 0.1;
      particlesRef.current.rotation.x = pointer.y * 0.05;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#a855f7"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

export default function ThreeBackground() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        style={{ background: 'transparent' }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={0.5} color="#00d4ff" />
        <pointLight position={[-10, -10, 5]} intensity={0.3} color="#a855f7" />
        <FloatingSpheres />
        <Particles />
      </Canvas>
      {/* Gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse at 20% 50%, rgba(168, 85, 247, 0.08) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 20%, rgba(0, 212, 255, 0.06) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 80%, rgba(57, 255, 20, 0.04) 0%, transparent 50%)
          `,
        }}
      />
    </div>
  );
}
