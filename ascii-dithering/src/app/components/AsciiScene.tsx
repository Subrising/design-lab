"use client";

import { useEffect, useRef, useCallback } from "react";
import * as THREE from "three";

// ASCII characters ordered from darkest to brightest
const ASCII_CHARS = " .,:;+*?%S#@";

function createFontAtlas(
  charSet: string,
  cellSize: number
): { texture: THREE.CanvasTexture; cols: number; rows: number } {
  const cols = charSet.length;
  const rows = 1;
  const canvas = document.createElement("canvas");
  canvas.width = cols * cellSize;
  canvas.height = rows * cellSize;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#ffffff";
  ctx.font = `bold ${cellSize * 0.85}px "JetBrains Mono", "Courier New", monospace`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  for (let i = 0; i < charSet.length; i++) {
    ctx.fillText(charSet[i], i * cellSize + cellSize / 2, cellSize / 2);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;

  return { texture, cols, rows };
}

// Vertex shader — simple fullscreen quad
const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}
`;

// Fragment shader for the 3D scene (rendered to a render target)
const sceneVertexShader = `
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

const sceneFragmentShader = `
uniform float uTime;
uniform vec2 uMouse;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

// Simplex noise helpers
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
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
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
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
  // Lighting
  vec3 lightDir = normalize(vec3(0.5, 1.0, 0.8));
  float diff = max(dot(vNormal, lightDir), 0.0);
  float ambient = 0.15;

  // Noise-based color variation
  float n = snoise(vPosition * 2.0 + uTime * 0.3);
  float n2 = snoise(vPosition * 4.0 - uTime * 0.5);

  // Color palette — terminal greens and cyans
  vec3 col1 = vec3(0.0, 1.0, 0.25);  // bright green
  vec3 col2 = vec3(0.0, 0.8, 0.9);   // cyan
  vec3 col3 = vec3(0.4, 0.0, 1.0);   // purple accent

  vec3 color = mix(col1, col2, n * 0.5 + 0.5);
  color = mix(color, col3, n2 * 0.3 + 0.15);

  // Apply lighting
  color *= (diff * 0.7 + ambient);

  // Rim lighting
  vec3 viewDir = normalize(-vPosition);
  float rim = 1.0 - max(dot(viewDir, vNormal), 0.0);
  rim = pow(rim, 3.0);
  color += rim * vec3(0.0, 1.0, 0.5) * 0.5;

  gl_FragColor = vec4(color, 1.0);
}
`;

// ASCII post-process fragment shader
const asciiFragmentShader = `
uniform sampler2D uSceneTexture;
uniform sampler2D uFontAtlas;
uniform vec2 uResolution;
uniform float uCharCount;
uniform float uCellSize;
uniform vec2 uMouse;
uniform float uTime;
uniform float uDistortionStrength;

varying vec2 vUv;

void main() {
  vec2 uv = vUv;

  // Mouse distortion — ripple effect around cursor
  vec2 mouseUV = uMouse;
  float dist = distance(uv, mouseUV);
  float distortRadius = 0.25;
  if (dist < distortRadius) {
    float strength = (1.0 - dist / distortRadius);
    strength = pow(strength, 2.0) * uDistortionStrength;
    vec2 dir = normalize(uv - mouseUV);
    float wave = sin(dist * 30.0 - uTime * 4.0) * 0.5 + 0.5;
    uv += dir * strength * 0.05 * wave;
  }

  // Calculate cell grid
  vec2 cellCount = floor(uResolution / uCellSize);
  vec2 cell = floor(uv * cellCount);
  vec2 cellUV = fract(uv * cellCount);

  // Sample scene at cell center
  vec2 sampleUV = (cell + 0.5) / cellCount;
  // Clamp to avoid edge artifacts
  sampleUV = clamp(sampleUV, 0.001, 0.999);
  vec4 sceneColor = texture2D(uSceneTexture, sampleUV);

  // Calculate luminance
  float luma = dot(sceneColor.rgb, vec3(0.299, 0.587, 0.114));

  // Map luminance to character index
  float charIndex = floor(luma * (uCharCount - 1.0) + 0.5);
  charIndex = clamp(charIndex, 0.0, uCharCount - 1.0);

  // Sample font atlas
  float atlasU = (charIndex + cellUV.x) / uCharCount;
  float atlasV = cellUV.y;
  vec4 charSample = texture2D(uFontAtlas, vec2(atlasU, 1.0 - atlasV));

  // Tint with scene color — keep the character shape but use scene hue
  vec3 tintColor = sceneColor.rgb;
  // Boost saturation slightly
  float maxC = max(max(tintColor.r, tintColor.g), tintColor.b);
  if (maxC > 0.01) {
    tintColor = mix(vec3(maxC), tintColor, 1.3);
  }

  // Very dark background
  vec3 bgColor = vec3(0.02);

  // Final color: character shape * tint color
  float charAlpha = charSample.r;
  vec3 finalColor = mix(bgColor, tintColor * 1.2, charAlpha);

  // Subtle scanline effect
  float scanline = sin(gl_FragCoord.y * 1.5) * 0.03 + 0.97;
  finalColor *= scanline;

  // Slight vignette
  vec2 vigUV = vUv * 2.0 - 1.0;
  float vig = 1.0 - dot(vigUV * 0.5, vigUV * 0.5);
  finalColor *= vig;

  gl_FragColor = vec4(finalColor, 1.0);
}
`;

interface AsciiSceneProps {
  cellSize: number;
  distortionStrength: number;
  sceneMode: "spheres" | "torus" | "terrain";
  colorMode: "green" | "cyan" | "rainbow";
}

export default function AsciiScene({
  cellSize,
  distortionStrength,
  sceneMode,
  colorMode,
}: AsciiSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const frameRef = useRef<number>(0);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    mouseRef.current.x = e.clientX / window.innerWidth;
    mouseRef.current.y = 1.0 - e.clientY / window.innerHeight;
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: false });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(1); // Keep pixel ratio at 1 for crisp ASCII
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Render target for the 3D scene
    const renderTarget = new THREE.WebGLRenderTarget(
      window.innerWidth,
      window.innerHeight,
      {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat,
      }
    );

    // 3D Scene
    const scene3D = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.z = 5;

    // Scene material with noise
    const sceneMaterial = new THREE.ShaderMaterial({
      vertexShader: sceneVertexShader,
      fragmentShader: sceneFragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      },
    });

    // Create scene objects based on mode
    const objects: THREE.Mesh[] = [];

    const createObjects = (mode: string) => {
      objects.forEach((obj) => {
        scene3D.remove(obj);
        obj.geometry.dispose();
      });
      objects.length = 0;

      if (mode === "spheres") {
        // Central sphere + orbiting smaller ones
        const mainSphere = new THREE.Mesh(
          new THREE.IcosahedronGeometry(1.5, 5),
          sceneMaterial
        );
        scene3D.add(mainSphere);
        objects.push(mainSphere);

        for (let i = 0; i < 6; i++) {
          const small = new THREE.Mesh(
            new THREE.IcosahedronGeometry(0.3, 3),
            sceneMaterial
          );
          scene3D.add(small);
          objects.push(small);
        }
      } else if (mode === "torus") {
        const torus = new THREE.Mesh(
          new THREE.TorusKnotGeometry(1.2, 0.4, 128, 32),
          sceneMaterial
        );
        scene3D.add(torus);
        objects.push(torus);
      } else {
        // terrain — a displaced plane
        const plane = new THREE.Mesh(
          new THREE.PlaneGeometry(8, 8, 128, 128),
          sceneMaterial
        );
        plane.rotation.x = -Math.PI * 0.35;
        plane.position.y = -0.5;
        scene3D.add(plane);
        objects.push(plane);
      }
    };

    createObjects(sceneMode);

    // Font atlas
    const atlasData = createFontAtlas(ASCII_CHARS, 32);

    // Post-process scene (fullscreen quad)
    const postScene = new THREE.Scene();
    const postCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const postMaterial = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader: asciiFragmentShader,
      uniforms: {
        uSceneTexture: { value: renderTarget.texture },
        uFontAtlas: { value: atlasData.texture },
        uResolution: {
          value: new THREE.Vector2(window.innerWidth, window.innerHeight),
        },
        uCharCount: { value: ASCII_CHARS.length },
        uCellSize: { value: cellSize },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
        uTime: { value: 0 },
        uDistortionStrength: { value: distortionStrength },
      },
    });

    const quad = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      postMaterial
    );
    postScene.add(quad);

    // Color mode adjustments
    const updateColorMode = (mode: string) => {
      const frag = sceneFragmentShader
        .replace(
          "vec3 col1 = vec3(0.0, 1.0, 0.25);",
          mode === "cyan"
            ? "vec3 col1 = vec3(0.0, 0.85, 1.0);"
            : mode === "rainbow"
            ? "vec3 col1 = vec3(1.0, 0.3, 0.1);"
            : "vec3 col1 = vec3(0.0, 1.0, 0.25);"
        )
        .replace(
          "vec3 col2 = vec3(0.0, 0.8, 0.9);",
          mode === "cyan"
            ? "vec3 col2 = vec3(0.2, 0.4, 1.0);"
            : mode === "rainbow"
            ? "vec3 col2 = vec3(1.0, 0.8, 0.0);"
            : "vec3 col2 = vec3(0.0, 0.8, 0.9);"
        )
        .replace(
          "vec3 col3 = vec3(0.4, 0.0, 1.0);",
          mode === "cyan"
            ? "vec3 col3 = vec3(0.0, 1.0, 0.6);"
            : mode === "rainbow"
            ? "vec3 col3 = vec3(0.8, 0.0, 1.0);"
            : "vec3 col3 = vec3(0.4, 0.0, 1.0);"
        );
      sceneMaterial.fragmentShader = frag;
      sceneMaterial.needsUpdate = true;
    };

    updateColorMode(colorMode);

    // Animation
    const clock = new THREE.Clock();

    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Update uniforms
      sceneMaterial.uniforms.uTime.value = time;
      sceneMaterial.uniforms.uMouse.value.set(
        mouseRef.current.x,
        mouseRef.current.y
      );
      postMaterial.uniforms.uTime.value = time;
      postMaterial.uniforms.uMouse.value.set(
        mouseRef.current.x,
        mouseRef.current.y
      );
      postMaterial.uniforms.uCellSize.value = cellSize;
      postMaterial.uniforms.uDistortionStrength.value = distortionStrength;

      // Animate objects
      if (sceneMode === "spheres") {
        if (objects[0]) {
          objects[0].rotation.x = time * 0.2;
          objects[0].rotation.y = time * 0.3;
        }
        for (let i = 1; i < objects.length; i++) {
          const angle = (i / (objects.length - 1)) * Math.PI * 2 + time * 0.5;
          const radius = 2.5 + Math.sin(time + i) * 0.3;
          objects[i].position.x = Math.cos(angle) * radius;
          objects[i].position.y = Math.sin(angle * 0.7 + time) * 0.8;
          objects[i].position.z = Math.sin(angle) * radius;
          objects[i].rotation.x = time * 2;
          objects[i].rotation.y = time * 3;
        }
      } else if (sceneMode === "torus") {
        if (objects[0]) {
          objects[0].rotation.x = time * 0.4;
          objects[0].rotation.y = time * 0.6;
        }
      } else {
        // Terrain — vertex displacement via time in shader handles it
        if (objects[0]) {
          objects[0].rotation.z = Math.sin(time * 0.2) * 0.1;
        }
      }

      // Render 3D scene to render target
      renderer.setRenderTarget(renderTarget);
      renderer.render(scene3D, camera);

      // Render ASCII post-process to screen
      renderer.setRenderTarget(null);
      renderer.render(postScene, postCamera);
    };

    animate();

    // Mouse
    window.addEventListener("mousemove", handleMouseMove);

    // Resize
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      renderer.setSize(w, h);
      renderTarget.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      postMaterial.uniforms.uResolution.value.set(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      renderTarget.dispose();
      atlasData.texture.dispose();
      objects.forEach((obj) => obj.geometry.dispose());
      sceneMaterial.dispose();
      postMaterial.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [cellSize, distortionStrength, sceneMode, colorMode, handleMouseMove]);

  return <div ref={containerRef} className="fixed inset-0 z-0" />;
}
