/**
 * Generic object pool for reusing particle data objects.
 * Avoids GC pressure by recycling typed array slots.
 */
export class ObjectPool<T> {
  private pool: T[] = [];
  private factory: () => T;
  private reset: (obj: T) => void;

  constructor(factory: () => T, reset: (obj: T) => void, initialSize = 0) {
    this.factory = factory;
    this.reset = reset;
    for (let i = 0; i < initialSize; i++) {
      this.pool.push(factory());
    }
  }

  acquire(): T {
    if (this.pool.length > 0) {
      return this.pool.pop()!;
    }
    return this.factory();
  }

  release(obj: T): void {
    this.reset(obj);
    this.pool.push(obj);
  }

  get available(): number {
    return this.pool.length;
  }
}

/**
 * Particle data structure for the pool
 */
export interface ParticleData {
  x: number;
  y: number;
  z: number;
  targetX: number;
  targetY: number;
  targetZ: number;
  size: number;
  colorR: number;
  colorG: number;
  colorB: number;
  genreIndex: number;
  songId: number;
}

export function createParticlePool(size: number): ObjectPool<ParticleData> {
  return new ObjectPool<ParticleData>(
    () => ({
      x: 0, y: 0, z: 0,
      targetX: 0, targetY: 0, targetZ: 0,
      size: 1,
      colorR: 1, colorG: 1, colorB: 1,
      genreIndex: 0,
      songId: -1,
    }),
    (obj) => {
      obj.x = 0; obj.y = 0; obj.z = 0;
      obj.targetX = 0; obj.targetY = 0; obj.targetZ = 0;
      obj.size = 1;
      obj.colorR = 1; obj.colorG = 1; obj.colorB = 1;
      obj.genreIndex = 0;
      obj.songId = -1;
    },
    size
  );
}
