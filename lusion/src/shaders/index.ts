export const distortionVertex = /* glsl */ `
uniform float uTime;
uniform vec2 uMouse;
uniform float uHover;
uniform float uScrollProgress;

varying vec2 vUv;
varying float vDistortion;
varying float vElevation;

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
  vUv = uv;
  vec3 pos = position;
  float mouseDistance = length(uv - uMouse);
  float mouseInfluence = smoothstep(0.5, 0.0, mouseDistance) * uHover;
  float noise1 = snoise(vec3(pos.x * 2.0, pos.y * 2.0, uTime * 0.3));
  float noise2 = snoise(vec3(pos.x * 4.0 + 100.0, pos.y * 4.0, uTime * 0.5));
  float distortion = noise1 * 0.15 + noise2 * 0.08;
  distortion += mouseInfluence * 0.3;
  float scrollMorph = sin(uScrollProgress * 3.14159) * 0.2;
  distortion += scrollMorph * noise1;
  pos.z += distortion;
  vDistortion = distortion;
  vElevation = pos.z;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`;

export const distortionFragment = /* glsl */ `
uniform float uTime;
uniform vec2 uMouse;
uniform float uHover;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform float uScrollProgress;

varying vec2 vUv;
varying float vDistortion;
varying float vElevation;

void main() {
  vec3 color = mix(uColor1, uColor2, smoothstep(-0.2, 0.2, vDistortion));
  color = mix(color, uColor3, smoothstep(0.1, 0.4, vDistortion));
  float mouseDistance = length(vUv - uMouse);
  float glow = smoothstep(0.4, 0.0, mouseDistance) * uHover * 0.5;
  color += vec3(glow * 0.3, glow * 0.1, glow * 0.4);
  float rim = pow(1.0 - abs(vElevation * 3.0), 3.0);
  color += rim * 0.1;
  color = mix(color, uColor3, uScrollProgress * 0.3);
  float vignette = smoothstep(1.4, 0.5, length(vUv - 0.5) * 2.0);
  color *= vignette;
  gl_FragColor = vec4(color, 1.0);
}
`;

export const particlesVertex = /* glsl */ `
uniform float uTime;
uniform vec2 uMouse;
uniform float uPixelRatio;
uniform float uScrollProgress;

attribute float aScale;
attribute float aPhase;

varying float vAlpha;
varying float vScale;

void main() {
  vec3 pos = position;
  float phase = aPhase * 6.28318;
  pos.x += sin(uTime * 0.3 + phase) * 0.5;
  pos.y += cos(uTime * 0.2 + phase * 1.3) * 0.3;
  pos.z += sin(uTime * 0.4 + phase * 0.7) * 0.4;

  vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
  vec4 projected = projectionMatrix * mvPos;
  vec2 screenPos = projected.xy / projected.w;
  vec2 mouseDir = screenPos - (uMouse * 2.0 - 1.0);
  float mouseDist = length(mouseDir);
  float repulsion = smoothstep(0.5, 0.0, mouseDist) * 2.0;
  pos.xy += normalize(mouseDir + 0.001) * repulsion * 0.3;

  pos *= 1.0 + uScrollProgress * 0.5;

  vec4 finalMvPos = modelViewMatrix * vec4(pos, 1.0);
  float size = aScale * uPixelRatio * 3.0;
  size *= (1.0 / -finalMvPos.z) * 50.0;
  size = max(size, 1.0);

  gl_PointSize = size;
  gl_Position = projectionMatrix * finalMvPos;
  vAlpha = smoothstep(0.0, 0.2, aScale) * (1.0 - uScrollProgress * 0.5);
  vScale = aScale;
}
`;

export const particlesFragment = /* glsl */ `
uniform float uTime;
varying float vAlpha;
varying float vScale;

void main() {
  float dist = length(gl_PointCoord - 0.5);
  if (dist > 0.5) discard;
  float alpha = smoothstep(0.5, 0.1, dist) * vAlpha * 0.6;
  vec3 color = vec3(0.95, 0.9, 1.0);
  color += vScale * vec3(0.05, 0.0, 0.1);
  gl_FragColor = vec4(color, alpha);
}
`;

export const fluidVertex = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const fluidFragment = /* glsl */ `
uniform float uTime;
uniform vec2 uMouse;
uniform vec2 uResolution;
uniform float uScrollProgress;

varying vec2 vUv;

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
  float time = uTime * 0.15;
  vec2 mouseDir = uv - mouse;
  float mouseDist = length(mouseDir);
  float mouseEffect = smoothstep(0.5, 0.0, mouseDist);
  vec2 warpedUv = uv;
  warpedUv += mouseEffect * normalize(mouseDir + 0.001) * 0.1;
  float f1 = fbm(warpedUv * 3.0 + vec2(time, time * 0.7));
  float f2 = fbm(warpedUv * 5.0 - vec2(time * 0.5, time * 0.3) + f1 * 0.5);
  float f3 = fbm(warpedUv * 8.0 + vec2(f2 * 0.3, f1 * 0.2) + time * 0.2);
  float fluid = f1 * 0.5 + f2 * 0.3 + f3 * 0.2;
  fluid = pow(fluid, 1.5);
  vec3 col1 = vec3(0.02, 0.01, 0.05);
  vec3 col2 = vec3(0.1, 0.02, 0.2);
  vec3 col3 = vec3(0.05, 0.1, 0.3);
  vec3 col4 = vec3(0.2, 0.05, 0.3);
  vec3 color = mix(col1, col2, smoothstep(0.2, 0.4, fluid));
  color = mix(color, col3, smoothstep(0.4, 0.6, fluid));
  color = mix(color, col4, smoothstep(0.6, 0.8, fluid));
  color += mouseEffect * vec3(0.15, 0.05, 0.25) * 1.5;
  color = mix(color, col4 * 1.5, uScrollProgress * 0.3);
  float vignette = smoothstep(1.5, 0.5, length(uv - 0.5) * 2.0);
  color *= vignette;
  gl_FragColor = vec4(color, 1.0);
}
`;

export const morphVertex = /* glsl */ `
uniform float uTime;
uniform float uMorphProgress;
uniform vec2 uMouse;

varying vec2 vUv;
varying float vMorph;
varying vec3 vNormal;
varying vec3 vPosition;

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
  vUv = uv;
  vec3 pos = position;
  float morphNoise = snoise(vec3(pos.xy * 2.0, uTime * 0.2)) * 0.5 + 0.5;
  float morph = uMorphProgress * morphNoise;
  float expansion = sin(morph * 3.14159) * 0.3;
  pos *= 1.0 + expansion;
  float twist = morph * 3.14159 * 2.0;
  float cosT = cos(twist * pos.y * 0.5);
  float sinT = sin(twist * pos.y * 0.5);
  pos.xz = mat2(cosT, -sinT, sinT, cosT) * pos.xz;
  vec2 mouseDir = uv - uMouse;
  float mouseDist = length(mouseDir);
  float mouseForce = smoothstep(0.5, 0.0, mouseDist) * 0.15;
  pos.z += mouseForce;
  float displacement = snoise(vec3(pos.x * 3.0, pos.y * 3.0, uTime * 0.3));
  pos += normal * displacement * 0.08 * (1.0 + morph * 0.5);
  vMorph = morph;
  vNormal = normalMatrix * normal;
  vPosition = (modelViewMatrix * vec4(pos, 1.0)).xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`;

export const morphFragment = /* glsl */ `
uniform float uTime;
uniform float uMorphProgress;

varying vec2 vUv;
varying float vMorph;
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
  vec3 viewDir = normalize(-vPosition);
  float fresnel = pow(1.0 - max(dot(normalize(vNormal), viewDir), 0.0), 3.0);
  vec3 baseColor = vec3(0.05, 0.02, 0.1);
  vec3 morphColor = vec3(0.15, 0.03, 0.25);
  vec3 rimColor = vec3(0.4, 0.1, 0.8);
  vec3 color = mix(baseColor, morphColor, vMorph);
  color += rimColor * fresnel * 0.8;
  float iridescence = sin(fresnel * 6.28 + uTime) * 0.5 + 0.5;
  color += vec3(iridescence * 0.1, iridescence * 0.02, iridescence * 0.15);
  float sss = smoothstep(0.0, 1.0, dot(normalize(vNormal), vec3(0.0, 1.0, 0.5)));
  color += vec3(0.1, 0.02, 0.15) * sss * 0.5;
  gl_FragColor = vec4(color, 0.95);
}
`;

export const transitionFragment = /* glsl */ `
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
  float dist = length(uv - uMouse);
  float noiseVal = noise(uv * 10.0 + uTime) * 0.15;
  float progress = uProgress * 1.4 - 0.2;
  float edge = smoothstep(progress - 0.1, progress + 0.1, dist + noiseVal);
  vec3 color = vec3(0.0);
  float alpha = 1.0 - edge;
  float edgeGlow = smoothstep(0.0, 0.05, alpha) * smoothstep(0.2, 0.05, alpha);
  color += vec3(0.3, 0.1, 0.5) * edgeGlow * 3.0;
  gl_FragColor = vec4(color, alpha);
}
`;
