'use client';

import * as THREE from 'three';
import { ImagePlane } from './ImagePlane';

/**
 * Singleton Three.js scene manager.
 *
 * Lives inside the root layout so it persists across Next.js route changes.
 * Each page calls clearPlanes() then adds its own planes.
 *
 * Coordinate system: OrthographicCamera where 1 unit == 1 CSS pixel.
 * The canvas is fixed/full-screen with pointer-events:none so DOM
 * elements behind it remain interactive.
 */
class WebGLManager {
  private static _instance: WebGLManager | null = null;

  renderer: THREE.WebGLRenderer | null = null;
  scene: THREE.Scene;
  camera: THREE.OrthographicCamera;
  planes = new Map<string, ImagePlane>();

  private rafId: number | null = null;
  private initialized = false;

  private constructor() {
    this.scene = new THREE.Scene();
    // Frustum will be set correctly in resize(); start with 1:1 unit:pixel
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    this.camera.position.z = 1;
  }

  static get instance(): WebGLManager {
    if (!WebGLManager._instance) {
      WebGLManager._instance = new WebGLManager();
    }
    return WebGLManager._instance;
  }

  init(canvas: HTMLCanvasElement) {
    if (this.initialized) return;
    this.initialized = true;

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      premultipliedAlpha: false,
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.resize();
    this.tick();

    window.addEventListener('resize', this.resize.bind(this));
  }

  resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;

    this.camera.left = -w / 2;
    this.camera.right = w / 2;
    this.camera.top = h / 2;
    this.camera.bottom = -h / 2;
    this.camera.updateProjectionMatrix();

    this.renderer?.setSize(w, h);
  }

  addPlane(id: string, domEl: HTMLElement, texture: THREE.Texture): ImagePlane {
    if (this.planes.has(id)) this.removePlane(id);

    const plane = new ImagePlane(domEl, texture);
    plane.syncWithDOM();
    this.scene.add(plane.mesh);
    this.planes.set(id, plane);
    return plane;
  }

  removePlane(id: string) {
    const plane = this.planes.get(id);
    if (!plane) return;
    this.scene.remove(plane.mesh);
    plane.destroy();
    this.planes.delete(id);
  }

  clearPlanes() {
    for (const id of Array.from(this.planes.keys())) {
      this.removePlane(id);
    }
  }

  getPlane(id: string): ImagePlane | undefined {
    return this.planes.get(id);
  }

  loadTexture(src: string): Promise<THREE.Texture> {
    return new Promise((resolve, reject) => {
      new THREE.TextureLoader().load(
        src,
        (tex) => {
          tex.minFilter = THREE.LinearFilter;
          tex.magFilter = THREE.LinearFilter;
          tex.generateMipmaps = false;
          resolve(tex);
        },
        undefined,
        reject
      );
    });
  }

  private tick() {
    this.rafId = requestAnimationFrame(() => this.tick());

    for (const plane of this.planes.values()) {
      plane.syncWithDOM();
    }

    if (this.renderer) {
      this.renderer.render(this.scene, this.camera);
    }
  }
}

export default WebGLManager;
