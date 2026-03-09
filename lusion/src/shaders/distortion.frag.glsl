uniform float uTime;
uniform vec2 uMouse;
uniform float uHover;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform float uScrollProgress;

varying vec2 vUv;
varying float vDistortion;
varying float vElevation;

void main() {
  // Dynamic color mixing based on distortion and position
  vec3 color = mix(uColor1, uColor2, smoothstep(-0.2, 0.2, vDistortion));
  color = mix(color, uColor3, smoothstep(0.1, 0.4, vDistortion));

  // Mouse glow
  float mouseDistance = length(vUv - uMouse);
  float glow = smoothstep(0.4, 0.0, mouseDistance) * uHover * 0.5;
  color += vec3(glow * 0.3, glow * 0.1, glow * 0.4);

  // Rim lighting effect
  float rim = pow(1.0 - abs(vElevation * 3.0), 3.0);
  color += rim * 0.1;

  // Scroll-based color shift
  color = mix(color, uColor3, uScrollProgress * 0.3);

  // Vignette
  float vignette = smoothstep(1.4, 0.5, length(vUv - 0.5) * 2.0);
  color *= vignette;

  gl_FragColor = vec4(color, 1.0);
}
