varying float vAlpha;
varying float vScale;

uniform vec3 uColor;

void main() {
  // Soft circle
  float dist = length(gl_PointCoord - vec2(0.5));
  if (dist > 0.5) discard;

  float alpha = smoothstep(0.5, 0.1, dist) * vAlpha;

  // Glow effect
  float glow = exp(-dist * 4.0) * 0.5;
  alpha += glow * vAlpha;

  gl_FragColor = vec4(uColor, alpha);
}
