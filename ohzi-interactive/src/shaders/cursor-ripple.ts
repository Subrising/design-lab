export const cursorRippleVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const cursorRippleFragment = /* glsl */ `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform vec2 uResolution;
  uniform float uIntensity;
  varying vec2 vUv;

  #define PI 3.14159265359

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
    for (int i = 0; i < 5; i++) {
      value += amplitude * noise(p);
      p *= 2.0;
      amplitude *= 0.5;
    }
    return value;
  }

  void main() {
    vec2 uv = vUv;
    vec2 mouse = uMouse;

    float dist = distance(uv, mouse);
    float ripple = sin(dist * 30.0 - uTime * 3.0) * exp(-dist * 5.0) * uIntensity;

    float n = fbm(uv * 4.0 + uTime * 0.2);
    float n2 = fbm(uv * 8.0 - uTime * 0.15 + vec2(5.2, 1.3));

    vec3 color1 = vec3(0.02, 0.02, 0.06);
    vec3 color2 = vec3(0.05, 0.1, 0.25);
    vec3 color3 = vec3(0.15, 0.05, 0.3);
    vec3 accent = vec3(0.3, 0.6, 1.0);

    vec3 col = mix(color1, color2, n);
    col = mix(col, color3, n2 * 0.5);
    col += accent * ripple * 0.5;
    col += accent * exp(-dist * 8.0) * uIntensity * 0.3;

    float vignette = 1.0 - dot(uv - 0.5, uv - 0.5) * 1.5;
    col *= vignette;

    gl_FragColor = vec4(col, 1.0);
  }
`;
