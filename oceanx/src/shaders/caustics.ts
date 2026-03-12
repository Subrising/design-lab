export const causticVertexShader = `
  varying vec2 vUv;
  varying vec3 vPosition;
  void main() {
    vUv = uv;
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const causticFragmentShader = `
  uniform float uTime;
  uniform vec3 uColor;
  uniform float uIntensity;
  varying vec2 vUv;
  varying vec3 vPosition;

  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
  }

  float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  float caustic(vec2 uv, float time) {
    float c = 0.0;
    for(float i = 1.0; i < 4.0; i++) {
      vec2 p = uv * i * 3.0 + vec2(time * 0.3 * i, time * 0.2);
      c += noise(p) / i;
    }
    return c;
  }

  void main() {
    float c1 = caustic(vUv, uTime);
    float c2 = caustic(vUv + 0.5, uTime * 0.7);
    float pattern = c1 * c2 * 2.0;
    pattern = smoothstep(0.2, 0.8, pattern);
    vec3 color = uColor * pattern * uIntensity;
    float alpha = pattern * 0.6;
    gl_FragColor = vec4(color, alpha);
  }
`;

export const particleVertexShader = `
  attribute float aSize;
  attribute float aSpeed;
  attribute float aOffset;
  uniform float uTime;
  varying float vAlpha;

  void main() {
    vec3 pos = position;
    float t = uTime * aSpeed + aOffset;
    pos.y += sin(t) * 2.0;
    pos.x += cos(t * 0.7) * 1.5;
    pos.z += sin(t * 0.5) * 1.0;
    vAlpha = 0.3 + 0.7 * (0.5 + 0.5 * sin(t * 2.0));
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = aSize * (200.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

export const particleFragmentShader = `
  uniform vec3 uColor;
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    if(d > 0.5) discard;
    float alpha = smoothstep(0.5, 0.0, d) * vAlpha;
    gl_FragColor = vec4(uColor, alpha * 0.6);
  }
`;

export const jellyfishVertexShader = `
  uniform float uTime;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying float vDisplacement;

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);

    vec3 pos = position;
    float wave = sin(pos.y * 3.0 + uTime * 2.0) * 0.15;
    float pulse = sin(uTime * 1.5) * 0.1;

    if(pos.y < 0.0) {
      pos.x += wave * (1.0 - pos.y * 0.5);
      pos.z += cos(pos.y * 3.0 + uTime * 2.0) * 0.1 * (1.0 - pos.y * 0.5);
    }

    pos *= 1.0 + pulse * 0.3;
    vDisplacement = wave;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

export const jellyfishFragmentShader = `
  uniform float uTime;
  uniform vec3 uColor;
  uniform vec3 uGlowColor;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying float vDisplacement;

  void main() {
    float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.0);
    float pulse = 0.5 + 0.5 * sin(uTime * 1.5);

    vec3 baseColor = mix(uColor, uGlowColor, fresnel * 0.7);
    baseColor += uGlowColor * pulse * 0.3;

    float rim = fresnel * 0.8;
    float alpha = 0.4 + rim * 0.5 + pulse * 0.1;

    gl_FragColor = vec4(baseColor, alpha);
  }
`;
