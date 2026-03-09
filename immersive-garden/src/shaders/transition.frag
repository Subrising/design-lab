uniform sampler2D tDiffuse;
uniform float uProgress;
uniform float uDirection;
uniform float uTime;
uniform vec2 uResolution;

varying vec2 vUv;

float random(vec2 co) {
  return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
  vec2 uv = vUv;

  // Noise-based dissolve transition
  float noise = random(uv * 10.0 + uTime * 0.1);
  float noiseDetail = random(uv * 50.0 - uTime * 0.05);
  float combinedNoise = noise * 0.7 + noiseDetail * 0.3;

  // Directional wipe with noise
  float wipe = uv.y * uDirection + (1.0 - uv.y) * (1.0 - uDirection);
  float threshold = uProgress * 1.4 - 0.2;

  float mask = smoothstep(threshold - 0.1, threshold + 0.1, wipe + combinedNoise * 0.3);

  // Chromatic aberration at transition edge
  float edgeDist = abs(mask - 0.5) * 2.0;
  float aberration = (1.0 - edgeDist) * 0.01 * uProgress;

  vec4 color;
  color.r = texture2D(tDiffuse, uv + vec2(aberration, 0.0)).r;
  color.g = texture2D(tDiffuse, uv).g;
  color.b = texture2D(tDiffuse, uv - vec2(aberration, 0.0)).b;
  color.a = 1.0;

  // Darken during transition
  float darken = 1.0 - sin(uProgress * 3.14159) * 0.3;
  color.rgb *= darken;

  gl_FragColor = color;
}
