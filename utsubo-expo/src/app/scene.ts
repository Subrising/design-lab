import * as THREE from "three";
import {
  EffectComposer,
  RenderPass,
  BloomEffect,
  EffectPass,
  KernelSize,
} from "postprocessing";

const PARTICLE_COUNT = 120_000;
const SPAWN_RADIUS = 8;
const MOUSE_RADIUS = 3.5;
const MOUSE_STRENGTH = 18;
const DAMPING = 0.96;
const TURBULENCE_SCALE = 0.08;
const TURBULENCE_STRENGTH = 0.35;
const RETURN_STRENGTH = 0.002;
const MAX_SPEED = 2.5;

/* ── simplex-like noise helpers (cheap 3D curl approximation) ── */
function hash(x: number, y: number, z: number): number {
  let h = x * 374761393 + y * 668265263 + z * 1274126177;
  h = ((h ^ (h >> 13)) * 1103515245) | 0;
  return (h & 0x7fffffff) / 0x7fffffff;
}

function smoothNoise(x: number, y: number, z: number): number {
  const ix = Math.floor(x),
    iy = Math.floor(y),
    iz = Math.floor(z);
  const fx = x - ix,
    fy = y - iy,
    fz = z - iz;
  const sx = fx * fx * (3 - 2 * fx);
  const sy = fy * fy * (3 - 2 * fy);
  const sz = fz * fz * (3 - 2 * fz);

  const n000 = hash(ix, iy, iz);
  const n100 = hash(ix + 1, iy, iz);
  const n010 = hash(ix, iy + 1, iz);
  const n110 = hash(ix + 1, iy + 1, iz);
  const n001 = hash(ix, iy, iz + 1);
  const n101 = hash(ix + 1, iy, iz + 1);
  const n011 = hash(ix, iy + 1, iz + 1);
  const n111 = hash(ix + 1, iy + 1, iz + 1);

  return (
    n000 * (1 - sx) * (1 - sy) * (1 - sz) +
    n100 * sx * (1 - sy) * (1 - sz) +
    n010 * (1 - sx) * sy * (1 - sz) +
    n110 * sx * sy * (1 - sz) +
    n001 * (1 - sx) * (1 - sy) * sz +
    n101 * sx * (1 - sy) * sz +
    n011 * (1 - sx) * sy * sz +
    n111 * sx * sy * sz
  );
}

function curlNoise(
  x: number,
  y: number,
  z: number,
  t: number
): [number, number, number] {
  const e = 0.01;
  const nx = x * TURBULENCE_SCALE + t * 0.15;
  const ny = y * TURBULENCE_SCALE + t * 0.12;
  const nz = z * TURBULENCE_SCALE + t * 0.1;

  const dnx_dy =
    (smoothNoise(nx, ny + e, nz) - smoothNoise(nx, ny - e, nz)) / (2 * e);
  const dnx_dz =
    (smoothNoise(nx, ny, nz + e) - smoothNoise(nx, ny, nz - e)) / (2 * e);
  const dny_dx =
    (smoothNoise(nx + e, ny, nz) - smoothNoise(nx - e, ny, nz)) / (2 * e);
  const dny_dz =
    (smoothNoise(nx, ny, nz + e) - smoothNoise(nx, ny, nz - e)) / (2 * e);
  const dnz_dx =
    (smoothNoise(nx + e, ny, nz) - smoothNoise(nx - e, ny, nz)) / (2 * e);
  const dnz_dy =
    (smoothNoise(nx, ny + e, nz) - smoothNoise(nx, ny - e, nz)) / (2 * e);

  return [dnx_dz - dnz_dy, dnz_dx - dnx_dz, dny_dx - dny_dz];
}

/* ── velocity → color mapping ── */
function velocityToColor(
  speed: number,
  r: Float32Array,
  i: number
): void {
  const t = Math.min(speed / MAX_SPEED, 1);
  // deep blue → cyan → magenta → hot orange-white
  if (t < 0.25) {
    const s = t / 0.25;
    r[i] = 0.02 + s * 0.0;
    r[i + 1] = 0.03 + s * 0.5;
    r[i + 2] = 0.2 + s * 0.6;
  } else if (t < 0.5) {
    const s = (t - 0.25) / 0.25;
    r[i] = 0.02 + s * 0.6;
    r[i + 1] = 0.53 - s * 0.2;
    r[i + 2] = 0.8 - s * 0.1;
  } else if (t < 0.75) {
    const s = (t - 0.5) / 0.25;
    r[i] = 0.62 + s * 0.3;
    r[i + 1] = 0.33 - s * 0.1;
    r[i + 2] = 0.7 - s * 0.4;
  } else {
    const s = (t - 0.75) / 0.25;
    r[i] = 0.92 + s * 0.08;
    r[i + 1] = 0.23 + s * 0.6;
    r[i + 2] = 0.3 + s * 0.4;
  }
}

/* ── custom shader material for instanced particles ── */
function createParticleMaterial(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    vertexShader: /* glsl */ `
      attribute vec3 instanceColorAttr;
      varying vec3 vColor;
      varying float vDist;

      void main() {
        vColor = instanceColorAttr;
        vec4 mvPosition = modelViewMatrix * instanceMatrix * vec4(position, 1.0);
        vDist = -mvPosition.z;
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: /* glsl */ `
      varying vec3 vColor;
      varying float vDist;

      void main() {
        float alpha = smoothstep(40.0, 5.0, vDist) * 0.85;
        // Soft glow falloff
        vec2 uv = gl_PointCoord - 0.5;
        float d = length(uv);
        float glow = exp(-d * 4.0) * 0.8 + smoothstep(0.5, 0.0, d) * 0.5;
        gl_FragColor = vec4(vColor * glow * 1.8, alpha * glow);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
}

export function initScene(container: HTMLElement): () => void {
  /* ── renderer + scene + camera ── */
  const renderer = new THREE.WebGLRenderer({
    antialias: false,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x020208, 1);
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x020208, 0.04);

  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  camera.position.set(0, 0, 15);

  /* ── post-processing (bloom) ── */
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));

  const bloom = new BloomEffect({
    intensity: 1.8,
    luminanceThreshold: 0.1,
    luminanceSmoothing: 0.4,
    kernelSize: KernelSize.LARGE,
    mipmapBlur: true,
  });
  composer.addPass(new EffectPass(camera, bloom));

  /* ── particle buffers ── */
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  const velocities = new Float32Array(PARTICLE_COUNT * 3);
  const homePositions = new Float32Array(PARTICLE_COUNT * 3);
  const colors = new Float32Array(PARTICLE_COUNT * 3);

  // Initialize particles in a sphere
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const i3 = i * 3;
    // Distribute in a sphere using rejection sampling for uniform density
    let x: number, y: number, z: number;
    do {
      x = (Math.random() * 2 - 1) * SPAWN_RADIUS;
      y = (Math.random() * 2 - 1) * SPAWN_RADIUS;
      z = (Math.random() * 2 - 1) * SPAWN_RADIUS;
    } while (x * x + y * y + z * z > SPAWN_RADIUS * SPAWN_RADIUS);

    positions[i3] = homePositions[i3] = x;
    positions[i3 + 1] = homePositions[i3 + 1] = y;
    positions[i3 + 2] = homePositions[i3 + 2] = z;

    velocities[i3] = (Math.random() - 0.5) * 0.1;
    velocities[i3 + 1] = (Math.random() - 0.5) * 0.1;
    velocities[i3 + 2] = (Math.random() - 0.5) * 0.1;

    colors[i3] = 0.02;
    colors[i3 + 1] = 0.03;
    colors[i3 + 2] = 0.2;
  }

  /* ── instanced mesh ── */
  const geo = new THREE.SphereGeometry(0.015, 4, 3);
  const mat = createParticleMaterial();

  const colorAttr = new THREE.InstancedBufferAttribute(colors, 3);
  colorAttr.setUsage(THREE.DynamicDrawUsage);
  geo.setAttribute("instanceColorAttr", colorAttr);

  const mesh = new THREE.InstancedMesh(geo, mat, PARTICLE_COUNT);
  mesh.frustumCulled = false;
  scene.add(mesh);

  // Set initial instance matrices
  const dummy = new THREE.Object3D();
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const i3 = i * 3;
    dummy.position.set(positions[i3], positions[i3 + 1], positions[i3 + 2]);
    dummy.updateMatrix();
    mesh.setMatrixAt(i, dummy.matrix);
  }
  mesh.instanceMatrix.needsUpdate = true;

  /* ── mouse tracking ── */
  const mouse = new THREE.Vector2(9999, 9999);
  const mouseWorld = new THREE.Vector3();
  const raycaster = new THREE.Raycaster();
  const mousePlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);

  function onMouseMove(e: MouseEvent) {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    raycaster.ray.intersectPlane(mousePlane, mouseWorld);
  }

  function onTouchMove(e: TouchEvent) {
    if (e.touches.length > 0) {
      mouse.x = (e.touches[0].clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.touches[0].clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      raycaster.ray.intersectPlane(mousePlane, mouseWorld);
    }
  }

  window.addEventListener("mousemove", onMouseMove);
  window.addEventListener("touchmove", onTouchMove, { passive: true });

  /* ── resize ── */
  function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
  }
  window.addEventListener("resize", onResize);

  /* ── animation loop ── */
  let time = 0;
  let animId = 0;
  const tempMatrix = new THREE.Matrix4();

  function animate() {
    animId = requestAnimationFrame(animate);
    const dt = 0.016; // ~60fps target
    time += dt;

    const mx = mouseWorld.x;
    const my = mouseWorld.y;
    const mz = mouseWorld.z;
    const mouseRadiusSq = MOUSE_RADIUS * MOUSE_RADIUS;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      const px = positions[i3];
      const py = positions[i3 + 1];
      const pz = positions[i3 + 2];

      // Mouse force
      const dx = px - mx;
      const dy = py - my;
      const dz = pz - mz;
      const distSq = dx * dx + dy * dy + dz * dz;

      if (distSq < mouseRadiusSq && distSq > 0.001) {
        const dist = Math.sqrt(distSq);
        const force =
          (MOUSE_STRENGTH * (1 - dist / MOUSE_RADIUS)) / dist;
        velocities[i3] += dx * force * dt;
        velocities[i3 + 1] += dy * force * dt;
        velocities[i3 + 2] += dz * force * dt;
      }

      // Curl noise turbulence
      const [cx, cy, cz] = curlNoise(px, py, pz, time);
      velocities[i3] += cx * TURBULENCE_STRENGTH * dt;
      velocities[i3 + 1] += cy * TURBULENCE_STRENGTH * dt;
      velocities[i3 + 2] += cz * TURBULENCE_STRENGTH * dt;

      // Return to home (spring)
      velocities[i3] += (homePositions[i3] - px) * RETURN_STRENGTH;
      velocities[i3 + 1] += (homePositions[i3 + 1] - py) * RETURN_STRENGTH;
      velocities[i3 + 2] += (homePositions[i3 + 2] - pz) * RETURN_STRENGTH;

      // Damping
      velocities[i3] *= DAMPING;
      velocities[i3 + 1] *= DAMPING;
      velocities[i3 + 2] *= DAMPING;

      // Speed cap
      const speed = Math.sqrt(
        velocities[i3] ** 2 +
          velocities[i3 + 1] ** 2 +
          velocities[i3 + 2] ** 2
      );
      if (speed > MAX_SPEED) {
        const scale = MAX_SPEED / speed;
        velocities[i3] *= scale;
        velocities[i3 + 1] *= scale;
        velocities[i3 + 2] *= scale;
      }

      // Integrate
      positions[i3] += velocities[i3] * dt;
      positions[i3 + 1] += velocities[i3 + 1] * dt;
      positions[i3 + 2] += velocities[i3 + 2] * dt;

      // Update color from velocity
      velocityToColor(speed, colors, i3);

      // Update instance matrix
      tempMatrix.makeTranslation(
        positions[i3],
        positions[i3 + 1],
        positions[i3 + 2]
      );
      mesh.setMatrixAt(i, tempMatrix);
    }

    mesh.instanceMatrix.needsUpdate = true;
    colorAttr.needsUpdate = true;

    // Gentle camera drift
    camera.position.x = Math.sin(time * 0.1) * 1.5;
    camera.position.y = Math.cos(time * 0.08) * 1.0;
    camera.lookAt(0, 0, 0);

    composer.render();
  }

  animate();

  /* ── cleanup ── */
  return () => {
    cancelAnimationFrame(animId);
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("touchmove", onTouchMove);
    window.removeEventListener("resize", onResize);
    renderer.dispose();
    composer.dispose();
    geo.dispose();
    mat.dispose();
    if (container.contains(renderer.domElement)) {
      container.removeChild(renderer.domElement);
    }
  };
}
