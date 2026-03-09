export const cubeVertexShader = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec2 vUv;
  varying vec3 vWorldPosition;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;
    vUv = uv;
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPos.xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const cubeFragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform float uTime;
  uniform vec3 uLightPosition;
  uniform float uGloss;
  uniform float uFresnelPower;

  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec2 vUv;
  varying vec3 vWorldPosition;

  void main() {
    vec3 normal = normalize(vNormal);
    vec3 viewDir = normalize(cameraPosition - vWorldPosition);
    vec3 lightDir = normalize(uLightPosition - vWorldPosition);

    // Diffuse
    float diff = max(dot(normal, lightDir), 0.0);
    diff = diff * 0.7 + 0.3; // ambient boost

    // Specular (Blinn-Phong)
    vec3 halfDir = normalize(lightDir + viewDir);
    float spec = pow(max(dot(normal, halfDir), 0.0), 64.0 * uGloss);

    // Fresnel rim
    float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), uFresnelPower);

    // Subtle animated shimmer
    float shimmer = sin(vUv.x * 20.0 + uTime * 0.5) * 0.02 +
                    sin(vUv.y * 20.0 - uTime * 0.3) * 0.02;

    vec3 color = uColor * diff;
    color += vec3(1.0) * spec * 0.6 * uGloss;
    color += vec3(0.4, 0.5, 0.7) * fresnel * 0.3;
    color += shimmer;

    // Slight vignette on face
    float vignette = 1.0 - length(vUv - 0.5) * 0.3;
    color *= vignette;

    gl_FragColor = vec4(color, 1.0);
  }
`;

export const blackPlasticVertexShader = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vWorldPosition;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPos.xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const blackPlasticFragmentShader = /* glsl */ `
  uniform vec3 uLightPosition;

  varying vec3 vNormal;
  varying vec3 vWorldPosition;

  void main() {
    vec3 normal = normalize(vNormal);
    vec3 viewDir = normalize(cameraPosition - vWorldPosition);
    vec3 lightDir = normalize(uLightPosition - vWorldPosition);

    float diff = max(dot(normal, lightDir), 0.0) * 0.3 + 0.1;
    vec3 halfDir = normalize(lightDir + viewDir);
    float spec = pow(max(dot(normal, halfDir), 0.0), 32.0) * 0.15;

    vec3 color = vec3(0.05) * diff + vec3(1.0) * spec;
    gl_FragColor = vec4(color, 1.0);
  }
`;
