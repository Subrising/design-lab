'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import { artworks } from '@/lib/data';
import { useTransitionCtx } from '@/lib/TransitionContext';
import WebGLManager from '@/lib/webgl/WebGLManager';

/**
 * Gallery grid with:
 *  - WebGL planes pixel-synced to each item container
 *  - IntersectionObserver → GLSL scroll reveal per item
 *  - Hover → barrel distortion + colour restoration shader
 *  - Click → chromatic aberration departure + GSAP Flip navigation
 */
export default function GalleryGrid() {
  const router = useRouter();
  const { setTransition } = useTransitionCtx();
  const itemRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const didInit = useRef(false);

  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;

    const manager = WebGLManager.instance;
    manager.clearPlanes();

    const observers: IntersectionObserver[] = [];

    artworks.forEach((artwork, idx) => {
      const el = itemRefs.current.get(artwork.slug);
      if (!el) return;

      manager.loadTexture(artwork.thumb).then((texture) => {
        const plane = manager.addPlane(artwork.slug, el, texture);

        // Stagger reveal per item once it enters the viewport
        const obs = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                plane.revealIn(idx * 0.07);
                obs.unobserve(el);
              }
            });
          },
          { threshold: 0.12 }
        );
        obs.observe(el);
        observers.push(obs);
      });
    });

    return () => {
      observers.forEach((obs) => obs.disconnect());
      didInit.current = false;
    };
  }, []);

  const handleClick = useCallback(
    (slug: string) => {
      const el = itemRefs.current.get(slug);
      const artwork = artworks.find((a) => a.slug === slug);
      if (!el || !artwork) return;

      const rect = el.getBoundingClientRect();

      // Save transition state for the detail page to read on mount
      setTransition({
        slug,
        fromRect: {
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
        },
        imageUrl: artwork.image,
      });

      // Chromatic aberration on the clicked plane, then navigate
      const plane = WebGLManager.instance.getPlane(slug);
      const otherEls = Array.from(itemRefs.current.entries())
        .filter(([s]) => s !== slug)
        .map(([, e]) => e);

      // Fade siblings
      gsap.to(otherEls, {
        opacity: 0,
        y: -16,
        duration: 0.35,
        stagger: 0.04,
        ease: 'power2.in',
      });

      if (plane) {
        plane.startTransition().then(() => {
          router.push(`/work/${slug}`);
        });
      } else {
        setTimeout(() => router.push(`/work/${slug}`), 350);
      }
    },
    [router, setTransition]
  );

  const handleHover = useCallback((slug: string, entering: boolean) => {
    WebGLManager.instance.getPlane(slug)?.setHover(entering);
  }, []);

  return (
    <section className="gallery-grid">
      {artworks.map((artwork) => (
        <div
          key={artwork.slug}
          className="gallery-item"
          ref={(el) => {
            if (el) itemRefs.current.set(artwork.slug, el);
          }}
        >
          {/*
           * The <img> is opacity:0 so the browser loads it and it
           * defines the element's intrinsic dimensions, but Three.js
           * renders the actual visual via the WebGL plane above.
           */}
          <img
            src={artwork.thumb}
            alt={artwork.title}
            className="gallery-img"
            draggable={false}
          />

          {/* Transparent overlay captures hover + click events */}
          <div
            className="gallery-overlay"
            onClick={() => handleClick(artwork.slug)}
            onMouseEnter={() => handleHover(artwork.slug, true)}
            onMouseLeave={() => handleHover(artwork.slug, false)}
          />

          <div className="gallery-meta">
            <span className="gallery-meta__title">{artwork.title}</span>
            <span className="gallery-meta__artist">{artwork.artist}</span>
          </div>
        </div>
      ))}
    </section>
  );
}
