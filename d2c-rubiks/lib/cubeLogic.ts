import * as THREE from "three";

// Standard Rubik's cube colors per face
export const FACE_COLORS: Record<string, THREE.Color> = {
  right: new THREE.Color(0xc41e3a), // Red
  left: new THREE.Color(0xff5800), // Orange
  top: new THREE.Color(0xffffff), // White
  bottom: new THREE.Color(0xffd500), // Yellow
  front: new THREE.Color(0x009b48), // Green
  back: new THREE.Color(0x0051ba), // Blue
};

export type Axis = "x" | "y" | "z";
export type LayerIndex = -1 | 0 | 1;

export interface CubieData {
  id: string;
  position: THREE.Vector3;
  faceColors: {
    px?: THREE.Color; // +x face
    nx?: THREE.Color; // -x face
    py?: THREE.Color; // +y face
    ny?: THREE.Color; // -y face
    pz?: THREE.Color; // +z face
    nz?: THREE.Color; // -z face
  };
}

// Generate the 26 visible cubies (not center)
export function generateCubies(): CubieData[] {
  const cubies: CubieData[] = [];
  const spacing = 1.05;

  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        if (x === 0 && y === 0 && z === 0) continue; // skip center

        const faceColors: CubieData["faceColors"] = {};
        if (x === 1) faceColors.px = FACE_COLORS.right;
        if (x === -1) faceColors.nx = FACE_COLORS.left;
        if (y === 1) faceColors.py = FACE_COLORS.top;
        if (y === -1) faceColors.ny = FACE_COLORS.bottom;
        if (z === 1) faceColors.pz = FACE_COLORS.front;
        if (z === -1) faceColors.nz = FACE_COLORS.back;

        cubies.push({
          id: `cubie_${x}_${y}_${z}`,
          position: new THREE.Vector3(
            x * spacing,
            y * spacing,
            z * spacing
          ),
          faceColors,
        });
      }
    }
  }

  return cubies;
}

// Determine which layer a cubie belongs to for a given axis rotation
export function getCubiesInLayer(
  cubies: THREE.Object3D[],
  axis: Axis,
  layer: LayerIndex,
  tolerance = 0.3
): THREE.Object3D[] {
  return cubies.filter((cubie) => {
    const worldPos = new THREE.Vector3();
    cubie.getWorldPosition(worldPos);
    const val = worldPos[axis];
    return Math.abs(val - layer * 1.05) < tolerance;
  });
}

// Detect which face/layer the user clicked
export function detectFaceLayer(
  point: THREE.Vector3,
  normal: THREE.Vector3
): { axis: Axis; layer: LayerIndex } | null {
  const absNormal = new THREE.Vector3(
    Math.abs(normal.x),
    Math.abs(normal.y),
    Math.abs(normal.z)
  );

  let axis: Axis;
  if (absNormal.x > absNormal.y && absNormal.x > absNormal.z) {
    axis = "x";
  } else if (absNormal.y > absNormal.x && absNormal.y > absNormal.z) {
    axis = "y";
  } else {
    axis = "z";
  }

  const val = point[axis];
  let layer: LayerIndex;
  if (val > 0.5) layer = 1;
  else if (val < -0.5) layer = -1;
  else layer = 0;

  return { axis, layer };
}

// Determine rotation axis from drag direction on a face
export function getDragRotationAxis(
  faceNormal: THREE.Vector3,
  dragDelta: THREE.Vector2
): Axis {
  // Simplified: pick the axis perpendicular to face normal that aligns most with drag
  const absNx = Math.abs(faceNormal.x);
  const absNy = Math.abs(faceNormal.y);
  const absNz = Math.abs(faceNormal.z);

  if (absNx > absNy && absNx > absNz) {
    // Clicked on x-face: rotate around y or z
    return Math.abs(dragDelta.y) > Math.abs(dragDelta.x) ? "z" : "y";
  } else if (absNy > absNx && absNy > absNz) {
    // Clicked on y-face: rotate around x or z
    return Math.abs(dragDelta.x) > Math.abs(dragDelta.y) ? "z" : "x";
  } else {
    // Clicked on z-face: rotate around x or y
    return Math.abs(dragDelta.y) > Math.abs(dragDelta.x) ? "x" : "y";
  }
}
