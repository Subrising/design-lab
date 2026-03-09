"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import Globe from "@/components/Globe";
import MagneticCursor from "@/components/MagneticCursor";
import MagneticButton from "@/components/MagneticButton";
import RevealText from "@/components/RevealText";
import ParallaxSection from "@/components/ParallaxSection";
import Navigation from "@/components/Navigation";
import MouseTrail from "@/components/MouseTrail";

const projects = [
  {
    title: "Nexus Platform",
    category: "Web Design & Development",
    year: "2024",
    color: "#c8ff00",
  },
  {
    title: "Horizon Labs",
    category: "Brand Identity & Digital",
    year: "2024",
    color: "#00ffc8",
  },
  {
    title: "Quantum Studio",
    category: "Interactive Experience",
    year: "2023",
    color: "#ff6600",
  },
  {
    title: "Arctic Systems",
    category: "UI/UX & Motion Design",
    year: "2023",
    color: "#6600ff",
  },
];

const services = [
  { number: "01", title: "Digital Strategy", desc: "Research-driven approach to digital products" },
  { number: "02", title: "UI/UX Design", desc: "Interfaces that feel intuitive and look stunning" },
  { number: "03", title: "Development", desc: "Performant code with cutting-edge tech" },
  { number: "04", title: "Motion Design", desc: "Interactions that bring products to life" },
];

function ProjectCard({
  project,
  index,
}: {
  project: (typeof projects)[0];
  index: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      data-cursor-label="View"
      data-magnetic
      className="group relative border-b border-white/10 py-12 md:py-16"
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.8, delay: index * 0.15 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <motion.p
            className="text-[var(--muted)] text-xs uppercase tracking-[0.3em] mb-3"
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: index * 0.15 + 0.2 }}
          >
            {project.category}
          </motion.p>
          <motion.h3
            className="text-4xl md:text-6xl lg:text-7xl font-light tracking-tight group-hover:translate-x-4 transition-transform duration-500"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: index * 0.15 + 0.1, duration: 0.6 }}
          >
            {project.title}
          </motion.h3>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <span className="text-[var(--muted)] text-sm">{project.year}</span>
          <motion.div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: project.color }}
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
          />
        </div>
      </div>
      {/* Hover accent line */}
      <motion.div
        className="absolute bottom-0 left-0 h-[1px] bg-[var(--accent)]"
        initial={{ width: "0%" }}
        whileHover={{ width: "100%" }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      />
    </motion.div>
  );
}

function ServiceItem({
  service,
  index,
}: {
  service: (typeof services)[0];
  index: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      data-magnetic
      className="group flex items-start gap-6 md:gap-10 py-10 border-b border-white/10"
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.1, duration: 0.6 }}
    >
      <span className="text-[var(--accent)] text-sm font-mono mt-1">
        {service.number}
      </span>
      <div className="flex-1">
        <h4 className="text-2xl md:text-3xl font-light tracking-tight mb-2 group-hover:text-[var(--accent)] transition-colors duration-300">
          {service.title}
        </h4>
        <p className="text-[var(--muted)] text-sm md:text-base max-w-md">
          {service.desc}
        </p>
      </div>
      <motion.div
        className="hidden md:flex w-8 h-8 border border-white/20 rounded-full items-center justify-center group-hover:border-[var(--accent)] transition-colors duration-300"
        whileHover={{ rotate: 45, scale: 1.1 }}
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          className="text-white/50 group-hover:text-[var(--accent)] transition-colors"
        >
          <path
            d="M1 11L11 1M11 1H3M11 1V9"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
      </motion.div>
    </motion.div>
  );
}

function StatCounter({ value, label }: { value: string; label: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      className="text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
    >
      <motion.p
        className="text-5xl md:text-7xl font-light text-[var(--accent)]"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 1 }}
      >
        {value}
      </motion.p>
      <p className="text-[var(--muted)] text-xs uppercase tracking-[0.3em] mt-3">
        {label}
      </p>
    </motion.div>
  );
}

export default function Home() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.8], [1, 0.9]);

  return (
    <main className="bg-[var(--bg)] min-h-screen">
      <MagneticCursor />
      <MouseTrail />
      <Navigation />

      {/* HERO */}
      <motion.section
        ref={heroRef}
        className="relative h-screen flex items-center justify-center overflow-hidden"
        style={{ opacity: heroOpacity, scale: heroScale }}
      >
        {/* Globe background */}
        <div className="absolute inset-0 flex items-center justify-center opacity-60">
          <div className="w-[600px] h-[600px] md:w-[700px] md:h-[700px]">
            <Globe />
          </div>
        </div>

        {/* Hero text overlay */}
        <div className="relative z-10 text-center px-4">
          <motion.p
            className="text-[var(--accent)] text-xs uppercase tracking-[0.5em] mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Digital Design Studio
          </motion.p>

          <div className="mb-6">
            <RevealText
              as="h1"
              className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tighter leading-[0.95]"
              delay={0.4}
            >
              We craft digital
            </RevealText>
            <br />
            <RevealText
              as="h1"
              className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tighter leading-[0.95]"
              delay={0.6}
            >
              experiences that
            </RevealText>
            <br />
            <RevealText
              as="h1"
              className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tighter leading-[0.95] text-[var(--accent)]"
              delay={0.8}
            >
              resonate globally
            </RevealText>
          </div>

          <motion.p
            className="text-[var(--muted)] text-sm md:text-base max-w-md mx-auto mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 1 }}
          >
            Award-winning studio specializing in interactive design,
            development, and brand experiences.
          </motion.p>

          <motion.div
            className="mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8 }}
          >
            <MagneticButton className="inline-block">
              <a
                href="#work"
                className="border border-[var(--accent)] text-[var(--accent)] px-8 py-3 text-sm uppercase tracking-[0.2em] hover:bg-[var(--accent)] hover:text-[var(--bg)] transition-all duration-500"
              >
                Explore Work
              </a>
            </MagneticButton>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-[1px] h-16 bg-gradient-to-b from-[var(--accent)] to-transparent" />
        </motion.div>
      </motion.section>

      {/* STATS */}
      <section className="py-24 md:py-32 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-8 grid grid-cols-2 md:grid-cols-4 gap-12">
          <StatCounter value="150+" label="Projects Delivered" />
          <StatCounter value="40+" label="Global Clients" />
          <StatCounter value="12" label="Awards Won" />
          <StatCounter value="8yr" label="Experience" />
        </div>
      </section>

      {/* WORK */}
      <section id="work" className="py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-8">
          <ParallaxSection speed={0.15}>
            <div className="mb-16">
              <RevealText
                as="p"
                className="text-[var(--accent)] text-xs uppercase tracking-[0.5em] mb-4"
              >
                Selected Work
              </RevealText>
              <RevealText
                as="h2"
                className="text-4xl md:text-6xl font-light tracking-tight"
                delay={0.1}
              >
                Recent Projects
              </RevealText>
            </div>
          </ParallaxSection>

          <div>
            {projects.map((project, i) => (
              <ProjectCard key={project.title} project={project} index={i} />
            ))}
          </div>

          <motion.div
            className="mt-16 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <MagneticButton className="inline-block">
              <a
                href="#"
                className="text-[var(--accent)] text-sm uppercase tracking-[0.2em] border-b border-[var(--accent)]/30 pb-1 hover:border-[var(--accent)] transition-colors"
              >
                View All Projects
              </a>
            </MagneticButton>
          </motion.div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-24 md:py-40 relative">
        <div className="max-w-6xl mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
            <ParallaxSection speed={0.2}>
              <RevealText
                as="p"
                className="text-[var(--accent)] text-xs uppercase tracking-[0.5em] mb-4"
              >
                About Us
              </RevealText>
              <RevealText
                as="h2"
                className="text-4xl md:text-5xl font-light tracking-tight leading-tight"
                delay={0.1}
              >
                A studio built on craft and curiosity
              </RevealText>
            </ParallaxSection>

            <ParallaxSection speed={0.1}>
              <div className="space-y-6 text-[var(--muted)] text-sm md:text-base leading-relaxed pt-4">
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                >
                  We are a multidisciplinary design studio focused on creating
                  meaningful digital experiences. Our approach combines strategic
                  thinking with meticulous craftsmanship.
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                >
                  From concept to deployment, we obsess over every pixel and
                  interaction. We believe great design lives at the intersection
                  of beauty and function.
                </motion.p>
              </div>
            </ParallaxSection>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="py-24 md:py-32 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-8">
          <div className="mb-16">
            <RevealText
              as="p"
              className="text-[var(--accent)] text-xs uppercase tracking-[0.5em] mb-4"
            >
              What We Do
            </RevealText>
            <RevealText
              as="h2"
              className="text-4xl md:text-6xl font-light tracking-tight"
              delay={0.1}
            >
              Services
            </RevealText>
          </div>

          <div>
            {services.map((service, i) => (
              <ServiceItem key={service.number} service={service} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <section className="py-16 border-t border-b border-white/5 overflow-hidden">
        <motion.div
          className="flex whitespace-nowrap"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-center gap-8 mr-8">
              {[
                "Design",
                "Development",
                "Motion",
                "Strategy",
                "Branding",
                "Experience",
              ].map((word, j) => (
                <span
                  key={j}
                  className="text-6xl md:text-8xl font-extralight tracking-tighter text-white/[0.03] hover:text-white/10 transition-colors duration-700"
                >
                  {word}
                </span>
              ))}
            </div>
          ))}
        </motion.div>
      </section>

      {/* CONTACT CTA */}
      <section
        id="contact"
        className="py-32 md:py-48 flex items-center justify-center"
      >
        <div className="text-center px-8">
          <RevealText
            as="p"
            className="text-[var(--accent)] text-xs uppercase tracking-[0.5em] mb-6"
          >
            Get in Touch
          </RevealText>
          <RevealText
            as="h2"
            className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tighter mb-12"
            delay={0.1}
          >
            Start a project
          </RevealText>

          <MagneticButton className="inline-block" strength={0.5}>
            <a
              href="mailto:hello@studio-dialect.com"
              data-cursor-label="Send"
              className="group relative inline-flex items-center gap-4 bg-[var(--accent)] text-[var(--bg)] px-10 py-5 text-sm uppercase tracking-[0.2em] font-medium hover:gap-8 transition-all duration-500"
            >
              <span>Say Hello</span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 12 12"
                fill="none"
                className="group-hover:rotate-45 transition-transform duration-500"
              >
                <path
                  d="M1 11L11 1M11 1H3M11 1V9"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
            </a>
          </MagneticButton>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 py-12">
        <div className="max-w-6xl mx-auto px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-[var(--muted)] text-xs">
            &copy; 2024 Studio Dialect. All rights reserved.
          </p>
          <div className="flex gap-6">
            {["Twitter", "Dribbble", "LinkedIn", "Instagram"].map((link) => (
              <MagneticButton key={link}>
                <a
                  href="#"
                  className="text-[var(--muted)] text-xs uppercase tracking-wider hover:text-[var(--accent)] transition-colors duration-300"
                >
                  {link}
                </a>
              </MagneticButton>
            ))}
          </div>
        </div>
      </footer>
    </main>
  );
}
