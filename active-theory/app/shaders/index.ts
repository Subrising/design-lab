export const particleVertexShader = /* glsl */ `
uniform float uTime;
uniform float uExplosion;
uniform vec2 uMouse;
uniform float uMouseRadius;
uniform float uPixelRatio;

attribute vec3 aTarget;
attribute float aSize;
attribute float aRandom;
attribute vec3 aColor;

varying vec3 vColor;
varying float vAlpha;

vec3 mod289_v3(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289_v4(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289_v4(((x * 34.0) + 1.0) * x); }

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
  i = mod289_v3(i);
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
  vec4 norm = 1.79284291400159 - 0.85373472095314 *
    vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}

void main() {
  vec3 pos = position;
  vec3 target = aTarget;

  float lerpFactor = smoothstep(0.0, 1.0, 1.0 - uExplosion);
  vec3 finalPos = mix(pos, target, lerpFactor);

  float noiseScale = 0.5;
  float timeScale = uTime * 0.3;
  vec3 noisePos = finalPos * noiseScale + timeScale;
  float nx = snoise(noisePos);
  float ny = snoise(noisePos + vec3(100.0));
  float nz = snoise(noisePos + vec3(200.0));

  float explosionForce = uExplosion * 3.0;
  vec3 explosionDir = normalize(pos - vec3(0.0)) * explosionForce;
  explosionDir += vec3(nx, ny, nz) * explosionForce * 0.5;
  finalPos += explosionDir;

  finalPos += vec3(nx, ny, nz) * 0.05 * (1.0 + uExplosion * 2.0);

  vec4 mvPos = modelViewMatrix * vec4(finalPos, 1.0);
  vec2 screenPos = mvPos.xy / mvPos.z;
  float mouseDist = length(screenPos - uMouse);
  float mouseForce = smoothstep(uMouseRadius, 0.0, mouseDist) * 0.5;
  vec2 mouseDir = normalize(screenPos - uMouse + vec2(0.001));
  finalPos.xy += mouseDir * mouseForce;

  vec4 mvPosition = modelViewMatrix * vec4(finalPos, 1.0);
  gl_Position = projectionMatrix * mvPosition;

  float size = aSize * uPixelRatio;
  gl_PointSize = size * (300.0 / -mvPosition.z);
  gl_PointSize = max(gl_PointSize, 1.0);

  vColor = aColor;
  vAlpha = smoothstep(0.0, 0.3, lerpFactor) * (0.6 + aRandom * 0.4);
  vAlpha = mix(0.3 + aRandom * 0.3, vAlpha, 1.0 - uExplosion * 0.5);
}
`;

export const particleFragmentShader = /* glsl */ `
varying vec3 vColor;
varying float vAlpha;

void main() {
  vec2 uv = gl_PointCoord - vec2(0.5);
  float dist = length(uv);

  float circle = 1.0 - smoothstep(0.35, 0.5, dist);
  float glow = exp(-dist * 4.0) * 0.5;
  float alpha = (circle + glow) * vAlpha;

  if (alpha < 0.01) discard;

  gl_FragColor = vec4(vColor, alpha);
}
`;
