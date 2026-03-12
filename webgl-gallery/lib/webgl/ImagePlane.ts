import * as THREE from 'three';
import gsap from 'gsap';
import {
  REVEAL_VERT,
  REVEAL_FRAG,
  TRANSITION_VERT,
  TRANSITION_FRAG,
} from './shaders';

export type PlaneMode = 'reveal' | 'transition';

/**
 * A Three.js plane that tracks a DOM element pixel-perfect every frame.
 *
 * The scene uses an OrthographicCamera where 1 unit = 1 CSS pixel, so
 * converting from getBoundingClientRect() to world space is simply:
 *   x = rect.centerX - viewport.centerX
 *   y = -(rect.centerY - viewport.centerY)   ← y-up in Three.js
 *
 * PlaneGeometry(1, 1) scaled by (rect.width, rect.height) == pixel-perfect.
 */
export class ImagePlane {
  mesh: THREE.Mesh;

  private domEl: HTMLElement;
  private revealMat: THREE.ShaderMaterial;
  private transitionMat: THREE.ShaderMaterial;

  // Shared uniform objects so tweens on them update the GPU each frame
  private uReveal = { value: 0 };
  private uHover = { value: 0 };
  private uProgress = { value: 0 };

  mode: PlaneMode = 'reveal';

  constructor(domEl: HTMLElement, texture: THREE.Texture) {
    this.domEl = domEl;

    this.revealMat = new THREE.ShaderMaterial({
      uniforms: {
        uTexture: { value: texture },
        uReveal: this.uReveal,
        uHover: this.uHover,
      },
      vertexShader: REVEAL_VERT,
      fragmentShader: REVEAL_FRAG,
      transparent: true,
    });

    this.transitionMat = new THREE.ShaderMaterial({
      uniforms: {
        uTexture: { value: texture },
        uProgress: this.uProgress,
      },
      vertexShader: TRANSITION_VERT,
      fragmentShader: TRANSITION_FRAG,
      transparent: true,
    });

    this.mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), this.revealMat);
  }

  /** Reposition + resize to match DOM element every rAF tick. */
  syncWithDOM() {
    const rect = this.domEl.getBoundingClientRect();

    const x = rect.left + rect.width / 2 - window.innerWidth / 2;
    const y = -(rect.top + rect.height / 2 - window.innerHeight / 2);

    this.mesh.position.set(x, y, 0);
    this.mesh.scale.set(rect.width, rect.height, 1);

    // Cull off-screen planes to skip draw calls
    const inView = rect.bottom > -50 && rect.top < window.innerHeight + 50;
    this.mesh.visible = inView;
  }

  /** Animate uReveal 0→1 (bottom-to-top wavy curtain). */
  revealIn(delay = 0) {
    gsap.killTweensOf(this.uReveal);
    gsap.to(this.uReveal, {
      value: 1,
      duration: 1.4,
      delay,
      ease: 'power3.out',
    });
  }

  /** Instantly show (used when entering detail view from transition). */
  show() {
    gsap.killTweensOf(this.uReveal);
    this.uReveal.value = 1;
  }

  setHover(entering: boolean) {
    gsap.killTweensOf(this.uHover);
    gsap.to(this.uHover, {
      value: entering ? 1 : 0,
      duration: 0.55,
      ease: 'power2.out',
    });
  }

  setMode(mode: PlaneMode) {
    this.mode = mode;
    this.mesh.material = mode === 'reveal' ? this.revealMat : this.transitionMat;
  }

  /** Run chromatic aberration, returns Promise that resolves when done. */
  startTransition(): Promise<void> {
    this.setMode('transition');
    return new Promise((resolve) => {
      gsap.to(this.uProgress, {
        value: 1,
        duration: 0.75,
        ease: 'power2.inOut',
        onComplete: resolve,
      });
    });
  }

  resetTransition() {
    this.uProgress.value = 0;
    this.setMode('reveal');
  }

  destroy() {
    this.mesh.geometry.dispose();
    (this.revealMat as THREE.ShaderMaterial).dispose();
    (this.transitionMat as THREE.ShaderMaterial).dispose();
  }
}
