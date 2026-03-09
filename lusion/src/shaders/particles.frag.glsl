uniform float uTime;

varying float vAlpha;
varying float vScale;

void main() {
  // Soft circular particle
  float dist = length(gl_PointCoord - 0.5);
  if (dist > 0.5) discard;

  float alpha = smoothstep(0.5, 0.1, dist) * vAlpha;
  alpha *= 0.6;

  // Warm white with slight color variation
  vec3 color = vec3(0.95, 0.9, 1.0);
  color += vScale * vec3(0.05, 0.0, 0.1);

  gl_FragColor = vec4(color, alpha);
}
