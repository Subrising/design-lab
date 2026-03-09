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

  // Organic floating motion
  float phase = aPhase * 6.28318;
  pos.x += sin(uTime * 0.3 + phase) * 0.5;
  pos.y += cos(uTime * 0.2 + phase * 1.3) * 0.3;
  pos.z += sin(uTime * 0.4 + phase * 0.7) * 0.4;

  // Mouse repulsion in screen space
  vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
  vec4 projected = projectionMatrix * mvPos;
  vec2 screenPos = projected.xy / projected.w;

  vec2 mouseDir = screenPos - (uMouse * 2.0 - 1.0);
  float mouseDist = length(mouseDir);
  float repulsion = smoothstep(0.5, 0.0, mouseDist) * 2.0;

  pos.xy += normalize(mouseDir + 0.001) * repulsion * 0.3;

  // Scroll dispersion
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
