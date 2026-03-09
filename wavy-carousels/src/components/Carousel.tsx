"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import GLImage from "./GLImage";

const IMAGE_COUNT = 12;
const IMAGES = Array.from(
  { length: IMAGE_COUNT },
  (_, i) => `/wavy-carousels/images/img${i + 1}.webp`
);

interface CarouselProps {
  xOffset?: number;
  imageSize?: [number, number];
  gap?: number;
  curveStrength?: number;
  curveFrequency?: number;
  wheelFactor?: number;
  wheelDirection?: number;
  scrollSpeed: React.MutableRefObject<number>;
  groupRotation?: [number, number, number];
}

export default function Carousel({
  xOffset = 0,
  imageSize = [2, 3],
  gap = 0.3,
  curveStrength = 1,
  curveFrequency = 0.25,
  wheelFactor = 1,
  wheelDirection = 1,
  scrollSpeed,
  groupRotation = [0, 0, 0],
}: CarouselProps) {
  const groupRef = useRef<THREE.Group>(null!);
  const totalHeight = IMAGE_COUNT * (imageSize[1] + gap);

  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.children.forEach((child) => {
      if (child instanceof THREE.Mesh) {
        child.position.y -=
          scrollSpeed.current * 0.005 * wheelFactor * wheelDirection;
      }
    });
  });

  return (
    <group
      ref={groupRef}
      position={[xOffset, 0, 0]}
      rotation={groupRotation}
    >
      {IMAGES.map((url, i) => {
        const y = i * (imageSize[1] + gap) - totalHeight / 2;
        return (
          <GLImage
            key={i}
            url={url}
            position={[0, y, 0]}
            size={imageSize}
            scrollSpeed={scrollSpeed}
            curveStrength={curveStrength}
            curveFrequency={curveFrequency}
            totalHeight={totalHeight}
            wheelDirection={wheelDirection}
          />
        );
      })}
    </group>
  );
}
