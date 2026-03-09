varying vec2 vUv;
varying float vDepth;
uniform float uTime;
uniform float uScroll;

void main() {
  vUv = uv;

  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  vDepth = -mvPosition.z;

  // Subtle vertex displacement based on scroll
  vec3 pos = position;
  float wave = sin(pos.y * 2.0 + uTime * 0.5 + uScroll * 6.2831) * 0.02;
  pos.x += wave * pos.x;
  pos.z += wave * pos.z;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
