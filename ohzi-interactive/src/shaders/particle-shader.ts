export const particleVertex = /* glsl */ `
  uniform float uTime;
  uniform float uPixelRatio;
  uniform vec2 uMouse;

  attribute float aScale;
  attribute float aSpeed;
  attribute vec3 aRandomness;

  varying float vAlpha;
  varying float vDistToMouse;

  void main() {
    vec3 pos = position;

    // Orbital motion
    float speed = aSpeed * 0.3;
    pos.x += sin(uTime * speed + aRandomness.x * 6.28) * aRandomness.y * 2.0;
    pos.y += cos(uTime * speed * 0.7 + aRandomness.y * 6.28) * aRandomness.z * 2.0;
    pos.z += sin(uTime * speed * 0.5 + aRandomness.z * 6.28) * aRandomness.x * 1.5;

    vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);

    // Mouse repulsion in screen space
    vec2 screenPos = (projectionMatrix * mvPos).xy / (projectionMatrix * mvPos).w;
    float mouseDist = distance(screenPos, uMouse);
    vDistToMouse = mouseDist;

    // Push particles away from cursor
    vec2 mouseDir = normalize(screenPos - uMouse);
    float repulsion = exp(-mouseDist * 3.0) * 0.5;
    mvPos.xy += mouseDir * repulsion;

    gl_PointSize = aScale * uPixelRatio * 80.0 / -mvPos.z;
    gl_PointSize = max(gl_PointSize, 1.0);

    vAlpha = smoothstep(0.0, 0.5, aScale) * (0.6 + 0.4 * sin(uTime * aSpeed));

    gl_Position = projectionMatrix * mvPos;
  }
`;

export const particleFragment = /* glsl */ `
  uniform vec3 uColor1;
  uniform vec3 uColor2;

  varying float vAlpha;
  varying float vDistToMouse;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;

    float glow = exp(-d * 6.0);
    float core = exp(-d * 20.0);

    vec3 color = mix(uColor1, uColor2, vDistToMouse * 0.5);
    color += vec3(0.5, 0.7, 1.0) * core;

    float alpha = glow * vAlpha * 0.8;
    alpha += core * 0.5;

    float mouseHighlight = exp(-vDistToMouse * 2.0) * 0.5;
    color += vec3(0.2, 0.4, 1.0) * mouseHighlight;

    gl_FragColor = vec4(color, alpha);
  }
`;
