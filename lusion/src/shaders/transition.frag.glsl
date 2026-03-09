uniform float uProgress;
uniform float uTime;
uniform vec2 uMouse;

varying vec2 vUv;

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

void main() {
  vec2 uv = vUv;

  // Radial wipe from mouse position
  float dist = length(uv - uMouse);
  float noiseVal = noise(uv * 10.0 + uTime) * 0.15;

  float progress = uProgress * 1.4 - 0.2;
  float edge = smoothstep(progress - 0.1, progress + 0.1, dist + noiseVal);

  vec3 color = vec3(0.0);
  float alpha = 1.0 - edge;

  // Edge glow
  float edgeGlow = smoothstep(0.0, 0.05, alpha) * smoothstep(0.2, 0.05, alpha);
  color += vec3(0.3, 0.1, 0.5) * edgeGlow * 3.0;

  gl_FragColor = vec4(color, alpha);
}
