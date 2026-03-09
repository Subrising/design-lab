export const warpVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const warpFragment = /* glsl */ `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uProgress;
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

  void main() {
    vec2 uv = vUv;
    vec2 center = vec2(0.5);

    vec2 toCenter = uv - center;
    float angle = atan(toCenter.y, toCenter.x);
    float dist = length(toCenter);

    float warp = sin(angle * 6.0 + uTime * 0.5) * 0.02;
    warp += sin(dist * 20.0 - uTime * 2.0) * 0.01 * uProgress;

    vec2 warped = uv + normalize(toCenter) * warp;

    float n1 = noise(warped * 3.0 + uTime * 0.1);
    float n2 = noise(warped * 6.0 - uTime * 0.2);

    float tunnel = smoothstep(0.0, 0.5, dist) * smoothstep(1.0, 0.3, dist);

    vec3 deep = vec3(0.01, 0.01, 0.03);
    vec3 mid = vec3(0.04, 0.06, 0.15);
    vec3 bright = vec3(0.1, 0.2, 0.5);
    vec3 glow = vec3(0.4, 0.3, 0.8);

    vec3 col = mix(deep, mid, n1 * tunnel);
    col += bright * n2 * 0.3 * tunnel;
    col += glow * exp(-dist * 4.0) * 0.2 * (1.0 + sin(uTime) * 0.5);

    float mouseGlow = exp(-distance(uv, uMouse) * 6.0) * 0.4;
    col += vec3(0.3, 0.5, 1.0) * mouseGlow;

    float scanline = sin(uv.y * 300.0 + uTime * 5.0) * 0.02;
    col += scanline;

    gl_FragColor = vec4(col, 1.0);
  }
`;
