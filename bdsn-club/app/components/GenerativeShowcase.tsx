'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// ─── GLSL Noise ─────────────────────────────────────────────────────────
const noise = /* glsl */ `
  vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
  vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
  vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
  float snoise(vec3 v){
    const vec2 C=vec2(1.0/6.0,1.0/3.0);
    const vec4 D=vec4(0.0,0.5,1.0,2.0);
    vec3 i=floor(v+dot(v,C.yyy));
    vec3 x0=v-i+dot(i,C.xxx);
    vec3 g=step(x0.yzx,x0.xyz);
    vec3 l=1.0-g;
    vec3 i1=min(g.xyz,l.zxy);
    vec3 i2=max(g.xyz,l.zxy);
    vec3 x1=x0-i1+C.xxx;
    vec3 x2=x0-i2+C.yyy;
    vec3 x3=x0-D.yyy;
    i=mod289(i);
    vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
    float n_=0.142857142857;
    vec3 ns=n_*D.wyz-D.xzx;
    vec4 j=p-49.0*floor(p*ns.z*ns.z);
    vec4 x_=floor(j*ns.z);
    vec4 y_=floor(j-7.0*x_);
    vec4 x=x_*ns.x+ns.yyyy;
    vec4 y=y_*ns.x+ns.yyyy;
    vec4 h=1.0-abs(x)-abs(y);
    vec4 b0=vec4(x.xy,y.xy);
    vec4 b1=vec4(x.zw,y.zw);
    vec4 s0=floor(b0)*2.0+1.0;
    vec4 s1=floor(b1)*2.0+1.0;
    vec4 sh=-step(h,vec4(0.0));
    vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
    vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
    vec3 p0=vec3(a0.xy,h.x);
    vec3 p1=vec3(a0.zw,h.y);
    vec3 p2=vec3(a1.xy,h.z);
    vec3 p3=vec3(a1.zw,h.w);
    vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
    p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
    vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
    m=m*m;
    return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
  }
`;

// ─── Torus Knot Morph ───────────────────────────────────────────────────
function MorphTorus() {
  const ref = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0, 0) },
  }), []);

  const vert = /* glsl */ `
    ${noise}
    uniform float uTime;
    uniform vec2 uMouse;
    varying vec3 vPos;
    varying float vNoise;
    void main() {
      vec3 pos = position;
      float n = snoise(pos * 1.5 + uTime * 0.4);
      float mouseInf = smoothstep(2.0, 0.0, length(uMouse - pos.xy * 0.5));
      pos += normal * n * (0.3 + mouseInf * 0.4);
      vPos = pos;
      vNoise = n;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `;

  const frag = /* glsl */ `
    uniform float uTime;
    varying vec3 vPos;
    varying float vNoise;
    void main() {
      vec3 c1 = vec3(0.06, 0.72, 0.83);
      vec3 c2 = vec3(0.66, 0.33, 0.97);
      vec3 color = mix(c1, c2, vNoise * 0.5 + 0.5);
      float edge = abs(vNoise) * 0.8;
      color += edge * vec3(0.2, 0.1, 0.5);
      gl_FragColor = vec4(color, 0.9);
    }
  `;

  useFrame((state) => {
    if (ref.current) {
      ref.current.uniforms.uTime.value = state.clock.elapsedTime;
      ref.current.uniforms.uMouse.value.lerp(
        new THREE.Vector2(state.pointer.x * 2, state.pointer.y * 2), 0.05
      );
    }
  });

  return (
    <mesh rotation={[Math.PI / 4, 0, 0]}>
      <torusKnotGeometry args={[1, 0.35, 256, 32]} />
      <shaderMaterial ref={ref} vertexShader={vert} fragmentShader={frag} uniforms={uniforms} transparent side={THREE.DoubleSide} />
    </mesh>
  );
}

// ─── Plane Distortion ───────────────────────────────────────────────────
function WavePlane() {
  const ref = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0, 0) },
  }), []);

  const vert = /* glsl */ `
    ${noise}
    uniform float uTime;
    uniform vec2 uMouse;
    varying vec2 vUv;
    varying float vElevation;
    void main() {
      vUv = uv;
      vec3 pos = position;
      float mouseInf = smoothstep(1.5, 0.0, length(uMouse - uv * 2.0 + 1.0));
      float n = snoise(vec3(pos.xy * 3.0, uTime * 0.3));
      pos.z = n * 0.4 + mouseInf * sin(uTime * 2.0) * 0.3;
      vElevation = pos.z;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `;

  const frag = /* glsl */ `
    uniform float uTime;
    varying vec2 vUv;
    varying float vElevation;
    void main() {
      vec3 c1 = vec3(0.92, 0.29, 0.60);
      vec3 c2 = vec3(0.24, 0.51, 0.96);
      vec3 color = mix(c1, c2, vUv.x + vElevation);
      float grid = step(0.98, fract(vUv.x * 20.0)) + step(0.98, fract(vUv.y * 20.0));
      color += grid * 0.3;
      gl_FragColor = vec4(color, 0.85);
    }
  `;

  useFrame((state) => {
    if (ref.current) {
      ref.current.uniforms.uTime.value = state.clock.elapsedTime;
      ref.current.uniforms.uMouse.value.lerp(
        new THREE.Vector2(state.pointer.x, state.pointer.y), 0.05
      );
    }
  });

  return (
    <mesh rotation={[-Math.PI / 3, 0, 0]} position={[0, -0.5, 0]}>
      <planeGeometry args={[4, 4, 128, 128]} />
      <shaderMaterial ref={ref} vertexShader={vert} fragmentShader={frag} uniforms={uniforms} transparent wireframe side={THREE.DoubleSide} />
    </mesh>
  );
}

// ─── Particle Ring ──────────────────────────────────────────────────────
function ParticleRing() {
  const ref = useRef<THREE.ShaderMaterial>(null);
  const count = 5000;

  const { positions, randoms } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const rnd = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const radius = 1.5 + Math.random() * 0.5;
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 0.5;
      pos[i * 3 + 2] = Math.sin(angle) * radius;
      rnd[i] = Math.random();
    }
    return { positions: pos, randoms: rnd };
  }, []);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0, 0) },
  }), []);

  const vert = /* glsl */ `
    ${noise}
    uniform float uTime;
    uniform vec2 uMouse;
    attribute float aRandom;
    varying float vAlpha;
    void main() {
      vec3 pos = position;
      float angle = atan(pos.z, pos.x) + uTime * 0.2 * (0.5 + aRandom);
      float radius = length(pos.xz);
      float mouseInf = smoothstep(2.0, 0.0, length(uMouse - vec2(cos(angle), sin(angle))));
      radius += snoise(vec3(angle * 2.0, uTime * 0.3, aRandom)) * 0.3;
      radius += mouseInf * 0.5;
      pos.x = cos(angle) * radius;
      pos.z = sin(angle) * radius;
      pos.y += snoise(vec3(pos.xz * 2.0, uTime * 0.5)) * 0.2;
      vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
      vAlpha = 0.3 + 0.7 * aRandom;
      gl_PointSize = (2.0 + aRandom * 3.0) * (200.0 / -mvPos.z);
      gl_Position = projectionMatrix * mvPos;
    }
  `;

  const frag = /* glsl */ `
    varying float vAlpha;
    void main() {
      float d = length(gl_PointCoord - 0.5);
      if (d > 0.5) discard;
      float alpha = smoothstep(0.5, 0.0, d) * vAlpha;
      gl_FragColor = vec4(0.66, 0.33, 0.97, alpha);
    }
  `;

  useFrame((state) => {
    if (ref.current) {
      ref.current.uniforms.uTime.value = state.clock.elapsedTime;
      ref.current.uniforms.uMouse.value.lerp(
        new THREE.Vector2(state.pointer.x * 2, state.pointer.y * 2), 0.04
      );
    }
  });

  return (
    <points rotation={[Math.PI / 6, 0, 0]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aRandom" args={[randoms, 1]} />
      </bufferGeometry>
      <shaderMaterial ref={ref} vertexShader={vert} fragmentShader={frag} uniforms={uniforms} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
}

// ─── Showcase Card ──────────────────────────────────────────────────────
function ShowcaseCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="gradient-border rounded-2xl overflow-hidden bg-surface-light">
      <div className="h-[400px] relative" data-cursor-hover>
        <Canvas camera={{ position: [0, 0, 4], fov: 50 }} dpr={[1, 1.5]}>
          <ambientLight intensity={0.2} />
          {children}
        </Canvas>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-sm text-gray-400">{description}</p>
      </div>
    </div>
  );
}

// ─── Exported Showcase Section ──────────────────────────────────────────
export default function GenerativeShowcase() {
  return (
    <section className="relative z-10 px-8 py-24 max-w-7xl mx-auto">
      <div className="mb-16 text-center">
        <p className="text-neon-purple text-sm font-mono tracking-widest uppercase mb-4">
          Experiments
        </p>
        <h2 className="text-4xl md:text-6xl font-bold text-white">
          Generative <span className="glow-text">States</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <ShowcaseCard
          title="Torus Morph"
          description="Simplex noise displacement on torus knot geometry. Mouse proximity amplifies distortion."
        >
          <MorphTorus />
        </ShowcaseCard>

        <ShowcaseCard
          title="Wave Terrain"
          description="Procedural terrain with noise-driven elevation. Cursor creates ripple effects."
        >
          <WavePlane />
        </ShowcaseCard>

        <ShowcaseCard
          title="Orbital Ring"
          description="5000 particles in orbital formation. Mouse attraction disrupts the ring structure."
        >
          <ParticleRing />
        </ShowcaseCard>
      </div>
    </section>
  );
}
