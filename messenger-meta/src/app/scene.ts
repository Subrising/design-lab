import * as THREE from "three";

/* ─── Types ─────────────────────────────────── */

interface ChatMessage {
  text: string;
  sender: "me" | "them";
  time: string;
}

interface BubbleMesh {
  mesh: THREE.Mesh;
  targetY: number;
  currentY: number;
  velocityY: number;
  targetScale: number;
  currentScale: number;
  velocityScale: number;
  width: number;
  height: number;
  sender: "me" | "them";
}

/* ─── Conversation Data ─────────────────────── */

const conversation: ChatMessage[] = [
  { text: "Hey! Have you seen the new WebGL experiments?", sender: "them", time: "10:42 AM" },
  { text: "Yes! The shader work is incredible", sender: "me", time: "10:43 AM" },
  { text: "Right?? The gradient mesh background alone is worth studying", sender: "them", time: "10:43 AM" },
  { text: "I've been trying to replicate the spring physics on the bubbles", sender: "me", time: "10:44 AM" },
  { text: "The trick is using canvas textures for the text rendering", sender: "them", time: "10:45 AM" },
  { text: "That way everything stays on the GPU", sender: "me", time: "10:45 AM" },
  { text: "Exactly. No DOM overhead at all", sender: "them", time: "10:46 AM" },
  { text: "Want to pair on the next experiment?", sender: "them", time: "10:46 AM" },
  { text: "Absolutely! Let's build something wild", sender: "me", time: "10:47 AM" },
  { text: "I'm thinking a full 3D message threading system", sender: "them", time: "10:48 AM" },
  { text: "With depth-based focus? That would be amazing", sender: "me", time: "10:48 AM" },
  { text: "And particle effects on send", sender: "them", time: "10:49 AM" },
  { text: "Let's do it tomorrow morning", sender: "me", time: "10:50 AM" },
];

/* ─── Constants ─────────────────────────────── */

const SPRING_STIFFNESS = 120;
const SPRING_DAMPING = 14;
const BUBBLE_GAP = 0.18;
const MAX_BUBBLE_WIDTH = 4.8;
const CANVAS_SCALE = 2; // retina
const FONT_SIZE = 28;
const PADDING_X = 32;
const PADDING_Y = 20;
const BORDER_RADIUS = 28;
const DPR = typeof window !== "undefined" ? Math.min(window.devicePixelRatio, 2) : 1;

/* ─── Canvas Text Rendering ─────────────────── */

function createTextCanvas(
  text: string,
  sender: "me" | "them",
  time: string,
): { canvas: HTMLCanvasElement; width: number; height: number } {
  const measureCanvas = document.createElement("canvas");
  const measureCtx = measureCanvas.getContext("2d")!;
  measureCtx.font = `500 ${FONT_SIZE * CANVAS_SCALE}px Inter, -apple-system, sans-serif`;

  const maxTextWidth = (MAX_BUBBLE_WIDTH * 100 - PADDING_X * 2) * CANVAS_SCALE;
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const metrics = measureCtx.measureText(testLine);
    if (metrics.width > maxTextWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) lines.push(currentLine);

  const lineHeight = FONT_SIZE * CANVAS_SCALE * 1.4;
  const timeHeight = FONT_SIZE * CANVAS_SCALE * 0.65;
  const textBlockHeight = lines.length * lineHeight;
  const totalTextHeight = textBlockHeight + timeHeight + 8 * CANVAS_SCALE;

  let maxLineWidth = 0;
  for (const line of lines) {
    const w = measureCtx.measureText(line).width;
    if (w > maxLineWidth) maxLineWidth = w;
  }

  // Also measure time string width
  measureCtx.font = `400 ${FONT_SIZE * CANVAS_SCALE * 0.5}px Inter, -apple-system, sans-serif`;
  const timeWidth = measureCtx.measureText(time).width;
  maxLineWidth = Math.max(maxLineWidth, timeWidth);

  const canvasWidth = Math.ceil(maxLineWidth + PADDING_X * 2 * CANVAS_SCALE);
  const canvasHeight = Math.ceil(totalTextHeight + PADDING_Y * 2 * CANVAS_SCALE);

  const canvas = document.createElement("canvas");
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  const ctx = canvas.getContext("2d")!;

  // Draw rounded rectangle bubble
  const r = BORDER_RADIUS * CANVAS_SCALE;
  ctx.beginPath();
  ctx.moveTo(r, 0);
  ctx.lineTo(canvasWidth - r, 0);
  ctx.quadraticCurveTo(canvasWidth, 0, canvasWidth, r);
  ctx.lineTo(canvasWidth, canvasHeight - r);
  ctx.quadraticCurveTo(canvasWidth, canvasHeight, canvasWidth - r, canvasHeight);
  ctx.lineTo(r, canvasHeight);
  ctx.quadraticCurveTo(0, canvasHeight, 0, canvasHeight - r);
  ctx.lineTo(0, r);
  ctx.quadraticCurveTo(0, 0, r, 0);
  ctx.closePath();

  if (sender === "me") {
    const gradient = ctx.createLinearGradient(0, 0, canvasWidth, canvasHeight);
    gradient.addColorStop(0, "#0084ff");
    gradient.addColorStop(1, "#0066dd");
    ctx.fillStyle = gradient;
  } else {
    ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
  }
  ctx.fill();

  // Subtle border for "them" bubbles
  if (sender === "them") {
    ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
    ctx.lineWidth = 1.5 * CANVAS_SCALE;
    ctx.stroke();
  }

  // Draw text
  ctx.font = `500 ${FONT_SIZE * CANVAS_SCALE}px Inter, -apple-system, sans-serif`;
  ctx.fillStyle = sender === "me" ? "#ffffff" : "rgba(255, 255, 255, 0.92)";
  ctx.textBaseline = "top";

  const startX = PADDING_X * CANVAS_SCALE;
  const startY = PADDING_Y * CANVAS_SCALE;

  for (let i = 0; i < lines.length; i++) {
    ctx.fillText(lines[i], startX, startY + i * lineHeight);
  }

  // Draw timestamp
  ctx.font = `400 ${FONT_SIZE * CANVAS_SCALE * 0.5}px Inter, -apple-system, sans-serif`;
  ctx.fillStyle = sender === "me" ? "rgba(255, 255, 255, 0.6)" : "rgba(255, 255, 255, 0.35)";
  ctx.fillText(time, startX, startY + textBlockHeight + 6 * CANVAS_SCALE);

  const worldWidth = canvasWidth / (100 * CANVAS_SCALE);
  const worldHeight = canvasHeight / (100 * CANVAS_SCALE);

  return { canvas, width: worldWidth, height: worldHeight };
}

/* ─── Gradient Mesh Background Shader ───────── */

const gradientVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const gradientFragmentShader = `
  uniform float uTime;
  uniform vec2 uResolution;
  varying vec2 vUv;

  // Simplex-like noise
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                        -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
                            + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy),
                             dot(x12.zw, x12.zw)), 0.0);
    m = m * m; m = m * m;
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

  void main() {
    vec2 uv = vUv;
    float t = uTime * 0.15;

    // Animated mesh points
    float n1 = snoise(uv * 1.5 + vec2(t * 0.3, t * 0.2));
    float n2 = snoise(uv * 2.0 + vec2(-t * 0.2, t * 0.4));
    float n3 = snoise(uv * 0.8 + vec2(t * 0.1, -t * 0.15));

    // Meta/Messenger-inspired dark gradient palette
    vec3 deep    = vec3(0.02, 0.02, 0.06);
    vec3 purple  = vec3(0.12, 0.04, 0.18);
    vec3 blue    = vec3(0.0, 0.15, 0.35);
    vec3 accent  = vec3(0.0, 0.32, 0.55);

    vec3 color = deep;
    color = mix(color, purple, smoothstep(-0.3, 0.5, n1) * 0.6);
    color = mix(color, blue, smoothstep(-0.2, 0.6, n2) * 0.4);
    color = mix(color, accent, smoothstep(0.0, 0.8, n3) * 0.2);

    // Subtle vignette
    float vignette = 1.0 - length((uv - 0.5) * 1.3);
    vignette = smoothstep(0.0, 0.7, vignette);
    color *= vignette * 0.8 + 0.2;

    gl_FragColor = vec4(color, 1.0);
  }
`;

/* ─── Particle System ───────────────────────── */

function createParticleSystem(): THREE.Points {
  const count = 80;
  const positions = new Float32Array(count * 3);
  const sizes = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 12;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 16;
    positions[i * 3 + 2] = -1 + Math.random() * -3;
    sizes[i] = Math.random() * 3 + 1;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

  const material = new THREE.PointsMaterial({
    color: 0x0084ff,
    size: 0.03,
    transparent: true,
    opacity: 0.15,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true,
  });

  return new THREE.Points(geometry, material);
}

/* ─── Send Particle Burst ───────────────────── */

interface ParticleBurst {
  points: THREE.Points;
  velocities: Float32Array;
  life: number;
  maxLife: number;
}

function createBurst(x: number, y: number): ParticleBurst {
  const count = 30;
  const positions = new Float32Array(count * 3);
  const velocities = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = 0.1;
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 3 + 1;
    velocities[i * 3] = Math.cos(angle) * speed;
    velocities[i * 3 + 1] = Math.sin(angle) * speed;
    velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.5;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    color: 0x0084ff,
    size: 0.06,
    transparent: true,
    opacity: 1,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true,
  });

  const points = new THREE.Points(geometry, material);
  return { points, velocities, life: 0, maxLife: 1.2 };
}

/* ─── Input Bar (Canvas Texture) ────────────── */

function createInputBar(viewWidth: number): {
  mesh: THREE.Mesh;
  updateText: (text: string) => void;
} {
  const barWidth = Math.min(viewWidth * 0.92, 7);
  const barHeight = 0.5;
  const canvasW = Math.ceil(barWidth * 100 * CANVAS_SCALE);
  const canvasH = Math.ceil(barHeight * 100 * CANVAS_SCALE);

  const canvas = document.createElement("canvas");
  canvas.width = canvasW;
  canvas.height = canvasH;
  const ctx = canvas.getContext("2d")!;

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;

  function draw(text: string) {
    ctx.clearRect(0, 0, canvasW, canvasH);

    // Rounded rect
    const r = 24 * CANVAS_SCALE;
    ctx.beginPath();
    ctx.moveTo(r, 0);
    ctx.lineTo(canvasW - r, 0);
    ctx.quadraticCurveTo(canvasW, 0, canvasW, r);
    ctx.lineTo(canvasW, canvasH - r);
    ctx.quadraticCurveTo(canvasW, canvasH, canvasW - r, canvasH);
    ctx.lineTo(r, canvasH);
    ctx.quadraticCurveTo(0, canvasH, 0, canvasH - r);
    ctx.lineTo(0, r);
    ctx.quadraticCurveTo(0, 0, r, 0);
    ctx.closePath();

    ctx.fillStyle = "rgba(255, 255, 255, 0.06)";
    ctx.fill();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
    ctx.lineWidth = 1.5 * CANVAS_SCALE;
    ctx.stroke();

    // Text or placeholder
    ctx.font = `400 ${FONT_SIZE * CANVAS_SCALE * 0.85}px Inter, -apple-system, sans-serif`;
    ctx.textBaseline = "middle";
    if (text) {
      ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
      ctx.fillText(text, PADDING_X * CANVAS_SCALE, canvasH / 2);
    } else {
      ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
      ctx.fillText("Type a message...", PADDING_X * CANVAS_SCALE, canvasH / 2);
    }

    // Send button circle
    const btnR = 16 * CANVAS_SCALE;
    const btnX = canvasW - PADDING_X * CANVAS_SCALE - btnR;
    const btnY = canvasH / 2;
    ctx.beginPath();
    ctx.arc(btnX, btnY, btnR, 0, Math.PI * 2);
    ctx.fillStyle = text ? "#0084ff" : "rgba(255, 255, 255, 0.15)";
    ctx.fill();

    // Arrow
    ctx.beginPath();
    const arrowSize = 7 * CANVAS_SCALE;
    ctx.moveTo(btnX - arrowSize * 0.4, btnY - arrowSize * 0.6);
    ctx.lineTo(btnX + arrowSize * 0.5, btnY);
    ctx.lineTo(btnX - arrowSize * 0.4, btnY + arrowSize * 0.6);
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2.5 * CANVAS_SCALE;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();

    texture.needsUpdate = true;
  }

  draw("");

  const geometry = new THREE.PlaneGeometry(barWidth, barHeight);
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    depthWrite: false,
  });

  const mesh = new THREE.Mesh(geometry, material);
  return { mesh, updateText: draw };
}

/* ─── Header Bar (Canvas Texture) ───────────── */

function createHeader(viewWidth: number): THREE.Mesh {
  const barWidth = Math.min(viewWidth * 0.92, 7);
  const barHeight = 0.45;
  const canvasW = Math.ceil(barWidth * 100 * CANVAS_SCALE);
  const canvasH = Math.ceil(barHeight * 100 * CANVAS_SCALE);

  const canvas = document.createElement("canvas");
  canvas.width = canvasW;
  canvas.height = canvasH;
  const ctx = canvas.getContext("2d")!;

  // Avatar circle
  const avatarR = 16 * CANVAS_SCALE;
  const avatarX = PADDING_X * CANVAS_SCALE + avatarR;
  const avatarY = canvasH / 2;
  ctx.beginPath();
  ctx.arc(avatarX, avatarY, avatarR, 0, Math.PI * 2);
  const avatarGrad = ctx.createLinearGradient(
    avatarX - avatarR, avatarY - avatarR,
    avatarX + avatarR, avatarY + avatarR,
  );
  avatarGrad.addColorStop(0, "#0084ff");
  avatarGrad.addColorStop(1, "#00c6ff");
  ctx.fillStyle = avatarGrad;
  ctx.fill();

  // Avatar letter
  ctx.font = `600 ${18 * CANVAS_SCALE}px Inter, -apple-system, sans-serif`;
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("A", avatarX, avatarY + 1 * CANVAS_SCALE);

  // Online dot
  ctx.beginPath();
  ctx.arc(avatarX + avatarR * 0.7, avatarY + avatarR * 0.7, 5 * CANVAS_SCALE, 0, Math.PI * 2);
  ctx.fillStyle = "#44b700";
  ctx.fill();
  ctx.strokeStyle = "#0a0a0f";
  ctx.lineWidth = 2 * CANVAS_SCALE;
  ctx.stroke();

  // Name
  ctx.textAlign = "left";
  ctx.font = `600 ${FONT_SIZE * CANVAS_SCALE * 0.8}px Inter, -apple-system, sans-serif`;
  ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
  ctx.fillText("Alex Chen", avatarX + avatarR + 16 * CANVAS_SCALE, canvasH / 2 - 8 * CANVAS_SCALE);

  // Status
  ctx.font = `400 ${FONT_SIZE * CANVAS_SCALE * 0.5}px Inter, -apple-system, sans-serif`;
  ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
  ctx.fillText("Active now", avatarX + avatarR + 16 * CANVAS_SCALE, canvasH / 2 + 14 * CANVAS_SCALE);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;

  const geometry = new THREE.PlaneGeometry(barWidth, barHeight);
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    depthWrite: false,
  });

  return new THREE.Mesh(geometry, material);
}

/* ─── Main Scene Init ───────────────────────── */

export function initScene(container: HTMLDivElement) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(DPR);
  renderer.setClearColor(0x0a0a0f);
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();

  // Orthographic camera for 2D-like chat layout
  const aspect = window.innerWidth / window.innerHeight;
  const viewHeight = 10;
  const viewWidth = viewHeight * aspect;
  const camera = new THREE.OrthographicCamera(
    -viewWidth / 2, viewWidth / 2,
    viewHeight / 2, -viewHeight / 2,
    0.1, 100,
  );
  camera.position.z = 10;

  // Gradient mesh background
  const bgGeometry = new THREE.PlaneGeometry(viewWidth * 1.2, viewHeight * 1.2);
  const bgMaterial = new THREE.ShaderMaterial({
    vertexShader: gradientVertexShader,
    fragmentShader: gradientFragmentShader,
    uniforms: {
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
    },
    depthWrite: false,
  });
  const bgMesh = new THREE.Mesh(bgGeometry, bgMaterial);
  bgMesh.position.z = -5;
  scene.add(bgMesh);

  // Particles
  const particles = createParticleSystem();
  scene.add(particles);

  // Header
  const header = createHeader(viewWidth);
  header.position.y = viewHeight / 2 - 0.35;
  header.position.z = 1;
  scene.add(header);

  // Input bar
  const { mesh: inputBar, updateText: updateInputText } = createInputBar(viewWidth);
  inputBar.position.y = -viewHeight / 2 + 0.4;
  inputBar.position.z = 1;
  scene.add(inputBar);

  // Chat area bounds
  const chatTop = header.position.y - 0.5;
  const chatBottom = inputBar.position.y + 0.45;
  const chatAreaHeight = chatTop - chatBottom;

  // Build bubble meshes
  const bubbles: BubbleMesh[] = [];
  let scrollOffset = 0;
  let scrollVelocity = 0;
  const bursts: ParticleBurst[] = [];

  function layoutBubbles() {
    let yPos = chatTop - 0.15;

    for (let i = 0; i < bubbles.length; i++) {
      const b = bubbles[i];
      b.targetY = yPos - b.height / 2 + scrollOffset;
      yPos -= b.height + BUBBLE_GAP;
    }
  }

  function addBubble(msg: ChatMessage, animated: boolean) {
    const { canvas, width, height } = createTextCanvas(msg.text, msg.sender, msg.time);
    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;

    const geometry = new THREE.PlaneGeometry(width, height);
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      depthWrite: false,
    });

    const mesh = new THREE.Mesh(geometry, material);
    const maxBubbleX = Math.min(viewWidth * 0.92, 7) / 2;

    if (msg.sender === "me") {
      mesh.position.x = maxBubbleX / 2 - width / 2 + 0.1;
    } else {
      mesh.position.x = -maxBubbleX / 2 + width / 2 - 0.1;
    }
    mesh.position.z = 0.5;

    const startY = animated ? chatBottom - 1 : 0;
    const startScale = animated ? 0.01 : 1;

    const bubble: BubbleMesh = {
      mesh,
      targetY: 0,
      currentY: startY,
      velocityY: 0,
      targetScale: 1,
      currentScale: startScale,
      velocityScale: 0,
      width,
      height,
      sender: msg.sender,
    };

    bubbles.push(bubble);
    scene.add(mesh);
    layoutBubbles();

    // Create burst effect for new "me" messages
    if (animated && msg.sender === "me") {
      const burst = createBurst(mesh.position.x, bubble.targetY);
      bursts.push(burst);
      scene.add(burst.points);
    }
  }

  // Add initial messages with stagger
  let addedCount = 0;
  const staggerInterval = setInterval(() => {
    if (addedCount < conversation.length) {
      addBubble(conversation[addedCount], true);
      addedCount++;
    } else {
      clearInterval(staggerInterval);
    }
  }, 200);

  // Scroll handling
  let isDragging = false;
  let lastPointerY = 0;

  function onPointerDown(e: PointerEvent) {
    isDragging = true;
    lastPointerY = e.clientY;
    scrollVelocity = 0;
  }

  function onPointerMove(e: PointerEvent) {
    if (!isDragging) return;
    const dy = (e.clientY - lastPointerY) / window.innerHeight * viewHeight;
    scrollOffset += dy;
    lastPointerY = e.clientY;
    scrollVelocity = dy;
    layoutBubbles();
  }

  function onPointerUp() {
    isDragging = false;
  }

  function onWheel(e: WheelEvent) {
    e.preventDefault();
    const dy = -e.deltaY / window.innerHeight * viewHeight * 3;
    scrollOffset += dy;
    layoutBubbles();
  }

  renderer.domElement.addEventListener("pointerdown", onPointerDown);
  renderer.domElement.addEventListener("pointermove", onPointerMove);
  renderer.domElement.addEventListener("pointerup", onPointerUp);
  renderer.domElement.addEventListener("wheel", onWheel, { passive: false });

  // Keyboard input for demo
  let inputText = "";
  function onKeyDown(e: KeyboardEvent) {
    if (e.key === "Enter" && inputText.trim()) {
      const now = new Date();
      const h = now.getHours();
      const m = now.getMinutes().toString().padStart(2, "0");
      const ampm = h >= 12 ? "PM" : "AM";
      const timeStr = `${h % 12 || 12}:${m} ${ampm}`;

      addBubble({ text: inputText.trim(), sender: "me", time: timeStr }, true);
      inputText = "";
      updateInputText("");

      // Auto-scroll down
      const totalHeight = bubbles.reduce((sum, b) => sum + b.height + BUBBLE_GAP, 0);
      if (totalHeight > chatAreaHeight) {
        scrollOffset = -(totalHeight - chatAreaHeight) - 0.3;
        layoutBubbles();
      }
    } else if (e.key === "Backspace") {
      inputText = inputText.slice(0, -1);
      updateInputText(inputText);
    } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
      inputText += e.key;
      updateInputText(inputText);
    }
  }

  window.addEventListener("keydown", onKeyDown);

  // Animate particles
  function animateParticles(time: number) {
    const positions = particles.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < positions.length / 3; i++) {
      positions[i * 3 + 1] += Math.sin(time * 0.5 + i * 0.7) * 0.001;
      positions[i * 3] += Math.cos(time * 0.3 + i * 0.5) * 0.0005;
    }
    particles.geometry.attributes.position.needsUpdate = true;
  }

  // Animation loop
  const clock = new THREE.Clock();

  function animate() {
    const dt = Math.min(clock.getDelta(), 0.05);
    const elapsed = clock.elapsedTime;

    // Update gradient background
    bgMaterial.uniforms.uTime.value = elapsed;

    // Scroll momentum
    if (!isDragging && Math.abs(scrollVelocity) > 0.001) {
      scrollVelocity *= 0.92;
      scrollOffset += scrollVelocity;
      layoutBubbles();
    }

    // Spring physics for bubble positions and scales
    for (const b of bubbles) {
      // Position spring
      const dispY = b.targetY - b.currentY;
      const accelY = SPRING_STIFFNESS * dispY - SPRING_DAMPING * b.velocityY;
      b.velocityY += accelY * dt;
      b.currentY += b.velocityY * dt;
      b.mesh.position.y = b.currentY;

      // Scale spring
      const dispS = b.targetScale - b.currentScale;
      const accelS = SPRING_STIFFNESS * 1.5 * dispS - SPRING_DAMPING * 1.2 * b.velocityScale;
      b.velocityScale += accelS * dt;
      b.currentScale += b.velocityScale * dt;
      b.mesh.scale.set(b.currentScale, b.currentScale, 1);

      // Clipping: hide if out of chat area
      const visible = b.currentY > chatBottom - b.height && b.currentY < chatTop + b.height;
      b.mesh.visible = visible;
    }

    // Particle bursts
    for (let i = bursts.length - 1; i >= 0; i--) {
      const burst = bursts[i];
      burst.life += dt;
      if (burst.life > burst.maxLife) {
        scene.remove(burst.points);
        burst.points.geometry.dispose();
        (burst.points.material as THREE.PointsMaterial).dispose();
        bursts.splice(i, 1);
        continue;
      }

      const positions = burst.points.geometry.attributes.position.array as Float32Array;
      for (let j = 0; j < positions.length / 3; j++) {
        positions[j * 3] += burst.velocities[j * 3] * dt;
        positions[j * 3 + 1] += burst.velocities[j * 3 + 1] * dt;
        positions[j * 3 + 2] += burst.velocities[j * 3 + 2] * dt;
        // Dampen
        burst.velocities[j * 3] *= 0.97;
        burst.velocities[j * 3 + 1] *= 0.97;
      }
      burst.points.geometry.attributes.position.needsUpdate = true;
      (burst.points.material as THREE.PointsMaterial).opacity =
        1 - burst.life / burst.maxLife;
    }

    // Background particles
    animateParticles(elapsed);

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  animate();

  // Resize handler
  function onResize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    renderer.setSize(w, h);

    const newAspect = w / h;
    const newViewWidth = viewHeight * newAspect;
    camera.left = -newViewWidth / 2;
    camera.right = newViewWidth / 2;
    camera.updateProjectionMatrix();

    bgMaterial.uniforms.uResolution.value.set(w, h);
  }

  window.addEventListener("resize", onResize);

  // Cleanup
  return () => {
    clearInterval(staggerInterval);
    window.removeEventListener("keydown", onKeyDown);
    window.removeEventListener("resize", onResize);
    renderer.domElement.removeEventListener("pointerdown", onPointerDown);
    renderer.domElement.removeEventListener("pointermove", onPointerMove);
    renderer.domElement.removeEventListener("pointerup", onPointerUp);
    renderer.dispose();
    container.removeChild(renderer.domElement);
  };
}
