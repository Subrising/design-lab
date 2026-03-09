'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform vec2 uResolution;
  varying vec2 vUv;

  vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
  vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
  vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
  float snoise(vec3 v){
    const vec2 C=vec2(1.0/6.0,1.0/3.0);const vec4 D=vec4(0.0,0.5,1.0,2.0);
    vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);
    vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.0-g;
    vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);
    vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;
    i=mod289(i);
    vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
    float n_=0.142857142857;vec3 ns=n_*D.wyz-D.xzx;
    vec4 j=p-49.0*floor(p*ns.z*ns.z);vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.0*x_);
    vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.0-abs(x)-abs(y);
    vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);
    vec4 s0=floor(b0)*2.0+1.0;vec4 s1=floor(b1)*2.0+1.0;
    vec4 sh=-step(h,vec4(0.0));
    vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
    vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
    vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
    p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
    vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
    m=m*m;return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
  }

  float fbm(vec3 p) {
    float v = 0.0; float a = 0.5; float f = 1.0;
    for(int i = 0; i < 5; i++) { v += a * snoise(p * f); f *= 2.0; a *= 0.5; }
    return v;
  }

  void main() {
    vec2 uv = vUv;

    // Flowing noise field
    float n1 = fbm(vec3(uv * 3.0, uTime * 0.1));
    float n2 = fbm(vec3(uv * 5.0 + n1 * 0.5, uTime * 0.15));

    // Mouse distortion
    float mouseDist = length(uMouse - uv);
    float mouseEffect = smoothstep(0.5, 0.0, mouseDist);
    n2 += mouseEffect * 0.3;

    // Color mapping
    vec3 c1 = vec3(0.02, 0.02, 0.05);
    vec3 c2 = vec3(0.15, 0.05, 0.25);
    vec3 c3 = vec3(0.05, 0.1, 0.3);

    vec3 color = mix(c1, c2, smoothstep(-0.3, 0.3, n1));
    color = mix(color, c3, smoothstep(-0.2, 0.4, n2));

    // Neon veins
    float veins = smoothstep(0.02, 0.0, abs(n2 - 0.1));
    color += vec3(0.66, 0.33, 0.97) * veins * (0.5 + mouseEffect);

    float veins2 = smoothstep(0.02, 0.0, abs(n1 + 0.1));
    color += vec3(0.24, 0.51, 0.96) * veins2 * 0.4;

    gl_FragColor = vec4(color, 1.0);
  }
`;

function NoisePlane() {
  const ref = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    uResolution: { value: new THREE.Vector2(1920, 1080) },
  }), []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.uniforms.uTime.value = state.clock.elapsedTime;
      ref.current.uniforms.uMouse.value.lerp(
        new THREE.Vector2(state.pointer.x * 0.5 + 0.5, state.pointer.y * 0.5 + 0.5),
        0.03
      );
    }
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={ref}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
}

export default function NoiseBackground() {
  return (
    <div className="fixed inset-0 z-0 opacity-60">
      <Canvas
        camera={{ position: [0, 0, 1], fov: 90 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: false }}
      >
        <NoisePlane />
      </Canvas>
    </div>
  );
}
