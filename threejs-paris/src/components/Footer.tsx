"use client";

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 py-16 px-4">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="mb-4 text-xl font-black text-white">
              <span className="text-cyan-400">THREE</span>.JS PARIS
            </h3>
            <p className="text-sm leading-relaxed text-slate-500">
              The premier WebGL conference in Europe. Two days of talks, workshops, and creative coding.
            </p>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-400">Links</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><a href="#speakers" className="transition-colors hover:text-cyan-400">Speakers</a></li>
              <li><a href="#schedule" className="transition-colors hover:text-cyan-400">Schedule</a></li>
              <li><a href="#sponsors" className="transition-colors hover:text-cyan-400">Sponsors</a></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-400">Connect</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><a href="#" className="transition-colors hover:text-cyan-400">Twitter / X</a></li>
              <li><a href="#" className="transition-colors hover:text-cyan-400">Discord</a></li>
              <li><a href="#" className="transition-colors hover:text-cyan-400">GitHub</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-slate-800 pt-8 text-center text-sm text-slate-600">
          &copy; 2025 Three.js Conference Paris. Built with Three.js, React Three Fiber & Next.js.
        </div>
      </div>
    </footer>
  );
}
