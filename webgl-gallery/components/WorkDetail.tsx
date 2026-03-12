'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import { type Artwork, artworks } from '@/lib/data';
import { useTransitionCtx } from '@/lib/TransitionContext';
import WebGLManager from '@/lib/webgl/WebGLManager';

interface Props {
  artwork: Artwork;
}

/**
 * Detail view with GSAP Flip-style enter animation.
 *
 * If a gallery click stored a TransitionState, we animate the hero
 * FROM the saved gallery rect TO its natural detail-page position.
 * This mirrors the GSAP Flip pattern but works across unmount/remount
 * because we stored a plain DOMRect, not the DOM element itself.
 *
 * Three.js mesh tracks the hero element via getBoundingClientRect() every
 * frame, so it automatically follows the GSAP animation — no extra wiring.
 */
export default function WorkDetail({ artwork }: Props) {
  const router = useRouter();
  const { transitionRef, clearTransition } = useTransitionCtx();
  const heroRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const manager = WebGLManager.instance;
    manager.clearPlanes();

    if (!heroRef.current) return;

    const heroEl = heroRef.current;

    manager.loadTexture(artwork.image).then((texture) => {
      if (!heroEl) return;

      const plane = manager.addPlane('hero', heroEl, texture);
      const from = transitionRef.current;

      if (from && from.slug === artwork.slug) {
        // --- Barba-style afterEnter: manual Flip from saved gallery rect ---
        plane.show(); // already visible, Three.js renders at current position

        // Wait one frame so the detail page has painted its natural layout
        requestAnimationFrame(() => {
          if (!heroEl) return;

          const heroRect = heroEl.getBoundingClientRect();
          const { top, left, width, height } = from.fromRect;

          // How much to translate + scale hero so it visually starts at
          // the gallery item's position
          const scaleX = width / heroRect.width;
          const scaleY = height / heroRect.height;
          const tx = left - heroRect.left + (width - heroRect.width) / 2;
          const ty = top - heroRect.top + (height - heroRect.height) / 2;

          gsap.set(heroEl, {
            x: tx,
            y: ty,
            scaleX,
            scaleY,
            transformOrigin: 'center center',
          });

          // Animate hero to its natural (1:1) position — Three.js follows
          gsap.to(heroEl, {
            x: 0,
            y: 0,
            scaleX: 1,
            scaleY: 1,
            duration: 0.95,
            ease: 'power3.inOut',
            clearProps: 'x,y,scaleX,scaleY,transformOrigin',
            onComplete: () => {
              clearTransition();
              revealContent();
            },
          });

          // Back button slides in after hero lands
          gsap.fromTo(
            backRef.current,
            { opacity: 0, x: -12 },
            { opacity: 1, x: 0, duration: 0.5, delay: 0.7, ease: 'power2.out' }
          );
        });
      } else {
        // Direct navigation (no transition state) — simple reveal
        plane.revealIn(0);
        gsap.set(backRef.current, { opacity: 0, x: -12 });
        gsap.to(backRef.current, {
          opacity: 1,
          x: 0,
          duration: 0.5,
          delay: 0.5,
          ease: 'power2.out',
        });
        revealContent(0.5);
      }
    });

    function revealContent(delay = 0) {
      if (!contentRef.current) return;
      gsap.fromTo(
        contentRef.current.children,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          delay,
          stagger: 0.08,
          ease: 'power2.out',
        }
      );
    }

    return () => {
      manager.clearPlanes();
    };
  }, [artwork, transitionRef, clearTransition]);

  const handleBack = () => {
    gsap.to([heroRef.current, contentRef.current], {
      opacity: 0,
      duration: 0.35,
      ease: 'power2.in',
      onComplete: () => router.push('/'),
    });
  };

  const artworkIndex = artworks.findIndex((a) => a.slug === artwork.slug) + 1;

  return (
    <div className="work-detail">
      <button ref={backRef} className="work-back" onClick={handleBack}>
        ← Back
      </button>

      {/* hero: opacity:0 img so Three.js renders the visual */}
      <div className="work-hero" ref={heroRef}>
        <img
          src={artwork.image}
          alt={artwork.title}
          className="work-hero__img"
          draggable={false}
        />
      </div>

      <div className="work-content" ref={contentRef}>
        <div className="work-meta">
          <span className="work-meta__number">
            {String(artworkIndex).padStart(2, '0')}
          </span>
          <div className="work-meta__tags">
            <span>{artwork.medium}</span>
            <span>{artwork.year}</span>
          </div>
        </div>

        <h1 className="work-title">{artwork.title}</h1>
        <p className="work-artist">{artwork.artist}</p>
        <p className="work-description">{artwork.description}</p>

        <div className="work-divider" />
        <p className="work-edition">
          Edition {String(artworkIndex).padStart(2, '0')} /{' '}
          {String(artworks.length).padStart(2, '0')}
        </p>
      </div>
    </div>
  );
}
