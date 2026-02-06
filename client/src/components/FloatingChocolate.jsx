import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';

export default function FloatingChocolate(props) {
  const mesh = useRef();
  const [hovered, setHover] = useState(false);
  
  useFrame((state, delta) => {
    if(mesh.current) {
        mesh.current.rotation.x += delta * 0.5;
        mesh.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={1} floatIntensity={2}>
      <mesh
        {...props}
        ref={mesh}
        scale={hovered ? 1.2 : 1}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial 
            color={hovered ? "#8D6E63" : "#5D4037"} 
            roughness={0.3} 
            metalness={0.1}
        />
      </mesh>
    </Float>
  );
}
