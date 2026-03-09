"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/* ─── GLSL Vertex Shader ─── */
const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

/* ─── GLSL Fragment Shader ─── */
const fragmentShader = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec2 uMouse;

  varying vec2 vUv;

  /* ── SDF Primitives ── */

  float sdSphere(vec3 p, float r) {
    return length(p) - r;
  }

  /* Polynomial smooth-min for organic metaball blending */
  float smin(float a, float b, float k) {
    float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
    return mix(b, a, h) - k * h * (1.0 - h);
  }

  /* ── Scene SDF ── */

  float sceneSDF(vec3 p) {
    float t = uTime;

    // Central blob
    vec3 c0 = vec3(0.0, 0.0, 0.0);
    float d = sdSphere(p - c0, 1.0);

    // Orbiting blobs with varied motion
    vec3 c1 = vec3(
      sin(t * 0.7) * 1.8,
      cos(t * 0.5) * 1.2,
      sin(t * 0.3) * 0.8
    );
    d = smin(d, sdSphere(p - c1, 0.7), 0.8);

    vec3 c2 = vec3(
      cos(t * 0.6) * 1.5,
      sin(t * 0.8) * 1.0,
      cos(t * 0.4) * 1.2
    );
    d = smin(d, sdSphere(p - c2, 0.6), 0.7);

    vec3 c3 = vec3(
      sin(t * 0.9 + 2.0) * 1.3,
      cos(t * 0.4 + 1.0) * 1.5,
      sin(t * 0.6 + 3.0) * 0.6
    );
    d = smin(d, sdSphere(p - c3, 0.55), 0.6);

    vec3 c4 = vec3(
      cos(t * 0.5 + 4.0) * 1.0,
      sin(t * 0.7 + 2.0) * 0.8,
      cos(t * 0.8 + 1.0) * 1.4
    );
    d = smin(d, sdSphere(p - c4, 0.5), 0.7);

    // Mouse-interactive blob — follows cursor in world space
    vec3 mousePos = vec3(uMouse * 2.5, 0.5 + sin(t * 1.2) * 0.3);
    d = smin(d, sdSphere(p - mousePos, 0.65), 0.9);

    // Small accent blobs
    vec3 c5 = vec3(
      sin(t * 1.1 + 5.0) * 2.0,
      cos(t * 0.9 + 3.0) * 1.8,
      sin(t * 0.7 + 2.0) * 0.5
    );
    d = smin(d, sdSphere(p - c5, 0.35), 0.5);

    vec3 c6 = vec3(
      cos(t * 0.8 + 1.5) * 1.7,
      sin(t * 1.0 + 4.0) * 0.6,
      cos(t * 0.5 + 5.0) * 1.6
    );
    d = smin(d, sdSphere(p - c6, 0.4), 0.6);

    return d;
  }

  /* ── Normal estimation via central differences ── */

  vec3 calcNormal(vec3 p) {
    vec2 e = vec2(0.001, 0.0);
    return normalize(vec3(
      sceneSDF(p + e.xyy) - sceneSDF(p - e.xyy),
      sceneSDF(p + e.yxy) - sceneSDF(p - e.yxy),
      sceneSDF(p + e.yyx) - sceneSDF(p - e.yyx)
    ));
  }

  /* ── Soft shadow (optional, adds depth) ── */

  float softShadow(vec3 ro, vec3 rd, float mint, float maxt, float k) {
    float res = 1.0;
    float t = mint;
    for (int i = 0; i < 32; i++) {
      float h = sceneSDF(ro + rd * t);
      res = min(res, k * h / t);
      t += clamp(h, 0.02, 0.2);
      if (h < 0.001 || t > maxt) break;
    }
    return clamp(res, 0.0, 1.0);
  }

  /* ── Ambient occlusion ── */

  float calcAO(vec3 p, vec3 n) {
    float occ = 0.0;
    float sca = 1.0;
    for (int i = 0; i < 5; i++) {
      float h = 0.01 + 0.12 * float(i) / 4.0;
      float d = sceneSDF(p + h * n);
      occ += (h - d) * sca;
      sca *= 0.95;
    }
    return clamp(1.0 - 3.0 * occ, 0.0, 1.0);
  }

  void main() {
    // Normalized coordinates centered at origin
    vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution) / min(uResolution.x, uResolution.y);

    // Camera setup — orbit slightly with time for life
    float camAngle = uTime * 0.08;
    vec3 ro = vec3(sin(camAngle) * 5.0, 1.5 + sin(uTime * 0.15) * 0.5, cos(camAngle) * 5.0);
    vec3 target = vec3(0.0, 0.0, 0.0);
    vec3 forward = normalize(target - ro);
    vec3 right = normalize(cross(forward, vec3(0.0, 1.0, 0.0)));
    vec3 up = cross(right, forward);
    vec3 rd = normalize(forward * 1.8 + right * uv.x + up * uv.y);

    // ── Raymarching ──
    float t = 0.0;
    float d;
    vec3 p;
    bool hit = false;

    for (int i = 0; i < 128; i++) {
      p = ro + rd * t;
      d = sceneSDF(p);
      if (d < 0.001) {
        hit = true;
        break;
      }
      t += d;
      if (t > 20.0) break;
    }

    // ── Shading ──
    vec3 col = vec3(0.02, 0.02, 0.05); // dark background

    if (hit) {
      vec3 n = calcNormal(p);
      vec3 viewDir = normalize(ro - p);

      // Fresnel rim lighting
      float fresnel = pow(1.0 - max(dot(n, viewDir), 0.0), 3.0);

      // Key light
      vec3 lightDir1 = normalize(vec3(2.0, 4.0, 3.0));
      float diff1 = max(dot(n, lightDir1), 0.0);
      float shadow1 = softShadow(p + n * 0.02, lightDir1, 0.02, 8.0, 16.0);

      // Fill light
      vec3 lightDir2 = normalize(vec3(-3.0, 1.0, -2.0));
      float diff2 = max(dot(n, lightDir2), 0.0);

      // Specular (Blinn-Phong)
      vec3 halfDir = normalize(lightDir1 + viewDir);
      float spec = pow(max(dot(n, halfDir), 0.0), 64.0);

      // Ambient occlusion
      float ao = calcAO(p, n);

      // Color palette — iridescent gradient based on normal
      vec3 baseColor = mix(
        vec3(0.15, 0.4, 0.9),   // blue
        vec3(0.8, 0.2, 0.6),    // magenta
        fresnel
      );
      baseColor = mix(
        baseColor,
        vec3(0.1, 0.9, 0.7),    // teal accent
        pow(max(dot(n, vec3(0.0, 1.0, 0.0)), 0.0), 2.0) * 0.4
      );

      // Compose lighting
      vec3 ambient = vec3(0.08, 0.06, 0.12) * ao;
      vec3 diffuse = baseColor * (diff1 * shadow1 * 0.8 + diff2 * 0.3) * ao;
      vec3 specular = vec3(1.0, 0.95, 0.9) * spec * shadow1 * 0.6;
      vec3 rim = vec3(0.4, 0.6, 1.0) * fresnel * 1.2;

      // Sub-surface scattering approximation
      float sss = max(dot(viewDir, -lightDir1), 0.0);
      vec3 subsurface = vec3(0.9, 0.3, 0.5) * pow(sss, 3.0) * 0.15;

      col = ambient + diffuse + specular + rim + subsurface;

      // Inner glow / translucency
      col += baseColor * 0.08;
    } else {
      // Subtle gradient background
      float grad = length(uv) * 0.5;
      col = mix(vec3(0.03, 0.03, 0.08), vec3(0.01, 0.01, 0.03), grad);
    }

    // Tone mapping (ACES-ish)
    col = col / (col + vec3(1.0));

    // Gamma correction
    col = pow(col, vec3(1.0 / 2.2));

    // Vignette
    float vig = 1.0 - 0.3 * dot(uv, uv);
    col *= vig;

    gl_FragColor = vec4(col, 1.0);
  }
`;

export default function MetaballScene() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Three.js setup
    const renderer = new THREE.WebGLRenderer({ antialias: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    // Fullscreen quad
    const geometry = new THREE.PlaneGeometry(2, 2);
    const uniforms = {
      uTime: { value: 0 },
      uResolution: {
        value: new THREE.Vector2(
          window.innerWidth * Math.min(window.devicePixelRatio, 2),
          window.innerHeight * Math.min(window.devicePixelRatio, 2)
        ),
      },
      uMouse: { value: new THREE.Vector2(0, 0) },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Mouse tracking
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

    const onMouseMove = (e: MouseEvent) => {
      mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouse.targetX = (e.touches[0].clientX / window.innerWidth) * 2 - 1;
        mouse.targetY = -(e.touches[0].clientY / window.innerHeight) * 2 + 1;
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("touchmove", onTouchMove, { passive: true });

    // Resize handler
    const onResize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      renderer.setSize(window.innerWidth, window.innerHeight);
      uniforms.uResolution.value.set(
        window.innerWidth * dpr,
        window.innerHeight * dpr
      );
    };

    window.addEventListener("resize", onResize);

    // Animation loop
    let animationId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);

      // Smooth mouse lerp
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      uniforms.uTime.value = clock.getElapsedTime();
      uniforms.uMouse.value.set(mouse.x, mouse.y);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("resize", onResize);
      container.removeChild(renderer.domElement);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} className="fixed inset-0" />;
}
