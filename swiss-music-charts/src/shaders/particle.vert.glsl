uniform float uTime;
uniform float uPixelRatio;
uniform float uTransitionProgress;

attribute float aSize;
attribute vec3 aColor;
attribute vec3 aTargetPosition;
attribute float aRandom;

varying vec3 vColor;
varying float vAlpha;

void main() {
  // Interpolate between current and target positions during transitions
  vec3 pos = mix(position, aTargetPosition, uTransitionProgress);

  // Add subtle floating animation
  float floatOffset = sin(uTime * 0.5 + aRandom * 6.28318) * 0.15;
  float floatOffset2 = cos(uTime * 0.3 + aRandom * 3.14159) * 0.1;
  pos.y += floatOffset;
  pos.x += floatOffset2;

  vec4 modelPosition = modelMatrix * vec4(pos, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;

  // Size attenuation — closer particles appear larger
  float sizeAttenuation = 1.0 / -viewPosition.z;

  // Pulse animation
  float pulse = 1.0 + 0.15 * sin(uTime * 2.0 + aRandom * 6.28318);

  gl_PointSize = aSize * sizeAttenuation * uPixelRatio * 80.0 * pulse;
  gl_PointSize = max(gl_PointSize, 1.0);

  vColor = aColor;

  // Fade based on distance
  float dist = length(viewPosition.xyz);
  vAlpha = smoothstep(50.0, 5.0, dist);
}
