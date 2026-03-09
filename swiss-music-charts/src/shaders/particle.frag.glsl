varying vec3 vColor;
varying float vAlpha;

void main() {
  // Create soft circular particle with glow
  vec2 uv = gl_PointCoord - vec2(0.5);
  float dist = length(uv);

  // Discard pixels outside the circle
  if (dist > 0.5) discard;

  // Soft glow falloff
  float core = smoothstep(0.5, 0.0, dist);
  float glow = smoothstep(0.5, 0.1, dist);

  // Combine core brightness with soft glow
  float intensity = core * 0.6 + glow * 0.4;

  // Apply color with intensity
  vec3 color = vColor * intensity;

  // Add slight white core for sparkle
  color += vec3(1.0) * pow(core, 4.0) * 0.3;

  float alpha = intensity * vAlpha;

  gl_FragColor = vec4(color, alpha);
}
