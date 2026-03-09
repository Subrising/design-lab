import * as THREE from "three";
import gsap from "gsap";

/* ---------- constants ---------- */
const PARTICLE_COUNT = 8192;
const TEX_SIZE = Math.ceil(Math.sqrt(PARTICLE_COUNT)); // 91 → 91x91 = 8281 pixels
const SPREAD = 30;
const MOUSE_RADIUS = 8;
const MOUSE_STRENGTH = 4;

/* ---------- shaders ---------- */
const vertexShader = /* glsl */ `
  uniform sampler2D uPositionTex;
  uniform float uTexSize;
  uniform float uTime;
  uniform vec3 uMouse3D;
  uniform float uMouseRadius;
  uniform float uMouseStrength;

  attribute float aIndex;
  attribute float aScale;
  attribute vec3 aColor;

  varying vec3 vColor;
  varying float vDist;
  varying float vFog;

  void main() {
    // Read base position from data texture
    float idx = aIndex;
    float u = mod(idx, uTexSize) / uTexSize;
    float v = floor(idx / uTexSize) / uTexSize;
    vec4 posData = texture2D(uPositionTex, vec2(u, v));
    vec3 basePos = posData.xyz;

    // Organic motion: layered sine waves
    float t = uTime * 0.3;
    vec3 offset = vec3(
      sin(basePos.y * 0.5 + t) * cos(basePos.z * 0.3 + t * 0.7) * 0.8,
      cos(basePos.x * 0.4 + t * 0.8) * sin(basePos.z * 0.6 + t * 0.5) * 0.6,
      sin(basePos.x * 0.3 + t * 0.6) * cos(basePos.y * 0.5 + t * 0.9) * 0.7
    );

    vec3 pos = basePos + offset;

    // Mouse displacement
    float dist = distance(pos, uMouse3D);
    float influence = smoothstep(uMouseRadius, 0.0, dist);
    vec3 pushDir = normalize(pos - uMouse3D + vec3(0.001));
    pos += pushDir * influence * uMouseStrength;

    // Scale based on distance to mouse (reactive sizing)
    float scaleMul = 1.0 + influence * 1.5;

    // Transform the vertex position of the geometry
    vec3 transformed = position * aScale * scaleMul + pos;

    vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    // Pass to fragment
    vColor = aColor;
    vDist = influence;
    vFog = smoothstep(60.0, 5.0, -mvPosition.z);
  }
`;

const fragmentShader = /* glsl */ `
  uniform float uTime;
  varying vec3 vColor;
  varying float vDist;
  varying float vFog;

  void main() {
    // Mix color toward white near mouse
    vec3 col = mix(vColor, vec3(1.0), vDist * 0.6);

    // Atmospheric fog blend toward background
    vec3 fogColor = vec3(0.02, 0.02, 0.06);
    col = mix(fogColor, col, vFog);

    // Subtle glow at edges
    float alpha = vFog * 0.85 + 0.15;

    gl_FragColor = vec4(col, alpha);
  }
`;

/* ---------- helpers ---------- */
function createDataTexture(): THREE.DataTexture {
  const size = TEX_SIZE * TEX_SIZE;
  const data = new Float32Array(size * 4);

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    // Distribute in interesting formations: sphere + tendrils
    const phi = Math.random() * Math.PI * 2;
    const cosTheta = Math.random() * 2 - 1;
    const sinTheta = Math.sqrt(1 - cosTheta * cosTheta);
    const r = Math.pow(Math.random(), 0.5) * SPREAD * 0.5;

    // Base sphere position
    let x = r * sinTheta * Math.cos(phi);
    let y = r * sinTheta * Math.sin(phi);
    let z = r * cosTheta;

    // Add tendrils / filaments (30% of particles)
    if (Math.random() < 0.3) {
      const angle = Math.random() * Math.PI * 2;
      const tendrilR = SPREAD * 0.3 + Math.random() * SPREAD * 0.4;
      const height = (Math.random() - 0.5) * SPREAD * 0.6;
      x = Math.cos(angle + height * 0.1) * tendrilR;
      y = height;
      z = Math.sin(angle + height * 0.1) * tendrilR;
    }

    // Ring structures (20% of particles)
    if (Math.random() < 0.2) {
      const ringAngle = Math.random() * Math.PI * 2;
      const ringR = SPREAD * 0.35 + Math.random() * 2;
      const ringY = Math.sin(ringAngle * 3) * 2;
      x = Math.cos(ringAngle) * ringR;
      y = ringY;
      z = Math.sin(ringAngle) * ringR;
    }

    const idx = i * 4;
    data[idx] = x;
    data[idx + 1] = y;
    data[idx + 2] = z;
    data[idx + 3] = 1.0;
  }

  const tex = new THREE.DataTexture(
    data,
    TEX_SIZE,
    TEX_SIZE,
    THREE.RGBAFormat,
    THREE.FloatType
  );
  tex.needsUpdate = true;
  return tex;
}

function generatePalette(): THREE.Color[] {
  // Samsy-inspired palette: deep blues, purples, cyan, warm accents
  return [
    new THREE.Color(0.1, 0.15, 0.8), // deep blue
    new THREE.Color(0.6, 0.1, 0.9), // vibrant purple
    new THREE.Color(0.0, 0.7, 0.9), // cyan
    new THREE.Color(0.9, 0.3, 0.5), // warm pink
    new THREE.Color(0.1, 0.9, 0.6), // emerald
    new THREE.Color(0.95, 0.6, 0.1), // amber
    new THREE.Color(0.3, 0.2, 0.95), // indigo
  ];
}

/* ---------- main scene ---------- */
export function initScene(container: HTMLDivElement): () => void {
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setClearColor(0x050510, 1);
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x050510, 0.02);

  const camera = new THREE.PerspectiveCamera(
    60,
    container.clientWidth / container.clientHeight,
    0.1,
    200
  );
  camera.position.set(0, 5, 35);
  camera.lookAt(0, 0, 0);

  /* ---------- lighting ---------- */
  const ambient = new THREE.AmbientLight(0x222244, 0.5);
  scene.add(ambient);

  const pointLight1 = new THREE.PointLight(0x4466ff, 40, 60);
  pointLight1.position.set(10, 15, 10);
  scene.add(pointLight1);

  const pointLight2 = new THREE.PointLight(0xff4488, 30, 50);
  pointLight2.position.set(-15, -5, -10);
  scene.add(pointLight2);

  const pointLight3 = new THREE.PointLight(0x00ffaa, 20, 40);
  pointLight3.position.set(5, -10, 15);
  scene.add(pointLight3);

  /* ---------- data texture ---------- */
  const positionTexture = createDataTexture();

  /* ---------- instanced geometry ---------- */
  // Mix of geometries for visual variety
  const geometries = [
    new THREE.IcosahedronGeometry(0.12, 0),
    new THREE.OctahedronGeometry(0.1, 0),
    new THREE.TetrahedronGeometry(0.13, 0),
  ];

  const palette = generatePalette();
  const mouse3D = new THREE.Vector3(100, 100, 100); // start offscreen

  // Create instanced meshes for each geometry type
  const meshes: THREE.Mesh[] = [];
  const materials: THREE.ShaderMaterial[] = [];

  const countPerGeo = Math.floor(PARTICLE_COUNT / geometries.length);

  geometries.forEach((geo, geoIdx) => {
    const count = geoIdx === geometries.length - 1
      ? PARTICLE_COUNT - countPerGeo * geoIdx
      : countPerGeo;

    // Build buffer attributes
    const indices = new Float32Array(count);
    const scales = new Float32Array(count);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const globalIdx = geoIdx * countPerGeo + i;
      indices[i] = globalIdx;
      scales[i] = 0.5 + Math.random() * 1.5;

      const col = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
    }

    // Clone geometry and add instanced-like attributes
    // We use a merged approach: create a BufferGeometry with repeated geo + custom attributes
    const basePositions = geo.attributes.position.array as Float32Array;
    const baseIndicesArr = geo.index ? (geo.index.array as Uint16Array) : null;
    const vertPerInstance = basePositions.length / 3;
    const idxPerInstance = baseIndicesArr ? baseIndicesArr.length : vertPerInstance;

    const totalVerts = count * vertPerInstance;
    const totalIndices = count * idxPerInstance;

    const mergedPos = new Float32Array(totalVerts * 3);
    const mergedIdx = new Uint32Array(totalIndices);
    const mergedAIndex = new Float32Array(totalVerts);
    const mergedAScale = new Float32Array(totalVerts);
    const mergedAColor = new Float32Array(totalVerts * 3);

    for (let i = 0; i < count; i++) {
      const vOffset = i * vertPerInstance;
      const iOffset = i * idxPerInstance;

      // Copy vertex positions
      for (let v = 0; v < vertPerInstance; v++) {
        mergedPos[(vOffset + v) * 3] = basePositions[v * 3];
        mergedPos[(vOffset + v) * 3 + 1] = basePositions[v * 3 + 1];
        mergedPos[(vOffset + v) * 3 + 2] = basePositions[v * 3 + 2];

        mergedAIndex[vOffset + v] = indices[i];
        mergedAScale[vOffset + v] = scales[i];
        mergedAColor[(vOffset + v) * 3] = colors[i * 3];
        mergedAColor[(vOffset + v) * 3 + 1] = colors[i * 3 + 1];
        mergedAColor[(vOffset + v) * 3 + 2] = colors[i * 3 + 2];
      }

      // Copy indices
      if (baseIndicesArr) {
        for (let j = 0; j < idxPerInstance; j++) {
          mergedIdx[iOffset + j] = baseIndicesArr[j] + vOffset;
        }
      }
    }

    const mergedGeo = new THREE.BufferGeometry();
    mergedGeo.setAttribute("position", new THREE.BufferAttribute(mergedPos, 3));
    mergedGeo.setAttribute("aIndex", new THREE.BufferAttribute(mergedAIndex, 1));
    mergedGeo.setAttribute("aScale", new THREE.BufferAttribute(mergedAScale, 1));
    mergedGeo.setAttribute("aColor", new THREE.BufferAttribute(mergedAColor, 3));
    if (baseIndicesArr) {
      mergedGeo.setIndex(new THREE.BufferAttribute(mergedIdx, 1));
    }

    const mat = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uPositionTex: { value: positionTexture },
        uTexSize: { value: TEX_SIZE },
        uTime: { value: 0 },
        uMouse3D: { value: mouse3D },
        uMouseRadius: { value: MOUSE_RADIUS },
        uMouseStrength: { value: MOUSE_STRENGTH },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    });

    const mesh = new THREE.Mesh(mergedGeo, mat);
    mesh.frustumCulled = false;
    scene.add(mesh);
    meshes.push(mesh);
    materials.push(mat);
  });

  // Clean up source geometries
  geometries.forEach((g) => g.dispose());

  /* ---------- background particles (tiny dots) ---------- */
  const bgCount = 2000;
  const bgGeo = new THREE.BufferGeometry();
  const bgPositions = new Float32Array(bgCount * 3);
  const bgSizes = new Float32Array(bgCount);
  for (let i = 0; i < bgCount; i++) {
    bgPositions[i * 3] = (Math.random() - 0.5) * 80;
    bgPositions[i * 3 + 1] = (Math.random() - 0.5) * 80;
    bgPositions[i * 3 + 2] = (Math.random() - 0.5) * 80;
    bgSizes[i] = Math.random() * 2 + 0.5;
  }
  bgGeo.setAttribute("position", new THREE.BufferAttribute(bgPositions, 3));
  bgGeo.setAttribute("size", new THREE.BufferAttribute(bgSizes, 1));

  const bgMat = new THREE.ShaderMaterial({
    vertexShader: /* glsl */ `
      attribute float size;
      varying float vAlpha;
      void main() {
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = size * (200.0 / -mv.z);
        gl_Position = projectionMatrix * mv;
        vAlpha = smoothstep(80.0, 10.0, -mv.z) * 0.4;
      }
    `,
    fragmentShader: /* glsl */ `
      varying float vAlpha;
      void main() {
        float d = length(gl_PointCoord - 0.5) * 2.0;
        float a = smoothstep(1.0, 0.3, d) * vAlpha;
        gl_FragColor = vec4(0.4, 0.5, 0.9, a);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const bgPoints = new THREE.Points(bgGeo, bgMat);
  scene.add(bgPoints);

  /* ---------- GSAP camera orbit ---------- */
  const cameraTarget = { theta: 0, phi: 0.3, radius: 35, lookY: 0 };

  // Continuous slow orbit
  gsap.to(cameraTarget, {
    theta: Math.PI * 2,
    duration: 90,
    ease: "none",
    repeat: -1,
  });

  // Gentle vertical oscillation
  gsap.to(cameraTarget, {
    phi: 0.6,
    duration: 15,
    ease: "sine.inOut",
    yoyo: true,
    repeat: -1,
  });

  // Zoom pulses
  gsap.to(cameraTarget, {
    radius: 25,
    duration: 20,
    ease: "sine.inOut",
    yoyo: true,
    repeat: -1,
  });

  // Look target drift
  gsap.to(cameraTarget, {
    lookY: 3,
    duration: 12,
    ease: "sine.inOut",
    yoyo: true,
    repeat: -1,
  });

  /* ---------- mouse tracking ---------- */
  const mouseNDC = new THREE.Vector2(0, 0);
  const raycaster = new THREE.Raycaster();
  const mousePlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
  const mouseWorldPos = new THREE.Vector3();

  function onMouseMove(e: MouseEvent) {
    mouseNDC.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouseNDC.y = -(e.clientY / window.innerHeight) * 2 + 1;
  }

  function onTouchMove(e: TouchEvent) {
    if (e.touches.length > 0) {
      mouseNDC.x = (e.touches[0].clientX / window.innerWidth) * 2 - 1;
      mouseNDC.y = -(e.touches[0].clientY / window.innerHeight) * 2 + 1;
    }
  }

  window.addEventListener("mousemove", onMouseMove);
  window.addEventListener("touchmove", onTouchMove, { passive: true });

  /* ---------- resize ---------- */
  function onResize() {
    const w = container.clientWidth;
    const h = container.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }
  window.addEventListener("resize", onResize);

  /* ---------- animation loop ---------- */
  let time = 0;
  let rafId = 0;

  function animate() {
    rafId = requestAnimationFrame(animate);
    time += 0.016;

    // Update camera from GSAP-driven values
    camera.position.x = Math.sin(cameraTarget.theta) * Math.cos(cameraTarget.phi) * cameraTarget.radius;
    camera.position.y = Math.sin(cameraTarget.phi) * cameraTarget.radius * 0.4;
    camera.position.z = Math.cos(cameraTarget.theta) * Math.cos(cameraTarget.phi) * cameraTarget.radius;
    camera.lookAt(0, cameraTarget.lookY, 0);

    // Update mouse plane to face camera
    mousePlane.normal.copy(camera.getWorldDirection(new THREE.Vector3()));
    mousePlane.constant = 0;
    raycaster.setFromCamera(mouseNDC, camera);
    raycaster.ray.intersectPlane(mousePlane, mouseWorldPos);
    mouse3D.lerp(mouseWorldPos, 0.08);

    // Animate point lights
    pointLight1.position.x = Math.sin(time * 0.4) * 15;
    pointLight1.position.z = Math.cos(time * 0.3) * 12;
    pointLight2.position.y = Math.cos(time * 0.5) * 10;
    pointLight2.position.x = Math.sin(time * 0.2) * -12;
    pointLight3.position.z = Math.sin(time * 0.35) * 15;

    // Rotate background particles slowly
    bgPoints.rotation.y = time * 0.02;
    bgPoints.rotation.x = Math.sin(time * 0.1) * 0.1;

    // Update uniforms
    for (const mat of materials) {
      mat.uniforms.uTime.value = time;
    }

    renderer.render(scene, camera);
  }

  animate();

  /* ---------- cleanup ---------- */
  return () => {
    cancelAnimationFrame(rafId);
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("touchmove", onTouchMove);
    window.removeEventListener("resize", onResize);
    gsap.killTweensOf(cameraTarget);

    for (const mesh of meshes) {
      mesh.geometry.dispose();
      (mesh.material as THREE.ShaderMaterial).dispose();
    }
    bgGeo.dispose();
    bgMat.dispose();
    positionTexture.dispose();
    renderer.dispose();

    if (renderer.domElement.parentNode) {
      renderer.domElement.parentNode.removeChild(renderer.domElement);
    }
  };
}
