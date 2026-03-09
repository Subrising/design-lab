varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;
varying float vFogDepth;

uniform float uTime;
uniform float uScrollProgress;

void main() {
  vUv = uv;
  vPosition = position;
  vNormal = normalize(normalMatrix * normal);

  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  vFogDepth = -mvPosition.z;

  gl_Position = projectionMatrix * mvPosition;
}
