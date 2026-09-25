import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Float, Stars } from '@react-three/drei';
import { useScroll, useTransform } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const Scene = () => {
  const { theme } = useTheme();
  const sphereRef = useRef();
  
  // Use framer-motion for scroll position tracking
  const { scrollYProgress } = useScroll();
  
  // Animate object based on scroll
  useFrame(() => {
    if (sphereRef.current) {
      // Rotate based on scroll and time
      sphereRef.current.rotation.y = scrollYProgress.get() * Math.PI * 4;
      sphereRef.current.position.y = Math.sin(scrollYProgress.get() * Math.PI) * 2;
      sphereRef.current.position.x = Math.cos(scrollYProgress.get() * Math.PI) * 2;
    }
  });

  const sphereColor = theme === 'dark' ? '#06b6d4' : '#22d3ee'; // cyan-500 or cyan-400

  return (
    <>
      <ambientLight intensity={theme === 'dark' ? 0.3 : 0.8} />
      <directionalLight position={[2, 5, 2]} intensity={1} color={theme === 'dark' ? '#ffffff' : '#e2e8f0'} />
      
      {theme === 'dark' && (
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      )}

      <Float speed={2} rotationIntensity={1} floatIntensity={2}>
        <Sphere ref={sphereRef} args={[1, 64, 64]} scale={2.5}>
          <MeshDistortMaterial
            color={sphereColor}
            attach="material"
            distort={0.4}
            speed={1.5}
            roughness={0.2}
            metalness={0.8}
            transparent={true}
            opacity={0.6}
            wireframe={theme === 'light'}
          />
        </Sphere>
      </Float>

      {/* Adding more elements for peak level 3D effect */}
      {Array.from({ length: 15 }).map((_, i) => (
        <Float 
          key={i} 
          speed={1 + Math.random()} 
          rotationIntensity={2} 
          floatIntensity={2}
          position={[
            (Math.random() - 0.5) * 20, 
            (Math.random() - 0.5) * 20, 
            (Math.random() - 0.5) * 10 - 5
          ]}
        >
          <Sphere args={[0.1 + Math.random() * 0.2, 16, 16]}>
             <meshStandardMaterial color={theme === 'dark' ? '#34d399' : '#06b6d4'} opacity={0.5} transparent />
          </Sphere>
        </Float>
      ))}
    </>
  );
};

const Background3D = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none transition-opacity duration-1000">
      <Canvas camera={{ position: [0, 0, 8] }}>
        <Scene />
      </Canvas>
    </div>
  );
};

export default Background3D;
