"use client";

import { forwardRef, useMemo } from "react";
import * as THREE from "three";
import CubieFace from "./CubieFace";
import type { CubieData } from "@/lib/cubeLogic";
import {
  blackPlasticVertexShader,
  blackPlasticFragmentShader,
} from "@/lib/shaders";

interface CubieProps {
  data: CubieData;
}

const Cubie = forwardRef<THREE.Group, CubieProps>(({ data }, ref) => {
  const { position, faceColors } = data;
  const offset = 0.501; // slight offset so stickers sit on cubie surface

  const blackUniforms = useMemo(
    () => ({
      uLightPosition: { value: new THREE.Vector3(5, 8, 5) },
    }),
    []
  );

  const faces: { color: THREE.Color; pos: [number, number, number]; rot: [number, number, number] }[] = [];

  if (faceColors.px)
    faces.push({ color: faceColors.px, pos: [offset, 0, 0], rot: [0, Math.PI / 2, 0] });
  if (faceColors.nx)
    faces.push({ color: faceColors.nx, pos: [-offset, 0, 0], rot: [0, -Math.PI / 2, 0] });
  if (faceColors.py)
    faces.push({ color: faceColors.py, pos: [0, offset, 0], rot: [-Math.PI / 2, 0, 0] });
  if (faceColors.ny)
    faces.push({ color: faceColors.ny, pos: [0, -offset, 0], rot: [Math.PI / 2, 0, 0] });
  if (faceColors.pz)
    faces.push({ color: faceColors.pz, pos: [0, 0, offset], rot: [0, 0, 0] });
  if (faceColors.nz)
    faces.push({ color: faceColors.nz, pos: [0, 0, -offset], rot: [0, Math.PI, 0] });

  return (
    <group ref={ref} position={[position.x, position.y, position.z]}>
      {/* Black cubie body */}
      <mesh>
        <boxGeometry args={[0.95, 0.95, 0.95]} />
        <shaderMaterial
          vertexShader={blackPlasticVertexShader}
          fragmentShader={blackPlasticFragmentShader}
          uniforms={blackUniforms}
        />
      </mesh>
      {/* Colored sticker faces */}
      {faces.map((face, i) => (
        <CubieFace key={i} color={face.color} position={face.pos} rotation={face.rot} />
      ))}
    </group>
  );
});

Cubie.displayName = "Cubie";
export default Cubie;
