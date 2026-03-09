"use client";

const columns = [
  {
    title: "Product",
    links: ["Features", "Extensions", "API", "Changelog", "Download"],
  },
  {
    title: "Community",
    links: ["Discord", "Twitter", "GitHub", "Blog", "Newsletter"],
  },
  {
    title: "Company",
    links: ["About", "Careers", "Press", "Privacy", "Terms"],
  },
  {
    title: "Support",
    links: ["Documentation", "Guides", "Status", "Contact", "FAQ"],
  },
];

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/5 px-6 py-16">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-ray-pink to-ray-purple flex items-center justify-center">
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                  <path d="M2 8L8 2L14 8L8 14L2 8Z" fill="white" fillOpacity="0.9" />
                </svg>
              </div>
              <span className="text-white font-semibold text-sm">Raycast</span>
            </div>
            <p className="text-xs text-ray-muted leading-relaxed">
              Your shortcut to everything. The fastest way to control your tools.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-xs font-semibold text-white mb-3 uppercase tracking-wider">
                {col.title}
              </h4>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-xs text-ray-muted hover:text-white transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-ray-muted">
            &copy; 2024 Raycast. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {["Twitter", "GitHub", "Discord"].map((social) => (
              <a
                key={social}
                href="#"
                className="text-xs text-ray-muted hover:text-white transition-colors"
              >
                {social}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
