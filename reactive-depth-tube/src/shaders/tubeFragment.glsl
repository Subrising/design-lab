varying vec2 vUv;
varying float vDepth;
uniform sampler2D uTexture;
uniform float uTime;
uniform float uScroll;
uniform float uDistortion;

vec2 barrelDistortion(vec2 coord, float amt) {
  vec2 cc = coord - 0.5;
  float dist = dot(cc, cc);
  return coord + cc * dist * amt;
}

void main() {
  // UV distortion — barrel warp + chromatic shift
  float distAmt = uDistortion * (0.3 + sin(uTime * 0.3) * 0.1);
  vec2 distUv = barrelDistortion(vUv, distAmt);

  // Chromatic aberration
  float chromaOffset = 0.003 * (1.0 + uDistortion * 0.5);
  vec4 cr = texture2D(uTexture, distUv + vec2(chromaOffset, 0.0));
  vec4 cg = texture2D(uTexture, distUv);
  vec4 cb = texture2D(uTexture, distUv - vec2(chromaOffset, 0.0));

  vec3 color = vec3(cr.r, cg.g, cb.b);

  // Edge vignette on the tube panels
  float vignetteX = smoothstep(0.0, 0.08, vUv.x) * smoothstep(1.0, 0.92, vUv.x);
  float vignetteY = smoothstep(0.0, 0.05, vUv.y) * smoothstep(1.0, 0.95, vUv.y);
  float vignette = vignetteX * vignetteY;

  // Depth-based dimming (far panels fade)
  float depthFade = smoothstep(20.0, 3.0, vDepth);

  color *= vignette * depthFade;

  // Slight color grading — warm highlights, cool shadows
  color = mix(color, color * vec3(1.05, 0.98, 0.93), 0.3);

  gl_FragColor = vec4(color, vignette * depthFade);
}
