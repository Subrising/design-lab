export const vertexShader = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec2 vUv;
  varying vec3 vViewPosition;

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewPosition = -mvPosition.xyz;
    vPosition = position;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

export const fragmentShader = /* glsl */ `
  uniform float uTime;
  uniform vec2 uMouse;          // normalized mouse [-1, 1]
  uniform float uMetallic;      // blend weight: metallic
  uniform float uGlass;         // blend weight: glass
  uniform float uOrganic;       // blend weight: organic
  uniform vec3 uLightPos;
  uniform float uTransitionSpeed;

  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec2 vUv;
  varying vec3 vViewPosition;

  // --- Noise functions for organic material ---
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x * 34.0) + 10.0) * x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
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
    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
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

  // --- Fresnel ---
  float fresnel(vec3 viewDir, vec3 normal, float power) {
    return pow(1.0 - max(dot(viewDir, normal), 0.0), power);
  }

  // --- Metallic material ---
  vec3 metallicMaterial(vec3 N, vec3 V, vec3 L) {
    vec3 baseColor = vec3(0.85, 0.82, 0.78);
    vec3 H = normalize(L + V);
    float NdotL = max(dot(N, L), 0.0);
    float NdotH = max(dot(N, H), 0.0);

    // GGX-like specular
    float roughness = 0.15;
    float a = roughness * roughness;
    float a2 = a * a;
    float denom = NdotH * NdotH * (a2 - 1.0) + 1.0;
    float D = a2 / (3.14159 * denom * denom);

    float F = fresnel(V, N, 5.0);
    vec3 specular = baseColor * D * F * 2.0;
    vec3 diffuse = baseColor * NdotL * 0.3;

    // Anisotropic streaks
    float aniso = sin(vUv.x * 80.0 + uTime * 0.5) * 0.03;

    return diffuse + specular + aniso + baseColor * 0.08;
  }

  // --- Glass material ---
  vec3 glassMaterial(vec3 N, vec3 V, vec3 L) {
    vec3 tint = vec3(0.7, 0.85, 1.0);
    float F = fresnel(V, N, 3.0);

    vec3 H = normalize(L + V);
    float NdotH = max(dot(N, H), 0.0);
    float spec = pow(NdotH, 256.0);

    // Chromatic dispersion
    float dispR = fresnel(V, N, 2.5);
    float dispG = fresnel(V, N, 3.0);
    float dispB = fresnel(V, N, 3.5);
    vec3 dispersion = vec3(dispR, dispG, dispB);

    // Refraction-like effect
    vec3 refracted = refract(-V, N, 0.67);
    float refractPattern = snoise(refracted * 3.0 + uTime * 0.2) * 0.15;

    vec3 color = tint * (0.1 + F * 0.6) + dispersion * 0.3 + spec * 1.5;
    color += refractPattern * tint;

    return color;
  }

  // --- Organic material ---
  vec3 organicMaterial(vec3 N, vec3 V, vec3 L) {
    float NdotL = max(dot(N, L), 0.0);

    // Subsurface scattering approximation
    float sss = max(0.0, dot(V, -L)) * 0.4;
    vec3 sssColor = vec3(1.0, 0.3, 0.15) * sss;

    // Animated organic noise
    float n1 = snoise(vPosition * 2.0 + uTime * 0.3);
    float n2 = snoise(vPosition * 4.0 - uTime * 0.2);
    float pattern = n1 * 0.6 + n2 * 0.4;

    vec3 baseColor = mix(
      vec3(0.2, 0.55, 0.35),  // green
      vec3(0.6, 0.25, 0.5),   // purple
      pattern * 0.5 + 0.5
    );

    // Velvet-like rim
    float rim = 1.0 - max(dot(V, N), 0.0);
    rim = pow(rim, 2.0) * 0.6;
    vec3 rimColor = vec3(0.4, 0.7, 0.6) * rim;

    // Wrap lighting for soft diffuse
    float wrap = (NdotL + 0.5) / 1.5;

    return baseColor * wrap + sssColor + rimColor + baseColor * 0.1;
  }

  void main() {
    vec3 N = normalize(vNormal);
    vec3 V = normalize(vViewPosition);
    vec3 L = normalize(uLightPos - vPosition);

    // Compute material colors
    vec3 metal = metallicMaterial(N, V, L);
    vec3 glass = glassMaterial(N, V, L);
    vec3 organic = organicMaterial(N, V, L);

    // Normalize blend weights
    float total = uMetallic + uGlass + uOrganic;
    float wMetal = uMetallic / max(total, 0.001);
    float wGlass = uGlass / max(total, 0.001);
    float wOrganic = uOrganic / max(total, 0.001);

    // Blend materials
    vec3 color = metal * wMetal + glass * wGlass + organic * wOrganic;

    // Subtle environment reflection
    vec3 reflDir = reflect(-V, N);
    float envReflect = smoothstep(-0.2, 1.0, reflDir.y) * 0.15 * wGlass;
    color += vec3(0.6, 0.7, 0.9) * envReflect;

    // Tone mapping
    color = color / (color + vec3(1.0));
    color = pow(color, vec3(1.0 / 2.2));

    gl_FragColor = vec4(color, 1.0);
  }
`;
