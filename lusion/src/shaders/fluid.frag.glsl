uniform float uTime;
uniform vec2 uMouse;
uniform vec2 uResolution;
uniform float uScrollProgress;

varying vec2 vUv;

// Hash functions
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

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  float frequency = 1.0;
  for (int i = 0; i < 6; i++) {
    value += amplitude * noise(p * frequency);
    frequency *= 2.0;
    amplitude *= 0.5;
  }
  return value;
}

void main() {
  vec2 uv = vUv;
  vec2 mouse = uMouse;

  // Create flowing fluid pattern
  float time = uTime * 0.15;

  // Mouse influence creates fluid distortion
  vec2 mouseDir = uv - mouse;
  float mouseDist = length(mouseDir);
  float mouseEffect = smoothstep(0.5, 0.0, mouseDist);

  // Warp coordinates
  vec2 warpedUv = uv;
  warpedUv += mouseEffect * normalize(mouseDir + 0.001) * 0.1;

  // Multi-layer fluid
  float f1 = fbm(warpedUv * 3.0 + vec2(time, time * 0.7));
  float f2 = fbm(warpedUv * 5.0 - vec2(time * 0.5, time * 0.3) + f1 * 0.5);
  float f3 = fbm(warpedUv * 8.0 + vec2(f2 * 0.3, f1 * 0.2) + time * 0.2);

  float fluid = f1 * 0.5 + f2 * 0.3 + f3 * 0.2;
  fluid = pow(fluid, 1.5);

  // Color palette - deep blues and purples
  vec3 col1 = vec3(0.02, 0.01, 0.05); // near black
  vec3 col2 = vec3(0.1, 0.02, 0.2);   // dark purple
  vec3 col3 = vec3(0.05, 0.1, 0.3);   // dark blue
  vec3 col4 = vec3(0.2, 0.05, 0.3);   // purple

  vec3 color = mix(col1, col2, smoothstep(0.2, 0.4, fluid));
  color = mix(color, col3, smoothstep(0.4, 0.6, fluid));
  color = mix(color, col4, smoothstep(0.6, 0.8, fluid));

  // Mouse glow
  color += mouseEffect * vec3(0.15, 0.05, 0.25) * 1.5;

  // Scroll color shift
  color = mix(color, col4 * 1.5, uScrollProgress * 0.3);

  // Edge darkening
  float vignette = smoothstep(1.5, 0.5, length(uv - 0.5) * 2.0);
  color *= vignette;

  gl_FragColor = vec4(color, 1.0);
}
