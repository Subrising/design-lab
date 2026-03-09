"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import * as CANNON from "cannon-es";

// ── Colors ──────────────────────────────────────────────
const COLORS = {
  sky: 0x87ceeb,
  ground: 0x7ec850,
  road: 0x555555,
  car: 0xe74c3c,
  carAccent: 0xf39c12,
  ramp: 0xf1c40f,
  obstacle: 0x3498db,
  wall: 0xe67e22,
  tree: 0x27ae60,
  trunk: 0x8b4513,
  boost: 0xe91e63,
};

// ── Keyboard state ──────────────────────────────────────
const keys: Record<string, boolean> = {};

export default function PlaygroundScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const hudRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // ── Renderer ──────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    containerRef.current.appendChild(renderer.domElement);

    // ── Scene ─────────────────────────────────────────
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(COLORS.sky);
    scene.fog = new THREE.Fog(COLORS.sky, 60, 120);

    // ── Camera ────────────────────────────────────────
    const camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      0.1,
      200
    );

    // ── Lighting ──────────────────────────────────────
    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambient);

    const sun = new THREE.DirectionalLight(0xffffff, 1.4);
    sun.position.set(30, 50, 20);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.left = -60;
    sun.shadow.camera.right = 60;
    sun.shadow.camera.top = 60;
    sun.shadow.camera.bottom = -60;
    sun.shadow.camera.far = 120;
    sun.shadow.bias = -0.001;
    scene.add(sun);

    const hemi = new THREE.HemisphereLight(0x87ceeb, 0x7ec850, 0.4);
    scene.add(hemi);

    // ── Physics World ─────────────────────────────────
    const world = new CANNON.World({
      gravity: new CANNON.Vec3(0, -15, 0),
    });
    world.broadphase = new CANNON.SAPBroadphase(world);
    world.defaultContactMaterial.friction = 0.3;
    world.defaultContactMaterial.restitution = 0.2;

    const groundMaterial = new CANNON.Material("ground");
    const wheelMaterial = new CANNON.Material("wheel");
    const wheelGroundContact = new CANNON.ContactMaterial(
      wheelMaterial,
      groundMaterial,
      { friction: 0.5, restitution: 0.1 }
    );
    world.addContactMaterial(wheelGroundContact);

    // ── Ground ────────────────────────────────────────
    const groundSize = 100;
    const groundGeo = new THREE.PlaneGeometry(groundSize, groundSize);
    const groundMat = new THREE.MeshStandardMaterial({
      color: COLORS.ground,
      roughness: 0.9,
    });
    const groundMesh = new THREE.Mesh(groundGeo, groundMat);
    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.receiveShadow = true;
    scene.add(groundMesh);

    const groundBody = new CANNON.Body({
      type: CANNON.Body.STATIC,
      shape: new CANNON.Plane(),
      material: groundMaterial,
    });
    groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
    world.addBody(groundBody);

    // ── Helper: add static physics box with mesh ─────
    type PhysicsObj = { mesh: THREE.Mesh; body: CANNON.Body };
    const physicsObjects: PhysicsObj[] = [];

    function addBox(
      w: number,
      h: number,
      d: number,
      x: number,
      y: number,
      z: number,
      color: number,
      rotY = 0,
      rotX = 0,
      rotZ = 0,
      isStatic = true,
      mass = 0.5
    ): PhysicsObj {
      const geo = new THREE.BoxGeometry(w, h, d);
      const mat = new THREE.MeshStandardMaterial({
        color,
        roughness: 0.6,
        metalness: 0.1,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      scene.add(mesh);

      const body = new CANNON.Body({
        mass: isStatic ? 0 : mass,
        shape: new CANNON.Box(new CANNON.Vec3(w / 2, h / 2, d / 2)),
        material: groundMaterial,
      });
      body.position.set(x, y, z);
      const q = new CANNON.Quaternion();
      q.setFromEuler(rotX, rotY, rotZ);
      body.quaternion.copy(q);
      world.addBody(body);

      const obj = { mesh, body };
      physicsObjects.push(obj);
      return obj;
    }

    // ── Build Scene: Ramps ────────────────────────────
    // Front ramp
    addBox(6, 0.3, 8, 0, 1.2, -15, COLORS.ramp, 0, 0.18, 0);
    // Side ramp
    addBox(6, 0.3, 8, 18, 1.5, 5, COLORS.ramp, -0.5, 0.2, 0);
    // Big jump ramp
    addBox(8, 0.3, 10, -15, 2, -25, COLORS.ramp, 0.3, 0.25, 0);
    // Landing platform
    addBox(10, 1, 10, -15, 0.5, -35, COLORS.road, 0, 0, 0);

    // ── Obstacles: Boxes to crash into ────────────────
    const obstaclePositions = [
      [8, 1, -8],
      [10, 1, -10],
      [12, 1, -8],
      [-5, 1, 10],
      [-7, 1, 12],
      [25, 1, -5],
      [25, 1, -3],
      [25, 1, -1],
      [-20, 1, 15],
      [-18, 1, 15],
      [-16, 1, 15],
      [-18, 2.5, 15],
    ];
    for (const [x, y, z] of obstaclePositions) {
      addBox(1.8, 1.8, 1.8, x, y, z, COLORS.obstacle, 0, 0, 0, false, 2);
    }

    // ── Walls / Barriers ──────────────────────────────
    addBox(40, 2, 1, 0, 1, -45, COLORS.wall);
    addBox(40, 2, 1, 0, 1, 45, COLORS.wall);
    addBox(1, 2, 90, -45, 1, 0, COLORS.wall);
    addBox(1, 2, 90, 45, 1, 0, COLORS.wall);

    // Interior walls
    addBox(12, 2, 1, 15, 1, 20, COLORS.wall, 0.4);
    addBox(8, 2, 1, -25, 1, -10, COLORS.wall, -0.3);

    // ── Boost pads (visual only, flat on ground) ──────
    const boostPositions = [
      [0, 0.05, -5],
      [-10, 0.05, 0],
      [10, 0.05, 15],
    ];
    for (const [x, y, z] of boostPositions) {
      const geo = new THREE.BoxGeometry(3, 0.1, 3);
      const mat = new THREE.MeshStandardMaterial({
        color: COLORS.boost,
        emissive: COLORS.boost,
        emissiveIntensity: 0.4,
        roughness: 0.3,
      });
      const m = new THREE.Mesh(geo, mat);
      m.position.set(x, y, z);
      m.receiveShadow = true;
      scene.add(m);
    }

    // ── Trees ─────────────────────────────────────────
    function addTree(x: number, z: number) {
      const trunkGeo = new THREE.CylinderGeometry(0.3, 0.4, 2, 6);
      const trunkMat = new THREE.MeshStandardMaterial({
        color: COLORS.trunk,
        roughness: 0.9,
      });
      const trunk = new THREE.Mesh(trunkGeo, trunkMat);
      trunk.position.set(x, 1, z);
      trunk.castShadow = true;
      scene.add(trunk);

      const leavesGeo = new THREE.ConeGeometry(1.5, 3, 6);
      const leavesMat = new THREE.MeshStandardMaterial({
        color: COLORS.tree,
        roughness: 0.8,
        flatShading: true,
      });
      const leaves = new THREE.Mesh(leavesGeo, leavesMat);
      leaves.position.set(x, 3.5, z);
      leaves.castShadow = true;
      scene.add(leaves);

      // Tree collision
      const treeBody = new CANNON.Body({
        mass: 0,
        shape: new CANNON.Cylinder(0.4, 0.4, 4, 6),
      });
      treeBody.position.set(x, 2, z);
      world.addBody(treeBody);
    }

    const treePositions = [
      [-30, -20], [-35, -10], [-30, 5], [-35, 15], [-30, 25],
      [30, -20], [35, -10], [30, 5], [35, 15], [30, 25],
      [-20, 35], [-10, 35], [0, 38], [10, 35], [20, 35],
      [-20, -38], [0, -40], [20, -38],
      [-38, -30], [38, -30], [-38, 30], [38, 30],
    ];
    for (const [x, z] of treePositions) {
      addTree(x, z);
    }

    // ── Car (RaycastVehicle) ──────────────────────────
    const chassisW = 1.6;
    const chassisH = 0.6;
    const chassisD = 3.2;

    // Chassis mesh (two-tone body)
    const chassisGroup = new THREE.Group();

    const bodyGeo = new THREE.BoxGeometry(chassisW, chassisH, chassisD);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: COLORS.car,
      roughness: 0.4,
      metalness: 0.3,
    });
    const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
    bodyMesh.castShadow = true;
    chassisGroup.add(bodyMesh);

    // Cabin
    const cabinGeo = new THREE.BoxGeometry(
      chassisW * 0.85,
      chassisH * 0.7,
      chassisD * 0.4
    );
    const cabinMat = new THREE.MeshStandardMaterial({
      color: COLORS.carAccent,
      roughness: 0.4,
      metalness: 0.2,
    });
    const cabin = new THREE.Mesh(cabinGeo, cabinMat);
    cabin.position.y = chassisH * 0.65;
    cabin.position.z = -chassisD * 0.05;
    cabin.castShadow = true;
    chassisGroup.add(cabin);

    scene.add(chassisGroup);

    // Chassis physics body
    const chassisShape = new CANNON.Box(
      new CANNON.Vec3(chassisW / 2, chassisH / 2, chassisD / 2)
    );
    const chassisBody = new CANNON.Body({
      mass: 80,
      material: groundMaterial,
    });
    chassisBody.addShape(chassisShape);
    chassisBody.position.set(0, 2, 0);
    chassisBody.angularDamping = 0.4;
    world.addBody(chassisBody);

    // Vehicle
    const vehicle = new CANNON.RaycastVehicle({
      chassisBody,
      indexRightAxis: 0,
      indexUpAxis: 1,
      indexForwardAxis: 2,
    });

    const wheelRadius = 0.4;
    const wheelHalfTrack = 0.9;
    const wheelAxisFront = -1.2;
    const wheelAxisBack = 1.2;
    const suspensionRestLength = 0.35;

    const wheelOptions = {
      radius: wheelRadius,
      directionLocal: new CANNON.Vec3(0, -1, 0),
      suspensionStiffness: 40,
      suspensionRestLength,
      frictionSlip: 2.5,
      dampingRelaxation: 2.5,
      dampingCompression: 4.0,
      maxSuspensionForce: 100000,
      rollInfluence: 0.1,
      axleLocal: new CANNON.Vec3(-1, 0, 0),
      chassisConnectionPointLocal: new CANNON.Vec3(0, 0, 0),
      maxSuspensionTravel: 0.3,
      customSlidingRotationalSpeed: -30,
      useCustomSlidingRotationalSpeed: true,
    };

    // Front-left
    wheelOptions.chassisConnectionPointLocal.set(
      wheelHalfTrack,
      0,
      wheelAxisFront
    );
    vehicle.addWheel(wheelOptions);

    // Front-right
    wheelOptions.chassisConnectionPointLocal.set(
      -wheelHalfTrack,
      0,
      wheelAxisFront
    );
    vehicle.addWheel(wheelOptions);

    // Rear-left
    wheelOptions.chassisConnectionPointLocal.set(
      wheelHalfTrack,
      0,
      wheelAxisBack
    );
    vehicle.addWheel(wheelOptions);

    // Rear-right
    wheelOptions.chassisConnectionPointLocal.set(
      -wheelHalfTrack,
      0,
      wheelAxisBack
    );
    vehicle.addWheel(wheelOptions);

    vehicle.addToWorld(world);

    // Wheel meshes
    const wheelGeo = new THREE.CylinderGeometry(
      wheelRadius,
      wheelRadius,
      0.3,
      12
    );
    const wheelMat = new THREE.MeshStandardMaterial({
      color: 0x222222,
      roughness: 0.7,
    });
    const wheelMeshes: THREE.Mesh[] = [];
    for (let i = 0; i < 4; i++) {
      const wm = new THREE.Mesh(wheelGeo, wheelMat);
      wm.castShadow = true;
      scene.add(wm);
      wheelMeshes.push(wm);
    }

    // Wheel physics bodies (for visual sync)
    const wheelBodies: CANNON.Body[] = [];
    for (let i = 0; i < 4; i++) {
      const wb = new CANNON.Body({
        mass: 0,
        type: CANNON.Body.KINEMATIC,
        collisionFilterGroup: 0,
        shape: new CANNON.Sphere(wheelRadius),
        material: wheelMaterial,
      });
      world.addBody(wb);
      wheelBodies.push(wb);
    }

    // ── Vehicle controls ──────────────────────────────
    const maxSteerVal = 0.6;
    const maxForce = 600;
    const brakeForce = 20;

    function handleKeyDown(e: KeyboardEvent) {
      keys[e.key.toLowerCase()] = true;
      if (["arrowup", "arrowdown", "arrowleft", "arrowright", " "].includes(e.key.toLowerCase())) {
        e.preventDefault();
      }
    }
    function handleKeyUp(e: KeyboardEvent) {
      keys[e.key.toLowerCase()] = false;
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    // ── Camera smoothing ──────────────────────────────
    const cameraOffset = new THREE.Vector3(0, 5, 10);
    const cameraLookOffset = new THREE.Vector3(0, 1, 0);
    const currentCameraPos = new THREE.Vector3(0, 8, 15);
    const currentLookAt = new THREE.Vector3(0, 0, 0);

    // ── Speed tracker for HUD ─────────────────────────
    let speedKmh = 0;

    // ── Reset function ────────────────────────────────
    function resetCar() {
      chassisBody.position.set(0, 2, 0);
      chassisBody.velocity.setZero();
      chassisBody.angularVelocity.setZero();
      chassisBody.quaternion.setFromEuler(0, 0, 0);
    }

    // ── Animation loop ────────────────────────────────
    const clock = new THREE.Clock();
    let animId = 0;

    function animate() {
      animId = requestAnimationFrame(animate);
      const delta = Math.min(clock.getDelta(), 0.05);

      // ── Vehicle input ───────────────────────────────
      let engineForce = 0;
      let steering = 0;
      let brake = 0;

      const forward = keys["arrowup"] || keys["w"];
      const backward = keys["arrowdown"] || keys["s"];
      const left = keys["arrowleft"] || keys["a"];
      const right = keys["arrowright"] || keys["d"];
      const braking = keys[" "];
      const reset = keys["r"];

      if (forward) engineForce = -maxForce;
      if (backward) engineForce = maxForce * 0.6;
      if (left) steering = maxSteerVal;
      if (right) steering = -maxSteerVal;
      if (braking) brake = brakeForce;
      if (reset) resetCar();

      // Apply to rear wheels (rear-wheel drive)
      vehicle.applyEngineForce(engineForce, 2);
      vehicle.applyEngineForce(engineForce, 3);

      // Steer front wheels
      vehicle.setSteeringValue(steering, 0);
      vehicle.setSteeringValue(steering, 1);

      // Brakes on all wheels
      for (let i = 0; i < 4; i++) {
        vehicle.setBrake(brake, i);
      }

      // ── Boost pads ──────────────────────────────────
      const carPos = chassisBody.position;
      for (const [bx, , bz] of boostPositions) {
        const dx = carPos.x - bx;
        const dz = carPos.z - bz;
        if (Math.abs(dx) < 2 && Math.abs(dz) < 2 && carPos.y < 1.5) {
          // Apply forward boost in car's local forward direction
          const fwd = new CANNON.Vec3(0, 0, -1);
          chassisBody.quaternion.vmult(fwd, fwd);
          fwd.scale(300, fwd);
          chassisBody.applyForce(fwd, chassisBody.position);
        }
      }

      // ── Step physics ────────────────────────────────
      world.step(1 / 60, delta, 3);

      // ── Sync meshes ─────────────────────────────────
      for (const obj of physicsObjects) {
        obj.mesh.position.copy(obj.body.position as unknown as THREE.Vector3);
        obj.mesh.quaternion.copy(
          obj.body.quaternion as unknown as THREE.Quaternion
        );
      }

      // Chassis
      chassisGroup.position.copy(
        chassisBody.position as unknown as THREE.Vector3
      );
      chassisGroup.quaternion.copy(
        chassisBody.quaternion as unknown as THREE.Quaternion
      );

      // Wheels
      for (let i = 0; i < 4; i++) {
        vehicle.updateWheelTransform(i);
        const t = vehicle.wheelInfos[i].worldTransform;
        wheelBodies[i].position.copy(t.position);
        wheelBodies[i].quaternion.copy(t.quaternion);

        wheelMeshes[i].position.copy(
          t.position as unknown as THREE.Vector3
        );
        wheelMeshes[i].quaternion.copy(
          t.quaternion as unknown as THREE.Quaternion
        );
        // Rotate cylinder to align with wheel axis
        wheelMeshes[i].rotateZ(Math.PI / 2);
      }

      // ── Speed ───────────────────────────────────────
      const vel = chassisBody.velocity;
      speedKmh = Math.round(
        Math.sqrt(vel.x * vel.x + vel.z * vel.z) * 3.6
      );

      // ── Camera follow ───────────────────────────────
      const chassisQuat = new THREE.Quaternion(
        chassisBody.quaternion.x,
        chassisBody.quaternion.y,
        chassisBody.quaternion.z,
        chassisBody.quaternion.w
      );
      const targetCameraPos = cameraOffset
        .clone()
        .applyQuaternion(chassisQuat)
        .add(
          new THREE.Vector3(
            chassisBody.position.x,
            chassisBody.position.y,
            chassisBody.position.z
          )
        );

      const targetLookAt = cameraLookOffset.clone().add(
        new THREE.Vector3(
          chassisBody.position.x,
          chassisBody.position.y,
          chassisBody.position.z
        )
      );

      currentCameraPos.lerp(targetCameraPos, 3 * delta);
      currentLookAt.lerp(targetLookAt, 5 * delta);

      camera.position.copy(currentCameraPos);
      camera.lookAt(currentLookAt);

      // ── Fall reset ──────────────────────────────────
      if (chassisBody.position.y < -10) {
        resetCar();
      }

      // ── HUD update ──────────────────────────────────
      if (hudRef.current) {
        hudRef.current.textContent = `${speedKmh} km/h`;
      }

      renderer.render(scene, camera);
    }

    animate();

    // ── Resize ────────────────────────────────────────
    function handleResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener("resize", handleResize);

    // ── Cleanup ───────────────────────────────────────
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative w-screen h-screen">
      <div ref={containerRef} className="absolute inset-0" />

      {/* HUD overlay */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none select-none">
        <div
          ref={hudRef}
          className="text-4xl font-bold text-white drop-shadow-lg tracking-wider"
        >
          0 km/h
        </div>
      </div>

      {/* Controls hint */}
      <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-sm rounded-xl px-4 py-3 text-white/80 text-sm pointer-events-none select-none space-y-1">
        <div className="font-semibold text-white mb-1">Controls</div>
        <div>
          <span className="inline-block w-6 h-6 bg-white/20 rounded text-center text-xs leading-6 mr-1 font-mono">
            W
          </span>
          <span className="inline-block w-6 h-6 bg-white/20 rounded text-center text-xs leading-6 mr-1 font-mono">
            ↑
          </span>
          Accelerate
        </div>
        <div>
          <span className="inline-block w-6 h-6 bg-white/20 rounded text-center text-xs leading-6 mr-1 font-mono">
            S
          </span>
          <span className="inline-block w-6 h-6 bg-white/20 rounded text-center text-xs leading-6 mr-1 font-mono">
            ↓
          </span>
          Reverse
        </div>
        <div>
          <span className="inline-block w-6 h-6 bg-white/20 rounded text-center text-xs leading-6 mr-1 font-mono">
            A
          </span>
          <span className="inline-block w-6 h-6 bg-white/20 rounded text-center text-xs leading-6 mr-1 font-mono">
            D
          </span>
          Steer
        </div>
        <div>
          <span className="inline-block w-12 h-6 bg-white/20 rounded text-center text-xs leading-6 mr-1 font-mono">
            Space
          </span>
          Brake
        </div>
        <div>
          <span className="inline-block w-6 h-6 bg-white/20 rounded text-center text-xs leading-6 mr-1 font-mono">
            R
          </span>
          Reset
        </div>
      </div>

      {/* Pink boost pad indicator */}
      <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-sm rounded-xl px-4 py-3 text-white/80 text-sm pointer-events-none select-none">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-pink-500" />
          <span>Boost pads</span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <div className="w-3 h-3 rounded-sm bg-yellow-400" />
          <span>Ramps</span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <div className="w-3 h-3 rounded-sm bg-blue-500" />
          <span>Crash boxes</span>
        </div>
      </div>
    </div>
  );
}
