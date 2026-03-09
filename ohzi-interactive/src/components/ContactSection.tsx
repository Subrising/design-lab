"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export default function ContactSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="contact"
      className="relative z-10 px-8 py-32 max-w-5xl mx-auto text-center"
    >
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1 }}
      >
        <p className="text-white/20 text-xs tracking-[0.5em] uppercase mb-8">
          Start a Project
        </p>

        <h2 className="text-4xl md:text-6xl lg:text-7xl font-extralight text-white tracking-wider mb-8">
          Let&apos;s Create
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400">
            Something Extraordinary
          </span>
        </h2>

        <p className="text-white/25 text-sm max-w-lg mx-auto mb-12 tracking-wider leading-relaxed">
          Have a project in mind? We&apos;d love to hear about it. Drop us a
          line and let&apos;s build the future of the web together.
        </p>

        <motion.a
          href="mailto:hello@ohzi.io"
          className="inline-block border border-white/20 hover:border-white/40 text-white/70 hover:text-white px-10 py-4 rounded-full text-sm tracking-[0.3em] uppercase transition-all duration-500 hover:bg-white/5"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          data-cursor="pointer"
        >
          Get in Touch
        </motion.a>
      </motion.div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="mt-32 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4"
      >
        <p className="text-white/15 text-[10px] tracking-[0.3em] uppercase">
          OHZI Interactive Studio
        </p>
        <div className="flex gap-8">
          {["GitHub", "LinkedIn", "Twitter"].map((link) => (
            <span
              key={link}
              className="text-white/15 text-[10px] tracking-[0.3em] uppercase hover:text-white/40 transition-colors cursor-pointer"
              data-cursor="pointer"
            >
              {link}
            </span>
          ))}
        </div>
        <p className="text-white/10 text-[10px] tracking-[0.2em]">
          Dive into digital magic
        </p>
      </motion.footer>
    </section>
  );
}
