export const deformVertex = /* glsl */ `
uniform vec2 uMouse;
uniform float uStrength;
uniform float uRadius;
uniform float uTime;

varying vec2 vUv;
varying float vDeformation;

void main() {
  vUv = uv;

  vec3 pos = position;

  // Distance from mouse position (mouse is in NDC -1 to 1)
  float dist = distance(pos.xy, uMouse);

  // Repulsion force with smooth falloff
  float force = smoothstep(uRadius, 0.0, dist) * uStrength;

  // Direction away from mouse
  vec2 dir = normalize(pos.xy - uMouse + 0.001);

  // Apply deformation with spring-like oscillation
  pos.xy += dir * force * 0.3;
  pos.z += force * 0.15 + sin(uTime * 3.0 + dist * 8.0) * force * 0.05;

  vDeformation = force;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`;

export const deformFragment = /* glsl */ `
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform float uTime;
uniform float uOpacity;

varying vec2 vUv;
varying float vDeformation;

void main() {
  // Gradient based on UV + deformation coloring
  vec3 color = mix(uColor1, uColor2, vUv.y + vDeformation * 0.5);

  // Add subtle pulsing glow on deformed areas
  color += vDeformation * vec3(0.95, 0.67, 0.74) * 0.4;

  // Soft vignette
  float vignette = 1.0 - smoothstep(0.3, 1.0, length(vUv - 0.5) * 1.4);

  gl_FragColor = vec4(color, uOpacity * vignette);
}
`;
