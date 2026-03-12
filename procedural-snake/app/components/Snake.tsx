"use client";

import {
  useRef,
  useMemo,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useCallback,
} from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const SNAKE_SPEED = 0.15;
const TURN_SPEED = 0.04;
const SEGMENT_COUNT = 200;
const TUBE_RADIUS = 0.35;
const RADIAL_SEGMENTS = 12;
const FOOD_COUNT = 8;
const FOOD_RADIUS = 60;
const EAT_DISTANCE = 2.5;

// Snake skin vertex shader
const snakeVertexShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vWorldPos;
  varying float vFresnel;

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPos = worldPos.xyz;

    vec3 viewDir = normalize(cameraPosition - worldPos.xyz);
    vFresnel = pow(1.0 - max(dot(viewDir, vNormal), 0.0), 3.0);

    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

// Snake skin fragment shader — diamond scale pattern
const snakeFragmentShader = `
  uniform float uTime;
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform vec3 uColor3;
  uniform float uLength;

  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vWorldPos;
  varying float vFresnel;

  float scalePattern(vec2 uv) {
    float scaleX = 30.0;
    float scaleY = 8.0;

    vec2 cell = vec2(uv.x * scaleX, uv.y * scaleY);

    // Offset every other row
    float row = floor(cell.y);
    cell.x += mod(row, 2.0) * 0.5;

    vec2 f = fract(cell) - 0.5;

    // Diamond shape
    float d = abs(f.x) + abs(f.y);

    // Scale edge
    float scale = smoothstep(0.5, 0.42, d);

    // Inner detail
    float inner = smoothstep(0.25, 0.15, d);

    return scale * 0.8 + inner * 0.2;
  }

  void main() {
    float scales = scalePattern(vUv);

    // Color gradient along body
    float bodyGrad = vUv.x;
    vec3 baseColor = mix(uColor1, uColor2, bodyGrad);

    // Scale highlighting
    float highlight = scales * 0.6 + 0.4;
    vec3 scaleColor = mix(baseColor * 0.6, baseColor * 1.4, scales);

    // Belly lighter color
    float belly = smoothstep(0.3, 0.7, vUv.y);
    scaleColor = mix(scaleColor, uColor3, belly * 0.3);

    // Shimmer
    float shimmer = sin(vUv.x * 60.0 + uTime * 2.0) * 0.05 + 0.95;
    scaleColor *= shimmer;

    // Fresnel rim light
    vec3 rimColor = vec3(0.4, 0.8, 1.0);
    scaleColor += rimColor * vFresnel * 0.5;

    // Head glow
    float headGlow = smoothstep(0.05, 0.0, vUv.x) * 0.5;
    scaleColor += vec3(0.3, 1.0, 0.5) * headGlow;

    gl_FragColor = vec4(scaleColor, 1.0);
  }
`;

interface FoodOrb {
  position: THREE.Vector3;
  active: boolean;
}

interface SnakeProps {
  started: boolean;
  gameOver: boolean;
  onScore: (pts: number) => void;
  onGameOver: () => void;
}

const Snake = forwardRef<{ reset: () => void }, SnakeProps>(
  ({ started, gameOver, onScore, onGameOver }, ref) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const headRef = useRef<THREE.Mesh>(null);
    const eyeLeftRef = useRef<THREE.Mesh>(null);
    const eyeRightRef = useRef<THREE.Mesh>(null);
    const foodGroupRef = useRef<THREE.Group>(null);
    const { camera } = useThree();

    // Snake state
    const stateRef = useRef({
      points: [] as THREE.Vector3[],
      direction: new THREE.Vector3(0, 0, 1),
      headPos: new THREE.Vector3(0, 1, 0),
      targetAngle: 0,
      currentAngle: 0,
      verticalAngle: 0,
      targetVerticalAngle: 0,
      speed: SNAKE_SPEED,
      length: SEGMENT_COUNT,
      keys: { left: false, right: false, up: false, down: false },
      mouseX: 0,
      mouseY: 0,
      useMouse: false,
      foods: [] as FoodOrb[],
      time: 0,
      cameraPos: new THREE.Vector3(0, 8, -15),
      cameraTarget: new THREE.Vector3(0, 1, 0),
      initialized: false,
    });

    const spawnFood = useCallback((index: number) => {
      const state = stateRef.current;
      const angle = Math.random() * Math.PI * 2;
      const dist = 10 + Math.random() * FOOD_RADIUS;
      const pos = new THREE.Vector3(
        state.headPos.x + Math.cos(angle) * dist,
        0.5 + Math.random() * 3,
        state.headPos.z + Math.sin(angle) * dist
      );
      if (state.foods[index]) {
        state.foods[index].position.copy(pos);
        state.foods[index].active = true;
      } else {
        state.foods[index] = { position: pos, active: true };
      }
    }, []);

    const initSnake = useCallback(() => {
      const state = stateRef.current;
      state.points = [];
      state.headPos.set(0, 1, 0);
      state.direction.set(0, 0, 1);
      state.currentAngle = 0;
      state.targetAngle = 0;
      state.verticalAngle = 0;
      state.targetVerticalAngle = 0;
      state.length = SEGMENT_COUNT;
      state.time = 0;

      for (let i = 0; i < SEGMENT_COUNT; i++) {
        state.points.push(
          new THREE.Vector3(0, 1, -i * (SNAKE_SPEED * 0.5))
        );
      }

      state.foods = [];
      for (let i = 0; i < FOOD_COUNT; i++) {
        spawnFood(i);
      }
      state.initialized = true;
    }, [spawnFood]);

    useImperativeHandle(ref, () => ({
      reset: initSnake,
    }));

    // Initialize
    useEffect(() => {
      initSnake();
    }, [initSnake]);

    // Keyboard controls
    useEffect(() => {
      const state = stateRef.current;
      const onKeyDown = (e: KeyboardEvent) => {
        switch (e.key) {
          case "ArrowLeft":
          case "a":
          case "A":
            state.keys.left = true;
            state.useMouse = false;
            break;
          case "ArrowRight":
          case "d":
          case "D":
            state.keys.right = true;
            state.useMouse = false;
            break;
          case "ArrowUp":
          case "w":
          case "W":
            state.keys.up = true;
            state.useMouse = false;
            break;
          case "ArrowDown":
          case "s":
          case "S":
            state.keys.down = true;
            state.useMouse = false;
            break;
        }
      };
      const onKeyUp = (e: KeyboardEvent) => {
        switch (e.key) {
          case "ArrowLeft":
          case "a":
          case "A":
            state.keys.left = false;
            break;
          case "ArrowRight":
          case "d":
          case "D":
            state.keys.right = false;
            break;
          case "ArrowUp":
          case "w":
          case "W":
            state.keys.up = false;
            break;
          case "ArrowDown":
          case "s":
          case "S":
            state.keys.down = false;
            break;
        }
      };
      const onMouseMove = (e: MouseEvent) => {
        state.mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        state.mouseY = (e.clientY / window.innerHeight) * 2 - 1;
        state.useMouse = true;
      };

      window.addEventListener("keydown", onKeyDown);
      window.addEventListener("keyup", onKeyUp);
      window.addEventListener("mousemove", onMouseMove);
      return () => {
        window.removeEventListener("keydown", onKeyDown);
        window.removeEventListener("keyup", onKeyUp);
        window.removeEventListener("mousemove", onMouseMove);
      };
    }, []);

    // Shader material
    const shaderMaterial = useMemo(
      () =>
        new THREE.ShaderMaterial({
          vertexShader: snakeVertexShader,
          fragmentShader: snakeFragmentShader,
          uniforms: {
            uTime: { value: 0 },
            uColor1: { value: new THREE.Color("#22cc66") },
            uColor2: { value: new THREE.Color("#886622") },
            uColor3: { value: new THREE.Color("#ccddaa") },
            uLength: { value: SEGMENT_COUNT },
          },
          side: THREE.DoubleSide,
        }),
      []
    );

    // Temp vectors for reuse
    const tmpVec = useMemo(() => new THREE.Vector3(), []);
    const tmpVec2 = useMemo(() => new THREE.Vector3(), []);

    useFrame((_, delta) => {
      if (!started || gameOver) return;
      const state = stateRef.current;
      if (!state.initialized) return;

      const dt = Math.min(delta, 0.05);
      state.time += dt;

      // Steering
      if (state.useMouse) {
        state.targetAngle += state.mouseX * TURN_SPEED * 1.5;
        state.targetVerticalAngle = -state.mouseY * 0.3;
      } else {
        if (state.keys.left) state.targetAngle += TURN_SPEED;
        if (state.keys.right) state.targetAngle -= TURN_SPEED;
        if (state.keys.up)
          state.targetVerticalAngle = Math.min(
            state.targetVerticalAngle + TURN_SPEED * 0.5,
            0.4
          );
        if (state.keys.down)
          state.targetVerticalAngle = Math.max(
            state.targetVerticalAngle - TURN_SPEED * 0.5,
            -0.3
          );
        if (!state.keys.up && !state.keys.down) {
          state.targetVerticalAngle *= 0.95;
        }
      }

      state.currentAngle +=
        (state.targetAngle - state.currentAngle) * 0.1;
      state.verticalAngle +=
        (state.targetVerticalAngle - state.verticalAngle) * 0.1;

      // Update direction
      state.direction.set(
        Math.sin(state.currentAngle),
        Math.sin(state.verticalAngle) * 0.5,
        Math.cos(state.currentAngle)
      );
      state.direction.normalize();

      // Move head
      state.headPos.addScaledVector(state.direction, state.speed);

      // Clamp Y
      state.headPos.y = Math.max(0.5, Math.min(state.headPos.y, 8));

      // Add new head point, shift array
      state.points.unshift(state.headPos.clone());
      if (state.points.length > state.length) {
        state.points.length = state.length;
      }

      // Rebuild tube geometry
      if (meshRef.current && state.points.length >= 4) {
        const curve = new THREE.CatmullRomCurve3(state.points, false, "catmullrom", 0.5);
        const newGeo = new THREE.TubeGeometry(
          curve,
          Math.min(state.points.length - 1, 180),
          TUBE_RADIUS,
          RADIAL_SEGMENTS,
          false
        );
        meshRef.current.geometry.dispose();
        meshRef.current.geometry = newGeo;
      }

      // Update head mesh
      if (headRef.current) {
        headRef.current.position.copy(state.headPos);
        // Face direction
        tmpVec.copy(state.headPos).add(state.direction);
        headRef.current.lookAt(tmpVec);
      }

      // Update eyes
      if (eyeLeftRef.current && eyeRightRef.current) {
        const right = tmpVec2
          .crossVectors(state.direction, new THREE.Vector3(0, 1, 0))
          .normalize();
        eyeLeftRef.current.position
          .copy(state.headPos)
          .addScaledVector(state.direction, 0.3)
          .addScaledVector(right, -0.2)
          .add(new THREE.Vector3(0, 0.15, 0));
        eyeRightRef.current.position
          .copy(state.headPos)
          .addScaledVector(state.direction, 0.3)
          .addScaledVector(right, 0.2)
          .add(new THREE.Vector3(0, 0.15, 0));
      }

      // Update shader
      shaderMaterial.uniforms.uTime.value = state.time;

      // Check food collisions
      for (let i = 0; i < state.foods.length; i++) {
        const food = state.foods[i];
        if (!food.active) continue;
        const dist = state.headPos.distanceTo(food.position);
        if (dist < EAT_DISTANCE) {
          food.active = false;
          state.length += 30;
          state.speed = Math.min(state.speed + 0.003, 0.3);
          onScore(10);
          // Respawn after delay
          setTimeout(() => spawnFood(i), 500);
        }
      }

      // Update food meshes
      if (foodGroupRef.current) {
        foodGroupRef.current.children.forEach((child, i) => {
          const food = state.foods[i];
          if (food) {
            child.position.copy(food.position);
            child.position.y += Math.sin(state.time * 3 + i) * 0.3;
            child.visible = food.active;
            child.rotation.y = state.time * 2;
          }
        });
      }

      // Camera follow
      const behind = tmpVec
        .copy(state.direction)
        .multiplyScalar(-12)
        .add(state.headPos);
      behind.y = state.headPos.y + 6;

      state.cameraPos.lerp(behind, 0.03);
      state.cameraTarget.lerp(state.headPos, 0.08);

      camera.position.copy(state.cameraPos);
      camera.lookAt(state.cameraTarget);
    });

    return (
      <group>
        {/* Snake body tube */}
        <mesh ref={meshRef} material={shaderMaterial}>
          <tubeGeometry
            args={[
              new THREE.CatmullRomCurve3([
                new THREE.Vector3(0, 1, 0),
                new THREE.Vector3(0, 1, -1),
                new THREE.Vector3(0, 1, -2),
                new THREE.Vector3(0, 1, -3),
              ]),
              64,
              TUBE_RADIUS,
              RADIAL_SEGMENTS,
              false,
            ]}
          />
        </mesh>

        {/* Snake head */}
        <mesh ref={headRef}>
          <sphereGeometry args={[0.45, 16, 16]} />
          <meshStandardMaterial
            color="#22cc66"
            emissive="#115533"
            emissiveIntensity={0.5}
            roughness={0.3}
            metalness={0.6}
          />
        </mesh>

        {/* Eyes */}
        <mesh ref={eyeLeftRef}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshStandardMaterial
            color="#ffff00"
            emissive="#ffaa00"
            emissiveIntensity={2}
          />
        </mesh>
        <mesh ref={eyeRightRef}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshStandardMaterial
            color="#ffff00"
            emissive="#ffaa00"
            emissiveIntensity={2}
          />
        </mesh>

        {/* Food orbs */}
        <group ref={foodGroupRef}>
          {Array.from({ length: FOOD_COUNT }).map((_, i) => (
            <mesh key={i} position={[0, 0, 0]}>
              <octahedronGeometry args={[0.6, 1]} />
              <meshStandardMaterial
                color={
                  ["#ff4488", "#44ff88", "#4488ff", "#ffaa22", "#ff44ff", "#44ffff", "#ffff44", "#aa44ff"][i % 8]
                }
                emissive={
                  ["#ff4488", "#44ff88", "#4488ff", "#ffaa22", "#ff44ff", "#44ffff", "#ffff44", "#aa44ff"][i % 8]
                }
                emissiveIntensity={1.5}
                roughness={0.2}
                metalness={0.8}
              />
            </mesh>
          ))}
        </group>
      </group>
    );
  }
);

Snake.displayName = "Snake";
export { Snake };
