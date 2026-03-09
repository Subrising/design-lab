"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────────
   NAV
   ───────────────────────────────────────────── */
function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 md:px-16 py-5 transition-all duration-500 ${
        scrolled
          ? "bg-dark-900/80 backdrop-blur-xl border-b border-white/5"
          : "bg-transparent"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex items-center gap-2">
        <span className="text-neon-pink text-2xl font-black tracking-tighter neon-glow-pink">
          NEON
        </span>
        <span className="text-white text-2xl font-light tracking-widest">
          RATED
        </span>
      </div>
      <div className="hidden md:flex items-center gap-10 text-sm font-medium tracking-wider uppercase text-white/60">
        {["Films", "Series", "Culture", "About"].map((item) => (
          <a
            key={item}
            href="#"
            className="hover:text-neon-cyan transition-colors duration-300 relative group"
          >
            {item}
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-neon-cyan group-hover:w-full transition-all duration-300" />
          </a>
        ))}
      </div>
      <button className="px-5 py-2 border border-neon-pink/40 text-neon-pink text-xs font-bold tracking-widest uppercase hover:bg-neon-pink/10 transition-all duration-300 neon-border-pink">
        Subscribe
      </button>
    </motion.nav>
  );
}

/* ─────────────────────────────────────────────
   HERO — Full-bleed cinematic with animated gradient
   ───────────────────────────────────────────── */
function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1]);
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, -100]);

  useEffect(() => {
    if (!titleRef.current || !subtitleRef.current) return;

    const title = titleRef.current;
    const text = title.textContent || "";
    title.textContent = "";

    // Split into characters
    text.split("").forEach((char) => {
      const span = document.createElement("span");
      span.textContent = char === " " ? "\u00A0" : char;
      span.style.display = "inline-block";
      span.style.opacity = "0";
      span.style.transform = "translateY(120%) rotateX(90deg)";
      title.appendChild(span);
    });

    const chars = title.querySelectorAll("span");

    gsap.to(chars, {
      opacity: 1,
      y: 0,
      rotateX: 0,
      duration: 1.2,
      stagger: 0.03,
      ease: "power4.out",
      delay: 0.5,
    });

    gsap.fromTo(
      subtitleRef.current,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 1, delay: 1.5, ease: "power3.out" }
    );
  }, []);

  return (
    <motion.section
      ref={heroRef}
      className="relative h-screen flex items-center justify-center overflow-hidden animated-gradient-bg noise-overlay"
      style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
    >
      {/* Radial glow orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-neon-pink/8 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] bg-neon-cyan/6 rounded-full blur-[100px] animate-pulse [animation-delay:2s]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-neon-violet/5 rounded-full blur-[150px]" />
      </div>

      {/* Horizontal scan line */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-neon-cyan/30 to-transparent"
          initial={{ top: "-10%" }}
          animate={{ top: "110%" }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <div className="relative z-10 text-center px-6 max-w-6xl">
        <motion.div
          className="mb-6 text-xs md:text-sm font-bold tracking-[0.4em] uppercase text-neon-cyan/80"
          initial={{ opacity: 0, letterSpacing: "0.8em" }}
          animate={{ opacity: 1, letterSpacing: "0.4em" }}
          transition={{ duration: 1.5, delay: 0.2 }}
        >
          Cinema &bull; Culture &bull; Critique
        </motion.div>
        <h1
          ref={titleRef}
          className="text-[clamp(3rem,12vw,12rem)] font-black leading-[0.85] tracking-tighter text-white [perspective:1000px]"
        >
          NEON RATED
        </h1>
        <p
          ref={subtitleRef}
          className="mt-8 text-lg md:text-xl text-white/50 font-light max-w-2xl mx-auto leading-relaxed"
        >
          Where cinema meets the electric pulse of culture.
          Every frame tells a story worth telling.
        </p>
        <motion.div
          className="mt-12 flex items-center justify-center gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
        >
          <button className="group relative px-8 py-4 bg-neon-pink text-white font-bold text-sm tracking-widest uppercase overflow-hidden">
            <span className="relative z-10">Explore Now</span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
          </button>
          <button className="px-8 py-4 border border-white/20 text-white/70 font-medium text-sm tracking-widest uppercase hover:border-neon-cyan/50 hover:text-neon-cyan transition-all duration-500">
            Watch Trailer
          </button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
      >
        <span className="text-[10px] tracking-[0.3em] uppercase text-white/30 font-medium">
          Scroll
        </span>
        <motion.div
          className="w-[1px] h-10 bg-gradient-to-b from-neon-pink/60 to-transparent"
          animate={{ scaleY: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ transformOrigin: "top" }}
        />
      </motion.div>
    </motion.section>
  );
}

/* ─────────────────────────────────────────────
   FEATURED SECTION — Dramatic text reveals
   ───────────────────────────────────────────── */
function FeaturedSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !headingRef.current || !cardsRef.current) return;

    // Heading reveal
    gsap.fromTo(
      headingRef.current,
      { opacity: 0, y: 80, skewY: 3 },
      {
        opacity: 1,
        y: 0,
        skewY: 0,
        duration: 1.2,
        ease: "power4.out",
        scrollTrigger: {
          trigger: headingRef.current,
          start: "top 85%",
          end: "top 50%",
          toggleActions: "play none none reverse",
        },
      }
    );

    // Cards stagger
    const cards = cardsRef.current.querySelectorAll(".featured-card");
    gsap.fromTo(
      cards,
      { opacity: 0, y: 100, scale: 0.9 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: cardsRef.current,
          start: "top 80%",
          end: "top 40%",
          toggleActions: "play none none reverse",
        },
      }
    );
  }, []);

  const films = [
    {
      title: "NEON DREAMS",
      genre: "Sci-Fi / Drama",
      year: "2025",
      rating: "9.2",
      gradient: "from-neon-pink/20 to-neon-violet/5",
      accent: "neon-pink",
    },
    {
      title: "DARK SIGNAL",
      genre: "Thriller / Mystery",
      year: "2025",
      rating: "8.7",
      gradient: "from-neon-cyan/20 to-blue-900/5",
      accent: "neon-cyan",
    },
    {
      title: "CHROME HEART",
      genre: "Neo-noir / Action",
      year: "2024",
      rating: "9.0",
      gradient: "from-neon-violet/20 to-neon-pink/5",
      accent: "neon-violet",
    },
    {
      title: "VOID WALKER",
      genre: "Horror / Sci-Fi",
      year: "2025",
      rating: "8.9",
      gradient: "from-neon-amber/20 to-orange-900/5",
      accent: "neon-amber",
    },
  ];

  return (
    <section ref={sectionRef} className="relative py-32 px-6 md:px-16 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-dark-900 via-dark-800 to-dark-900" />
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="mb-4 flex items-center gap-4">
          <div className="w-12 h-[1px] bg-neon-pink" />
          <span className="text-neon-pink text-xs font-bold tracking-[0.3em] uppercase">
            Featured
          </span>
        </div>
        <h2
          ref={headingRef}
          className="text-[clamp(2.5rem,6vw,6rem)] font-black text-white leading-[0.9] tracking-tight mb-16"
        >
          NOW
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-pink via-neon-violet to-neon-cyan">
            SCREENING
          </span>
        </h2>

        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {films.map((film) => (
            <div
              key={film.title}
              className={`featured-card group relative bg-gradient-to-br ${film.gradient} border border-white/5 p-6 cursor-pointer overflow-hidden hover:border-${film.accent}/30 transition-all duration-500`}
            >
              {/* Fake poster area */}
              <div className="aspect-[2/3] mb-6 bg-dark-700/50 relative overflow-hidden">
                <div
                  className={`absolute inset-0 bg-gradient-to-t from-${film.accent}/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className={`w-16 h-16 border-2 border-${film.accent}/40 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-500`}
                  >
                    <div
                      className={`w-0 h-0 border-l-[12px] border-l-${film.accent} border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent ml-1`}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mb-2">
                <span className="text-white/40 text-xs font-medium tracking-wider">
                  {film.year}
                </span>
                <span className={`text-${film.accent} text-xs font-bold`}>
                  ★ {film.rating}
                </span>
              </div>
              <h3 className="text-white text-lg font-black tracking-tight mb-1 group-hover:text-neon-cyan transition-colors duration-300">
                {film.title}
              </h3>
              <p className="text-white/30 text-xs tracking-wider uppercase">
                {film.genre}
              </p>

              {/* Hover glow line */}
              <div
                className={`absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-${film.accent} to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500`}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   EDITORIAL — Large cinematic text + parallax
   ───────────────────────────────────────────── */
function EditorialSection() {
  const ref = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || !textRef.current) return;

    const lines = textRef.current.querySelectorAll(".editorial-line");

    lines.forEach((line, i) => {
      gsap.fromTo(
        line,
        {
          opacity: 0,
          x: i % 2 === 0 ? -120 : 120,
          skewX: i % 2 === 0 ? -5 : 5,
        },
        {
          opacity: 1,
          x: 0,
          skewX: 0,
          duration: 1,
          ease: "power4.out",
          scrollTrigger: {
            trigger: line,
            start: "top 85%",
            end: "top 50%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });
  }, []);

  return (
    <section
      ref={ref}
      className="relative py-40 px-6 md:px-16 overflow-hidden"
    >
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-neon-pink/4 blur-[200px] rounded-full" />

      <div className="neon-hr mb-20 max-w-4xl mx-auto" />

      <div ref={textRef} className="relative z-10 max-w-6xl mx-auto">
        <div className="editorial-line mb-4">
          <span className="text-[clamp(1.5rem,4vw,4rem)] font-light text-white/30 tracking-tight leading-tight block">
            We don&apos;t just watch films.
          </span>
        </div>
        <div className="editorial-line mb-4">
          <span className="text-[clamp(1.5rem,4vw,4rem)] font-black text-white tracking-tight leading-tight block">
            We{" "}
            <span className="text-neon-pink neon-glow-pink">dissect</span>{" "}
            them.
          </span>
        </div>
        <div className="editorial-line mb-4">
          <span className="text-[clamp(1.5rem,4vw,4rem)] font-light text-white/30 tracking-tight leading-tight block">
            Frame by frame.
          </span>
        </div>
        <div className="editorial-line mb-4">
          <span className="text-[clamp(1.5rem,4vw,4rem)] font-black text-white tracking-tight leading-tight block">
            Shot by{" "}
            <span className="text-neon-cyan neon-glow-cyan">electric</span>{" "}
            shot.
          </span>
        </div>
        <div className="editorial-line">
          <span className="text-[clamp(1.5rem,4vw,4rem)] font-light text-white/20 tracking-tight leading-tight block">
            Until the screen burns bright.
          </span>
        </div>
      </div>

      <div className="neon-hr mt-20 max-w-4xl mx-auto" />
    </section>
  );
}

/* ─────────────────────────────────────────────
   MARQUEE — Infinite scroll text
   ───────────────────────────────────────────── */
function Marquee() {
  return (
    <section className="relative py-16 overflow-hidden border-y border-white/5">
      <div className="absolute inset-0 bg-gradient-to-r from-dark-900 via-transparent to-dark-900 z-10 pointer-events-none" />
      <motion.div
        className="flex gap-12 whitespace-nowrap"
        animate={{ x: [0, "-50%"] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        {[...Array(2)].map((_, i) => (
          <div key={i} className="flex gap-12 items-center">
            {[
              "NEON DREAMS",
              "★",
              "DARK SIGNAL",
              "★",
              "CHROME HEART",
              "★",
              "VOID WALKER",
              "★",
              "GHOST PROTOCOL",
              "★",
              "SILVER LINING",
              "★",
            ].map((text, j) => (
              <span
                key={`${i}-${j}`}
                className={`text-6xl md:text-8xl font-black tracking-tighter ${
                  text === "★"
                    ? "text-neon-pink neon-glow-pink text-4xl md:text-6xl"
                    : "text-white/[0.03] hover:text-white/10 transition-colors duration-700"
                }`}
              >
                {text}
              </span>
            ))}
          </div>
        ))}
      </motion.div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   STATS — Cinematic number reveals
   ───────────────────────────────────────────── */
function StatsSection() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const statEls = ref.current.querySelectorAll(".stat-item");

    statEls.forEach((el) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Animate counter
      const numEl = el.querySelector(".stat-num") as HTMLElement;
      if (numEl) {
        const target = parseInt(numEl.dataset.target || "0");
        gsap.fromTo(
          { val: 0 },
          { val: target },
          {
            val: target,
            duration: 2,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
            onUpdate: function () {
              numEl.textContent = Math.round(this.targets()[0].val).toLocaleString();
            },
          }
        );
      }
    });
  }, []);

  const stats = [
    { num: 2847, label: "Films Reviewed", accent: "neon-pink" },
    { num: 156, label: "Critics Worldwide", accent: "neon-cyan" },
    { num: 94, label: "Countries Reached", accent: "neon-violet" },
    { num: 12, label: "Years Running", accent: "neon-amber" },
  ];

  return (
    <section ref={ref} className="relative py-32 px-6 md:px-16">
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="stat-item text-center p-8 border border-white/5 bg-dark-800/30 hover:border-white/10 transition-all duration-500"
          >
            <div
              className={`stat-num text-${stat.accent} text-5xl md:text-6xl font-black tracking-tighter mb-2`}
              data-target={stat.num}
            >
              0
            </div>
            <div className="text-white/30 text-xs tracking-[0.2em] uppercase font-medium">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   CATEGORIES — Horizontal scroll section
   ───────────────────────────────────────────── */
function CategoriesSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !scrollRef.current) return;

    const scrollWidth = scrollRef.current.scrollWidth - window.innerWidth;

    gsap.to(scrollRef.current, {
      x: -scrollWidth,
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: `+=${scrollWidth}`,
        pin: true,
        scrub: 1,
      },
    });
  }, []);

  const categories = [
    { name: "SCI-FI", count: 342, color: "neon-cyan" },
    { name: "NEO-NOIR", count: 198, color: "neon-pink" },
    { name: "HORROR", count: 267, color: "neon-violet" },
    { name: "DRAMA", count: 521, color: "neon-amber" },
    { name: "ACTION", count: 445, color: "neon-pink" },
    { name: "THRILLER", count: 389, color: "neon-cyan" },
  ];

  return (
    <section ref={containerRef} className="relative h-screen overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-dark-900 via-dark-800 to-dark-900" />
      <div
        ref={scrollRef}
        className="relative z-10 flex items-center h-full gap-8 pl-16 pr-[50vw]"
      >
        <div className="shrink-0 w-[300px]">
          <span className="text-neon-pink text-xs font-bold tracking-[0.3em] uppercase block mb-4">
            Browse
          </span>
          <h2 className="text-5xl md:text-7xl font-black text-white tracking-tight leading-[0.9]">
            GENRE
            <br />
            <span className="text-white/20">INDEX</span>
          </h2>
        </div>
        {categories.map((cat) => (
          <div
            key={cat.name}
            className="shrink-0 w-[350px] h-[450px] group relative border border-white/5 bg-dark-800/30 p-8 flex flex-col justify-end cursor-pointer hover:border-white/10 transition-all duration-500 overflow-hidden"
          >
            <div
              className={`absolute inset-0 bg-gradient-to-t from-${cat.color}/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700`}
            />
            <div className="relative z-10">
              <span className="text-white/20 text-xs tracking-[0.3em] block mb-2">
                {cat.count} FILMS
              </span>
              <h3
                className={`text-4xl font-black text-white tracking-tight group-hover:text-${cat.color} transition-colors duration-500`}
              >
                {cat.name}
              </h3>
            </div>
            <div
              className={`absolute bottom-0 left-0 right-0 h-[2px] bg-${cat.color} scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   QUOTE — Cinematic pull-quote
   ───────────────────────────────────────────── */
function QuoteSection() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    gsap.fromTo(
      ref.current.querySelector(".quote-mark"),
      { opacity: 0, scale: 2 },
      {
        opacity: 0.1,
        scale: 1,
        duration: 1.5,
        ease: "power4.out",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
      }
    );

    gsap.fromTo(
      ref.current.querySelector(".quote-text"),
      { opacity: 0, y: 60 },
      {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: "power4.out",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
      }
    );
  }, []);

  return (
    <section ref={ref} className="relative py-40 px-6 md:px-16 overflow-hidden">
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-neon-violet/5 blur-[150px] rounded-full -translate-y-1/2" />
      <div className="max-w-5xl mx-auto text-center relative">
        <span className="quote-mark absolute -top-20 left-1/2 -translate-x-1/2 text-[20rem] font-black text-white leading-none select-none pointer-events-none">
          &ldquo;
        </span>
        <blockquote className="quote-text relative z-10">
          <p className="text-[clamp(1.5rem,3.5vw,3.5rem)] font-light text-white/80 leading-snug tracking-tight">
            Cinema is a mirror that shows us
            <span className="text-neon-pink font-bold"> who we are</span>,
            a window that reveals
            <span className="text-neon-cyan font-bold"> what we could become</span>.
          </p>
          <footer className="mt-10 text-white/30 text-sm tracking-[0.3em] uppercase">
            — The Neon Manifesto
          </footer>
        </blockquote>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   NEWSLETTER CTA — Neon-lit call to action
   ───────────────────────────────────────────── */
function NewsletterCTA() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    gsap.fromTo(
      ref.current.querySelector(".cta-box"),
      { opacity: 0, scale: 0.95 },
      {
        opacity: 1,
        scale: 1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      }
    );
  }, []);

  return (
    <section ref={ref} className="relative py-32 px-6 md:px-16">
      <div className="cta-box max-w-4xl mx-auto relative border border-white/5 p-12 md:p-20 text-center overflow-hidden">
        {/* Corner accents */}
        <div className="absolute top-0 left-0 w-16 h-16 border-t border-l border-neon-pink/40" />
        <div className="absolute top-0 right-0 w-16 h-16 border-t border-r border-neon-cyan/40" />
        <div className="absolute bottom-0 left-0 w-16 h-16 border-b border-l border-neon-cyan/40" />
        <div className="absolute bottom-0 right-0 w-16 h-16 border-b border-r border-neon-pink/40" />

        {/* Background glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-neon-pink/5 via-transparent to-neon-cyan/5" />

        <div className="relative z-10">
          <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-4">
            JOIN THE
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-pink to-neon-cyan">
              SIGNAL
            </span>
          </h2>
          <p className="text-white/40 text-lg mb-10 max-w-lg mx-auto">
            Weekly dispatches from the electric frontier of cinema.
            No noise, just signal.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 px-6 py-4 bg-dark-700/50 border border-white/10 text-white placeholder:text-white/20 text-sm tracking-wider focus:outline-none focus:border-neon-pink/50 transition-colors"
            />
            <button className="px-8 py-4 bg-neon-pink text-white font-bold text-sm tracking-widest uppercase hover:bg-neon-pink/80 transition-colors duration-300">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   FOOTER
   ───────────────────────────────────────────── */
function Footer() {
  return (
    <footer className="relative border-t border-white/5 py-16 px-6 md:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
          <div>
            <span className="text-neon-pink text-3xl font-black tracking-tighter neon-glow-pink">
              NEON
            </span>
            <span className="text-white text-3xl font-light tracking-widest ml-2">
              RATED
            </span>
          </div>
          <div className="flex gap-8 text-sm text-white/30 tracking-wider uppercase">
            {["Films", "Series", "Podcast", "About", "Contact"].map(
              (link) => (
                <a
                  key={link}
                  href="#"
                  className="hover:text-neon-cyan transition-colors duration-300"
                >
                  {link}
                </a>
              )
            )}
          </div>
        </div>
        <div className="neon-hr mb-8" />
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/20 tracking-wider">
          <span>&copy; 2025 NEON RATED. All rights reserved.</span>
          <span>
            Designed with{" "}
            <span className="text-neon-pink neon-glow-pink">&hearts;</span> for
            cinema lovers
          </span>
        </div>
      </div>
    </footer>
  );
}

/* ─────────────────────────────────────────────
   PAGE
   ───────────────────────────────────────────── */
export default function NeonRatedPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Loader */}
      <AnimatePresence>
        {loading && (
          <motion.div
            className="fixed inset-0 z-[100] bg-dark-900 flex items-center justify-center"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            <motion.div
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.div
                className="text-5xl font-black tracking-tighter"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <span className="text-neon-pink neon-glow-pink">NEON</span>
                <span className="text-white ml-3">RATED</span>
              </motion.div>
              <motion.div
                className="mt-6 w-32 h-[1px] bg-gradient-to-r from-transparent via-neon-pink to-transparent mx-auto"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <main>
        <Nav />
        <Hero />
        <FeaturedSection />
        <Marquee />
        <EditorialSection />
        <StatsSection />
        <CategoriesSection />
        <QuoteSection />
        <NewsletterCTA />
        <Footer />
      </main>
    </>
  );
}
