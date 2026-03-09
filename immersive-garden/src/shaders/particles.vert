attribute float aScale;
attribute float aSpeed;
attribute float aPhase;

varying float vAlpha;
varying float vScale;

uniform float uTime;
uniform float uScrollProgress;
uniform float uPixelRatio;

void main() {
  vec3 pos = position;

  // Animate particles along scroll
  float t = uTime * aSpeed + aPhase;
  pos.x += sin(t * 0.7) * 2.0;
  pos.y += cos(t * 0.5) * 1.5 + uScrollProgress * -50.0;
  pos.z += sin(t * 0.3) * 3.0;

  // Wrap particles
  pos.y = mod(pos.y + 30.0, 60.0) - 30.0;

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);

  float distFade = smoothstep(50.0, 5.0, -mvPosition.z);
  vAlpha = distFade * 0.6;
  vScale = aScale;

  gl_PointSize = aScale * uPixelRatio * (80.0 / -mvPosition.z);
  gl_Position = projectionMatrix * mvPosition;
}
