"use client";

import { useRef } from "react";
import { useFrame, useThree, extend } from "@react-three/fiber";
import * as THREE from "three";

// Custom chromatic aberration + vignette + bloom pass as a fullscreen quad
// We avoid the postprocessing library dependency issues by doing it manually

const postVertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const postFragmentShader = /* glsl */ `
  uniform sampler2D tDiffuse;
  uniform float uTime;
  uniform vec2 uMouse;
  varying vec2 vUv;

  void main() {
    vec2 uv = vUv;

    // Chromatic aberration
    float aberration = 0.003 + 0.002 * sin(uTime * 0.5);
    vec2 dir = uv - 0.5;
    float d = length(dir);

    float r = texture2D(tDiffuse, uv + dir * aberration).r;
    float g = texture2D(tDiffuse, uv).g;
    float b = texture2D(tDiffuse, uv - dir * aberration).b;

    vec3 color = vec3(r, g, b);

    // Vignette
    float vignette = 1.0 - d * d * 1.2;
    color *= vignette;

    // Film grain
    float grain = fract(sin(dot(uv * uTime, vec2(12.9898, 78.233))) * 43758.5453);
    color += (grain - 0.5) * 0.03;

    // Subtle bloom glow
    color += color * color * 0.15;

    gl_FragColor = vec4(color, 1.0);
  }
`;

export { postVertexShader, postFragmentShader };
