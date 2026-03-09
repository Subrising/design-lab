"use client";

import { useEffect, useRef, useCallback } from "react";
import * as THREE from "three";

const GLOBE_VERTEX_SHADER = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const GLOBE_FRAGMENT_SHADER = `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform vec3 uAccentColor;

  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;

  // Simplex noise
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  void main() {
    // Grid lines (longitude/latitude)
    float lat = abs(fract(vUv.y * 12.0) - 0.5) * 2.0;
    float lon = abs(fract(vUv.x * 24.0) - 0.5) * 2.0;
    float grid = smoothstep(0.94, 0.96, lat) + smoothstep(0.94, 0.96, lon);

    // Noise-based continents
    vec3 noiseCoord = vec3(vUv * 4.0, uTime * 0.05);
    float continent = snoise(noiseCoord) * 0.5 + 0.5;
    continent = smoothstep(0.45, 0.55, continent);

    // Fresnel edge glow
    float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 3.0);

    // Mouse-reactive highlight
    float mouseInfluence = 1.0 - smoothstep(0.0, 0.8, length(uMouse - vUv));

    // Base color
    vec3 baseColor = vec3(0.08);
    vec3 gridColor = vec3(0.15);
    vec3 continentColor = uAccentColor * 0.15;
    vec3 fresnelColor = uAccentColor * 0.6;

    vec3 color = baseColor;
    color = mix(color, gridColor, grid * 0.5);
    color = mix(color, continentColor, continent * 0.4);
    color += fresnelColor * fresnel;
    color += uAccentColor * mouseInfluence * 0.1;

    // Atmosphere
    float atmosphere = fresnel * 0.8;
    color += uAccentColor * atmosphere * 0.3;

    float alpha = 0.85 + fresnel * 0.15;

    gl_FragColor = vec4(color, alpha);
  }
`;

const DOT_VERTEX_SHADER = `
  attribute float aSize;
  attribute float aAlpha;
  varying float vAlpha;

  void main() {
    vAlpha = aAlpha;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * (200.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const DOT_FRAGMENT_SHADER = `
  uniform vec3 uColor;
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - vec2(0.5));
    if (d > 0.5) discard;
    float alpha = smoothstep(0.5, 0.2, d) * vAlpha;
    gl_FragColor = vec4(uColor, alpha);
  }
`;

export default function Globe() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const frameRef = useRef<number>(0);

  const init = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.z = 3.5;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    const size = Math.min(container.clientWidth, container.clientHeight, 700);
    renderer.setSize(size, size);
    container.appendChild(renderer.domElement);

    // Accent color: #c8ff00
    const accentColor = new THREE.Color(0xc8ff00);

    // Globe mesh
    const globeGeo = new THREE.SphereGeometry(1.2, 64, 64);
    const globeMat = new THREE.ShaderMaterial({
      vertexShader: GLOBE_VERTEX_SHADER,
      fragmentShader: GLOBE_FRAGMENT_SHADER,
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
        uAccentColor: { value: accentColor },
      },
      transparent: true,
      side: THREE.FrontSide,
    });
    const globe = new THREE.Mesh(globeGeo, globeMat);
    scene.add(globe);

    // Wireframe overlay
    const wireGeo = new THREE.SphereGeometry(1.205, 32, 32);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x222222,
      wireframe: true,
      transparent: true,
      opacity: 0.08,
    });
    const wireframe = new THREE.Mesh(wireGeo, wireMat);
    scene.add(wireframe);

    // Dot particles on sphere surface
    const dotCount = 1500;
    const dotPositions = new Float32Array(dotCount * 3);
    const dotSizes = new Float32Array(dotCount);
    const dotAlphas = new Float32Array(dotCount);

    for (let i = 0; i < dotCount; i++) {
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = Math.random() * Math.PI * 2;
      const r = 1.22;
      dotPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      dotPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      dotPositions[i * 3 + 2] = r * Math.cos(phi);
      dotSizes[i] = Math.random() * 2 + 0.5;
      dotAlphas[i] = Math.random() * 0.6 + 0.1;
    }

    const dotGeo = new THREE.BufferGeometry();
    dotGeo.setAttribute("position", new THREE.BufferAttribute(dotPositions, 3));
    dotGeo.setAttribute("aSize", new THREE.BufferAttribute(dotSizes, 1));
    dotGeo.setAttribute("aAlpha", new THREE.BufferAttribute(dotAlphas, 1));

    const dotMat = new THREE.ShaderMaterial({
      vertexShader: DOT_VERTEX_SHADER,
      fragmentShader: DOT_FRAGMENT_SHADER,
      uniforms: {
        uColor: { value: accentColor },
      },
      transparent: true,
      depthWrite: false,
    });

    const dots = new THREE.Points(dotGeo, dotMat);
    scene.add(dots);

    // Connection lines between random dot pairs
    const lineCount = 40;
    const lineGeo = new THREE.BufferGeometry();
    const linePositions = new Float32Array(lineCount * 6);
    for (let i = 0; i < lineCount; i++) {
      const idx1 = Math.floor(Math.random() * dotCount);
      const idx2 = Math.floor(Math.random() * dotCount);
      linePositions[i * 6] = dotPositions[idx1 * 3];
      linePositions[i * 6 + 1] = dotPositions[idx1 * 3 + 1];
      linePositions[i * 6 + 2] = dotPositions[idx1 * 3 + 2];
      linePositions[i * 6 + 3] = dotPositions[idx2 * 3];
      linePositions[i * 6 + 4] = dotPositions[idx2 * 3 + 1];
      linePositions[i * 6 + 5] = dotPositions[idx2 * 3 + 2];
    }
    lineGeo.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
    const lineMat = new THREE.LineBasicMaterial({
      color: accentColor,
      transparent: true,
      opacity: 0.06,
    });
    const lines = new THREE.LineSegments(lineGeo, lineMat);
    scene.add(lines);

    // Outer glow ring
    const ringGeo = new THREE.RingGeometry(1.35, 1.38, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: accentColor,
      transparent: true,
      opacity: 0.08,
      side: THREE.DoubleSide,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    scene.add(ring);

    // Mouse handler
    const handleMouse = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseRef.current.x = (e.clientX - rect.left) / rect.width;
      mouseRef.current.y = (e.clientY - rect.top) / rect.height;
    };
    container.addEventListener("mousemove", handleMouse);

    // Animation
    let time = 0;
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      time += 0.005;

      globeMat.uniforms.uTime.value = time;
      globeMat.uniforms.uMouse.value.set(mouseRef.current.x, mouseRef.current.y);

      // Mouse-reactive rotation
      const targetRotY = (mouseRef.current.x - 0.5) * 0.5;
      const targetRotX = (mouseRef.current.y - 0.5) * 0.3;

      globe.rotation.y += (targetRotY + time * 0.3 - globe.rotation.y) * 0.02;
      globe.rotation.x += (targetRotX - globe.rotation.x) * 0.02;

      wireframe.rotation.y = globe.rotation.y;
      wireframe.rotation.x = globe.rotation.x;

      dots.rotation.y = globe.rotation.y;
      dots.rotation.x = globe.rotation.x;

      lines.rotation.y = globe.rotation.y;
      lines.rotation.x = globe.rotation.x;

      ring.rotation.x = globe.rotation.x * 0.5;
      ring.rotation.y = globe.rotation.y * 0.5;

      renderer.render(scene, camera);
    };
    animate();

    // Resize
    const handleResize = () => {
      const s = Math.min(container.clientWidth, container.clientHeight, 700);
      renderer.setSize(s, s);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(frameRef.current);
      container.removeEventListener("mousemove", handleMouse);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      container.removeChild(renderer.domElement);
    };
  }, []);

  useEffect(() => {
    const cleanup = init();
    return () => cleanup?.();
  }, [init]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full flex items-center justify-center"
    />
  );
}
