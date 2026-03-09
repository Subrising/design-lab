export const bgVertex = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const bgFragment = /* glsl */ `
uniform float uTime;
uniform float uScrollProgress;
uniform vec2 uMouse;
uniform vec2 uResolution;

varying vec2 vUv;

// FBM noise for organic background patterns
float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
    f.y
  );
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  for (int i = 0; i < 5; i++) {
    value += amplitude * noise(p);
    p *= 2.0;
    amplitude *= 0.5;
  }
  return value;
}

void main() {
  vec2 uv = vUv;

  // Warm cream base (#fff5f0)
  vec3 cream = vec3(1.0, 0.96, 0.94);
  // Charcoal (#171717)
  vec3 dark = vec3(0.09, 0.09, 0.09);
  // Coral pink (#f1abbd)
  vec3 coral = vec3(0.945, 0.671, 0.741);
  // Golden yellow (#f7c704)
  vec3 gold = vec3(0.969, 0.78, 0.016);

  // Scroll-driven color transition between scenes
  float sceneBlend = smoothstep(0.0, 1.0, uScrollProgress);
  vec3 baseColor = mix(cream, dark, sceneBlend * 0.3);

  // Organic noise pattern
  float n = fbm(uv * 3.0 + uTime * 0.05);
  float n2 = fbm(uv * 5.0 - uTime * 0.03 + 10.0);

  // Mouse influence on pattern
  float mouseDist = length(uv - uMouse * 0.5 - 0.5);
  float mouseGlow = smoothstep(0.5, 0.0, mouseDist) * 0.15;

  // Color layering
  vec3 color = baseColor;
  color = mix(color, coral, n * 0.08 + mouseGlow);
  color = mix(color, gold, n2 * 0.04 * (1.0 - sceneBlend));

  // Subtle radial gradient
  float vignette = 1.0 - smoothstep(0.3, 1.2, length(uv - 0.5) * 1.2);
  color *= 0.92 + vignette * 0.08;

  // Film grain
  float grain = hash(uv * uResolution + uTime) * 0.015;
  color += grain;

  gl_FragColor = vec4(color, 1.0);
}
`;
