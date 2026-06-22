import { useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";

function OrbMesh() {
  const meshRef = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (meshRef.current) {
      // Slow complex rotation
      meshRef.current.rotation.x = time * 0.15;
      meshRef.current.rotation.y = time * 0.2;
      meshRef.current.rotation.z = Math.sin(time * 0.1) * 0.1;
      
      // Dynamic scaling (morphing effect)
      const scaleVal = 1.35 + Math.sin(time * 1.5) * 0.08;
      meshRef.current.scale.set(scaleVal, scaleVal, scaleVal);
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial
        color="#8B5CF6"
        roughness={0.15}
        metalness={0.85}
        wireframe={true}
      />
    </mesh>
  );
}

export default function FloatingOrb({ className = "h-48 w-48" }) {
  return (
    <div className={`relative ${className}`}>
      {/* Background glow shadow */}
      <div className="absolute inset-0 bg-accent/5 rounded-full blur-2xl -z-10 animate-pulse duration-[5000ms]" />
      <Canvas camera={{ position: [0, 0, 3] }}>
        <ambientLight intensity={0.8} />
        <pointLight position={[10, 10, 10]} intensity={1.5} />
        <directionalLight position={[-5, 5, 2]} intensity={1.2} color="#2563EB" />
        <OrbMesh />
      </Canvas>
    </div>
  );
}
