import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, RoundedBox } from '@react-three/drei';

export default function FloatingChocolate(props) {
  const mesh = useRef();
  const [hovered, setHover] = useState(false);
  
  useFrame((state, delta) => {
    if(mesh.current) {
        mesh.current.rotation.x += delta * 0.2;
        mesh.current.rotation.y += delta * 0.3;
        mesh.current.rotation.z += delta * 0.1;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
      <mesh
        {...props}
        ref={mesh}
        scale={hovered ? 1.1 : 1}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
      >
        {/* Rounded Box gives a nicer, more premium chocolate bar look than a sharp cube */}
        <RoundedBox args={[1, 1, 0.4]} radius={0.1} smoothness={4}>
            <meshPhysicalMaterial 
                color={hovered ? "#795548" : "#4E342E"} 
                roughness={0.2} 
                metalness={0.1}
                clearcoat={0.5}
                clearcoatRoughness={0.1}
            />
        </RoundedBox>
      </mesh>
    </Float>
  );
}
