export const transitionVertex = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const transitionFragment = /* glsl */ `
uniform sampler2D uScene1;
uniform sampler2D uScene2;
uniform float uProgress;
uniform float uIntensity;
uniform vec2 uResolution;

varying vec2 vUv;

// Smooth noise for organic transitions
float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

void main() {
  vec2 uv = vUv;

  // Create organic displacement pattern
  float n = noise(uv * 6.0 + uProgress * 2.0);
  float displacement = n * uIntensity * 0.15;

  // Displace UVs based on transition progress
  vec2 uv1 = uv + vec2(displacement * uProgress, displacement * uProgress * 0.5);
  vec2 uv2 = uv - vec2(displacement * (1.0 - uProgress), displacement * (1.0 - uProgress) * 0.5);

  vec4 scene1 = texture2D(uScene1, uv1);
  vec4 scene2 = texture2D(uScene2, uv2);

  // Smooth blend with noise-driven edge
  float edge = smoothstep(uProgress - 0.1, uProgress + 0.1, vUv.y + n * 0.3 - 0.15);

  gl_FragColor = mix(scene1, scene2, edge);
}
`;
