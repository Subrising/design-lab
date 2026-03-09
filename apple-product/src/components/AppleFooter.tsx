"use client";

export default function AppleFooter() {
  return (
    <footer className="bg-[#111111] px-6 pb-12">
      {/* CTA Section */}
      <div className="text-center py-20 md:py-28 border-b border-white/[0.06]">
        <h2
          className="font-display tracking-tight text-white"
          style={{ fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 700, lineHeight: 1.07 }}
        >
          Get the most out of your iPhone.
        </h2>
        <p className="text-[#86868b] mt-4 text-lg">
          Trade in your current device and get credit toward a new one.
        </p>
        <div className="mt-8 flex gap-6 items-center justify-center">
          <button className="bg-[#0071e3] hover:bg-[#0077ed] text-white px-8 py-3 rounded-full text-lg font-medium transition-colors">
            Buy iPhone 16 Pro
          </button>
        </div>
      </div>

      {/* Footer links */}
      <div className="max-w-[980px] mx-auto pt-8">
        <p className="text-[#6e6e73] text-xs leading-relaxed mb-6">
          * Trade-in values will vary based on the condition, year, and configuration of your eligible trade-in device. Not all devices are eligible for credit.
          Apple Intelligence is available in beta on all iPhone 16 models, iPhone 15 Pro, and iPhone 15 Pro Max, with Siri and device language set to a supported language.
        </p>
        <div className="section-divider mb-4" />

        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-xs">
          {[
            {
              title: "Shop and Learn",
              links: ["Store", "Mac", "iPad", "iPhone", "Watch", "AirPods"],
            },
            {
              title: "Services",
              links: ["Apple Music", "Apple TV+", "Apple Fitness+", "iCloud", "Apple One"],
            },
            {
              title: "Apple Store",
              links: ["Find a Store", "Genius Bar", "Today at Apple", "Apple Camp"],
            },
            {
              title: "For Business",
              links: ["Apple and Business", "Shop for Business"],
            },
            {
              title: "Apple Values",
              links: ["Accessibility", "Environment", "Privacy", "Supply Chain"],
            },
          ].map((section) => (
            <div key={section.title}>
              <h4 className="text-[#d1d1d6] font-semibold mb-3">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link}>
                    <a className="text-[#6e6e73] hover:text-white transition-colors cursor-pointer">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="section-divider mt-8 mb-4" />
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center text-xs text-[#6e6e73] gap-2 pb-4">
          <p>Copyright &copy; 2024 Apple Inc. All rights reserved.</p>
          <div className="flex gap-4">
            <a className="hover:text-white transition-colors cursor-pointer">Privacy Policy</a>
            <a className="hover:text-white transition-colors cursor-pointer">Terms of Use</a>
            <a className="hover:text-white transition-colors cursor-pointer">Legal</a>
            <a className="hover:text-white transition-colors cursor-pointer">Site Map</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
