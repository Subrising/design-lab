export const REVEAL_VERT = /* glsl */ `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

/**
 * Scroll-triggered reveal shader.
 *
 * uReveal: 0 = fully masked, 1 = fully visible
 * uHover:  0 = neutral, 1 = hovered (barrel distortion + full colour)
 *
 * The reveal sweeps bottom-to-top with a sine-wave edge for an
 * organic "curtain lifting" feel rather than a hard clip.
 */
export const REVEAL_FRAG = /* glsl */ `
uniform sampler2D uTexture;
uniform float uReveal;
uniform float uHover;

varying vec2 vUv;

void main() {
  vec2 uv = vUv;

  // Barrel distortion on hover — pulls corners inward slightly
  vec2 center = uv - 0.5;
  float dist = length(center);
  uv += center * dist * uHover * 0.08;
  uv += 0.5;
  uv = clamp(uv, 0.001, 0.999);

  // Ease-out-cubic reveal
  float ease = 1.0 - pow(1.0 - uReveal, 3.0);

  // Wavy reveal edge: amplitude shrinks to zero as ease reaches 1
  float wave = sin(uv.x * 6.28318 * 2.0 + 1.5707) * 0.04 * (1.0 - ease);
  float threshold = 1.0 - ease + wave;

  // Smooth alpha mask sweeping from bottom (vUv.y=0) to top (vUv.y=1)
  float alpha = smoothstep(threshold + 0.025, threshold - 0.025, 1.0 - uv.y);

  vec4 color = texture2D(uTexture, uv);

  // Partial desaturation when idle; full colour on hover
  float luma = dot(color.rgb, vec3(0.299, 0.587, 0.114));
  color.rgb = mix(color.rgb, vec3(luma) * 1.05, (1.0 - uHover) * 0.28);

  // Subtle centre-to-edge vignette
  float vig = 1.0 - dot(center * 1.15, center * 1.15) * 0.35;
  color.rgb *= vig;

  gl_FragColor = vec4(color.rgb, color.a * alpha);
}
`;

export const TRANSITION_VERT = /* glsl */ `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

/**
 * Click-to-detail transition shader.
 *
 * uProgress: 0 → 1 during page leave.
 * Chromatic aberration peaks at mid-transition (sin curve),
 * giving a brief prismatic split on departure.
 */
export const TRANSITION_FRAG = /* glsl */ `
uniform sampler2D uTexture;
uniform float uProgress;

varying vec2 vUv;

void main() {
  vec2 uv = vUv;

  // Chromatic aberration: peaks at progress=0.5
  float aberr = sin(uProgress * 3.14159) * 0.016;
  float r = texture2D(uTexture, uv + vec2(aberr, 0.0)).r;
  float g = texture2D(uTexture, uv).g;
  float b = texture2D(uTexture, uv - vec2(aberr, 0.0)).b;
  float a = texture2D(uTexture, uv).a;

  gl_FragColor = vec4(r, g, b, a);
}
`;
