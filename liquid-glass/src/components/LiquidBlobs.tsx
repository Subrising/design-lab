"use client";

export default function LiquidBlobs() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* SVG filter for liquid/gooey effect */}
      <svg className="absolute w-0 h-0">
        <defs>
          <filter id="liquid">
            <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -8"
              result="liquid"
            />
            <feComposite in="SourceGraphic" in2="liquid" operator="atop" />
          </filter>
        </defs>
      </svg>

      {/* Blob 1 — Purple/violet */}
      <div
        className="blob-1 absolute top-[10%] left-[15%] w-[500px] h-[500px] rounded-full opacity-30"
        style={{
          background: "radial-gradient(circle, #7c3aed 0%, #4c1d95 40%, transparent 70%)",
        }}
      />

      {/* Blob 2 — Cyan/teal */}
      <div
        className="blob-2 absolute top-[40%] right-[10%] w-[600px] h-[600px] rounded-full opacity-25"
        style={{
          background: "radial-gradient(circle, #06b6d4 0%, #0e7490 40%, transparent 70%)",
        }}
      />

      {/* Blob 3 — Rose/pink */}
      <div
        className="blob-3 absolute bottom-[5%] left-[30%] w-[450px] h-[450px] rounded-full opacity-20"
        style={{
          background: "radial-gradient(circle, #f43f5e 0%, #9f1239 40%, transparent 70%)",
        }}
      />

      {/* Blob 4 — Indigo accent, smaller */}
      <div
        className="blob-2 absolute top-[60%] left-[5%] w-[300px] h-[300px] rounded-full opacity-15"
        style={{
          background: "radial-gradient(circle, #818cf8 0%, #3730a3 40%, transparent 70%)",
        }}
      />

      {/* Grain overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}
