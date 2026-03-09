// MiniGL-inspired gradient mesh shaders for Stripe's hero background
export const vertexShader = `
  attribute vec2 a_position;
  varying vec2 v_uv;

  void main() {
    v_uv = a_position * 0.5 + 0.5;
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

export const fragmentShader = `
  precision highp float;

  varying vec2 v_uv;
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform vec3 u_color1; // purple
  uniform vec3 u_color2; // blue
  uniform vec3 u_color3; // cyan
  uniform vec3 u_color4; // green

  // Simplex-style noise
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                        -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
      + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy),
      dot(x12.zw, x12.zw)), 0.0);
    m = m * m;
    m = m * m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  // Fractal Brownian Motion
  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    for (int i = 0; i < 5; i++) {
      value += amplitude * snoise(p * frequency);
      amplitude *= 0.5;
      frequency *= 2.0;
    }
    return value;
  }

  void main() {
    vec2 uv = v_uv;
    float t = u_time * 0.15;

    // Create flowing distortion fields
    float n1 = fbm(uv * 2.0 + vec2(t * 0.7, t * 0.3));
    float n2 = fbm(uv * 1.5 + vec2(-t * 0.5, t * 0.8) + n1 * 0.5);
    float n3 = fbm(uv * 3.0 + vec2(t * 0.3, -t * 0.6) + n2 * 0.3);

    // Blob positions that drift over time
    vec2 p1 = vec2(0.3 + sin(t * 0.7) * 0.2, 0.3 + cos(t * 0.5) * 0.2);
    vec2 p2 = vec2(0.7 + cos(t * 0.6) * 0.2, 0.6 + sin(t * 0.8) * 0.2);
    vec2 p3 = vec2(0.5 + sin(t * 0.9) * 0.3, 0.8 + cos(t * 0.4) * 0.15);
    vec2 p4 = vec2(0.8 + cos(t * 0.5) * 0.15, 0.2 + sin(t * 0.7) * 0.2);

    // Soft radial gradients from each blob
    float d1 = 1.0 - smoothstep(0.0, 0.6, length(uv - p1 + n1 * 0.1));
    float d2 = 1.0 - smoothstep(0.0, 0.5, length(uv - p2 + n2 * 0.1));
    float d3 = 1.0 - smoothstep(0.0, 0.55, length(uv - p3 + n3 * 0.08));
    float d4 = 1.0 - smoothstep(0.0, 0.45, length(uv - p4 + n1 * 0.12));

    // Mix colors based on blob proximity and noise
    vec3 col = u_color2; // base: deep blue
    col = mix(col, u_color1, d1 * 0.8); // purple blob
    col = mix(col, u_color3, d2 * 0.7); // cyan blob
    col = mix(col, u_color4, d3 * 0.6); // green blob
    col = mix(col, u_color1 * 1.2, d4 * 0.5); // bright purple blob

    // Add subtle noise texture
    col += n3 * 0.03;

    // Vignette
    float vignette = 1.0 - smoothstep(0.4, 1.4, length(uv - 0.5) * 1.2);
    col *= vignette * 0.8 + 0.2;

    gl_FragColor = vec4(col, 1.0);
  }
`;
