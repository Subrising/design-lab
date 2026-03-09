"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { images } from "@/lib/images";

export function Lightbox() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const imageRef = useRef<HTMLImageElement>(null);

  const open = useCallback((index: number) => {
    setCurrentIndex(index);
    setIsOpen(true);
    document.body.style.overflow = "hidden";
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    document.body.style.overflow = "";
  }, []);

  const next = useCallback(() => {
    setCurrentIndex((i) => (i + 1) % images.lightbox.length);
  }, []);

  const prev = useCallback(() => {
    setCurrentIndex(
      (i) => (i - 1 + images.lightbox.length) % images.lightbox.length
    );
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, close, next, prev]);

  // Animate image on index change
  useEffect(() => {
    if (imageRef.current && isOpen) {
      gsap.fromTo(
        imageRef.current,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.6, ease: "power3.out" }
      );
    }
  }, [currentIndex, isOpen]);

  return (
    <>
      {/* Trigger thumbnails */}
      <section className="py-24 md:py-40 px-6 md:px-12">
        <div className="text-center mb-16">
          <p
            className="font-sans text-[10px] tracking-[0.4em] uppercase text-warm-gray mb-4"
            style={{ fontWeight: 300 }}
          >
            Gallery
          </p>
          <h2
            className="font-serif text-4xl md:text-6xl tracking-wide text-cream/90"
            style={{ fontWeight: 300 }}
          >
            Moments
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 max-w-6xl mx-auto">
          {images.lightbox.map((src, i) => (
            <button
              key={i}
              onClick={() => open(i)}
              className="relative aspect-square overflow-hidden group"
              data-cursor-hover
            >
              <img
                src={src}
                alt={`Gallery image ${i + 1}`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/30 transition-colors duration-500" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <span
                  className="font-sans text-[10px] tracking-[0.3em] uppercase text-cream"
                  style={{ fontWeight: 300 }}
                >
                  View
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Fullscreen lightbox */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-[200] bg-black flex items-center justify-center"
            onClick={close}
          >
            {/* Letterbox bars */}
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: "6vh" }}
              exit={{ height: 0 }}
              transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
              className="absolute top-0 left-0 right-0 bg-black z-10"
            />
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: "6vh" }}
              exit={{ height: 0 }}
              transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
              className="absolute bottom-0 left-0 right-0 bg-black z-10"
            />

            {/* Close button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                close();
              }}
              className="absolute top-8 right-8 z-20 text-cream/50 hover:text-cream transition-colors"
              data-cursor-hover
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <line
                  x1="4"
                  y1="4"
                  x2="20"
                  y2="20"
                  stroke="currentColor"
                  strokeWidth="1"
                />
                <line
                  x1="20"
                  y1="4"
                  x2="4"
                  y2="20"
                  stroke="currentColor"
                  strokeWidth="1"
                />
              </svg>
            </button>

            {/* Navigation */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              className="absolute left-6 md:left-12 top-1/2 -translate-y-1/2 z-20 text-cream/30 hover:text-cream/70 transition-colors"
              data-cursor-hover
            >
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <line
                  x1="20"
                  y1="6"
                  x2="12"
                  y2="16"
                  stroke="currentColor"
                  strokeWidth="1"
                />
                <line
                  x1="12"
                  y1="16"
                  x2="20"
                  y2="26"
                  stroke="currentColor"
                  strokeWidth="1"
                />
              </svg>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              className="absolute right-6 md:right-12 top-1/2 -translate-y-1/2 z-20 text-cream/30 hover:text-cream/70 transition-colors"
              data-cursor-hover
            >
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <line
                  x1="12"
                  y1="6"
                  x2="20"
                  y2="16"
                  stroke="currentColor"
                  strokeWidth="1"
                />
                <line
                  x1="20"
                  y1="16"
                  x2="12"
                  y2="26"
                  stroke="currentColor"
                  strokeWidth="1"
                />
              </svg>
            </button>

            {/* Image */}
            <div
              className="relative w-[90vw] h-[80vh] flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                ref={imageRef}
                src={images.lightbox[currentIndex]}
                alt={`Gallery image ${currentIndex + 1}`}
                className="max-w-full max-h-full object-contain"
              />
            </div>

            {/* Counter */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20">
              <span
                className="font-sans text-xs tracking-[0.3em] text-cream/40"
                style={{ fontWeight: 300 }}
              >
                {String(currentIndex + 1).padStart(2, "0")} /{" "}
                {String(images.lightbox.length).padStart(2, "0")}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
