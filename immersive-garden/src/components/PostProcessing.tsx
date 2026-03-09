"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
  Vignette,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";

interface PostProcessingProps {
  scrollProgress: React.MutableRefObject<number>;
}

export default function PostProcessing({ scrollProgress }: PostProcessingProps) {
  const chromaticRef = useRef<any>(null);

  useFrame(() => {
    if (chromaticRef.current) {
      const progress = scrollProgress.current;
      // Increase aberration during fast scroll transitions
      const aberrationStrength = 0.0005 + Math.abs(Math.sin(progress * Math.PI * 4)) * 0.001;
      chromaticRef.current.offset = new THREE.Vector2(aberrationStrength, aberrationStrength);
    }
  });

  return (
    <EffectComposer>
      <Bloom
        intensity={0.8}
        luminanceThreshold={0.2}
        luminanceSmoothing={0.9}
        mipmapBlur
      />
      <ChromaticAberration
        ref={chromaticRef}
        blendFunction={BlendFunction.NORMAL}
        offset={new THREE.Vector2(0.0005, 0.0005)}
      />
      <Vignette eskil={false} offset={0.2} darkness={0.8} />
    </EffectComposer>
  );
}
