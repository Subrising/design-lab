"use client";

export default function Footer() {
  return (
    <footer className="py-16 px-8 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-6 h-6 relative">
                <div className="absolute inset-0 border border-accent/60 rotate-45" />
              </div>
              <span className="text-sm font-bold tracking-[0.15em] uppercase">
                Active Theory
              </span>
            </div>
            <p className="text-sm text-muted leading-relaxed max-w-xs">
              Pioneering digital experiences that blur the line between technology and art.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-mono tracking-[0.2em] text-muted uppercase mb-4">
              Connect
            </h4>
            <div className="space-y-2">
              {["Twitter / X", "Instagram", "GitHub", "LinkedIn"].map((link) => (
                <a
                  key={link}
                  href="#"
                  className="block text-sm text-fg/60 hover:text-accent transition-colors duration-300"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-mono tracking-[0.2em] text-muted uppercase mb-4">
              Contact
            </h4>
            <a
              href="mailto:hello@activetheory.net"
              className="text-sm text-accent hover:text-accent/80 transition-colors duration-300"
            >
              hello@activetheory.net
            </a>
            <p className="text-sm text-muted mt-4">
              Los Angeles, CA
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-white/5">
          <span className="text-xs text-muted font-mono">
            &copy; {new Date().getFullYear()} Active Theory. All rights reserved.
          </span>
          <span className="text-xs text-muted/40 font-mono">
            Built with WebGL &bull; Three.js &bull; React Three Fiber
          </span>
        </div>
      </div>
    </footer>
  );
}
