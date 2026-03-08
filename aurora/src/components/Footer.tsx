"use client";

const footerLinks = {
  Product: ["Features", "Pricing", "Changelog", "Roadmap", "Security"],
  Company: ["About", "Blog", "Careers", "Press", "Contact"],
  Resources: ["Documentation", "API Reference", "Guides", "Community", "Status"],
  Legal: ["Privacy", "Terms", "DPA", "Cookie Policy"],
};

export default function Footer() {
  return (
    <footer className="border-t border-border py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-accent to-purple-500 flex items-center justify-center">
                <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                  <path d="M7 1L13 4V10L7 13L1 10V4L7 1Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="font-semibold text-sm">Aurora</span>
            </div>
            <p className="text-xs text-muted leading-relaxed mb-4">
              Build software at the speed of thought.
            </p>
            <div className="flex items-center gap-3">
              {["X", "GH", "DC"].map((social) => (
                <button
                  key={social}
                  className="w-7 h-7 rounded-md bg-white/5 border border-border flex items-center justify-center text-[10px] text-muted hover:text-foreground hover:border-accent/30 transition-colors"
                >
                  {social}
                </button>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted mb-4">{category}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-xs text-muted/70 hover:text-foreground transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted/50">&copy; 2026 Aurora Inc. All rights reserved.</p>
          <p className="text-xs text-muted/30">Design Lab Experiment — Built with Next.js, Tailwind, Framer Motion</p>
        </div>
      </div>
    </footer>
  );
}
