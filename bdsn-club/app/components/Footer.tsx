'use client';

export default function Footer() {
  return (
    <footer id="contact" className="relative z-10 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <h3 className="text-2xl font-bold mb-4">
              <span className="text-neon-purple">BDSN</span>
              <span className="text-white/60">.club</span>
            </h3>
            <p className="text-white/40 text-sm leading-relaxed">
              Generative art collective exploring the boundaries of interactive web
              experiences through code, mathematics, and design.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-mono text-white/60 uppercase tracking-wider mb-4">
              Links
            </h4>
            <div className="flex flex-col gap-3">
              {['Twitter / X', 'GitHub', 'Dribbble', 'Instagram'].map((link) => (
                <a
                  key={link}
                  href="#"
                  className="text-white/40 hover:text-neon-purple transition-colors text-sm"
                  data-cursor-hover
                >
                  {link}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-mono text-white/60 uppercase tracking-wider mb-4">
              Contact
            </h4>
            <a
              href="mailto:hello@bdsn.club"
              className="text-neon-purple hover:text-neon-pink transition-colors text-sm"
              data-cursor-hover
            >
              hello@bdsn.club
            </a>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/20 font-mono">
            &copy; 2026 BDSN.club — All rights reserved
          </p>
          <p className="text-xs text-white/20 font-mono">
            Built with Three.js, React Three Fiber, GLSL
          </p>
        </div>
      </div>
    </footer>
  );
}
