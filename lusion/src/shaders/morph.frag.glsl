uniform float uTime;
uniform float uMorphProgress;

varying vec2 vUv;
varying float vMorph;
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
  // Fresnel effect
  vec3 viewDir = normalize(-vPosition);
  float fresnel = pow(1.0 - max(dot(normalize(vNormal), viewDir), 0.0), 3.0);

  // Base colors
  vec3 baseColor = vec3(0.05, 0.02, 0.1);
  vec3 morphColor = vec3(0.15, 0.03, 0.25);
  vec3 rimColor = vec3(0.4, 0.1, 0.8);

  vec3 color = mix(baseColor, morphColor, vMorph);

  // Fresnel rim
  color += rimColor * fresnel * 0.8;

  // Iridescence
  float iridescence = sin(fresnel * 6.28 + uTime) * 0.5 + 0.5;
  color += vec3(iridescence * 0.1, iridescence * 0.02, iridescence * 0.15);

  // Subsurface scattering approximation
  float sss = smoothstep(0.0, 1.0, dot(normalize(vNormal), vec3(0.0, 1.0, 0.5)));
  color += vec3(0.1, 0.02, 0.15) * sss * 0.5;

  gl_FragColor = vec4(color, 0.95);
}
