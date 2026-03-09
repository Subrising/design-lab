import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "SF Pro Display",
          "-apple-system",
          "BlinkMacSystemFont",
          "Helvetica Neue",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
        display: [
          "SF Pro Display",
          "-apple-system",
          "BlinkMacSystemFont",
          "Helvetica Neue",
          "sans-serif",
        ],
      },
      colors: {
        apple: {
          blue: "#0071e3",
          "blue-hover": "#0077ED",
          gray: {
            50: "#fbfbfd",
            100: "#f5f5f7",
            200: "#e8e8ed",
            300: "#d2d2d7",
            400: "#86868b",
            500: "#6e6e73",
            600: "#424245",
            700: "#333336",
            800: "#1d1d1f",
            900: "#111111",
          },
        },
      },
      fontSize: {
        "hero-xl": ["96px", { lineHeight: "1.05", letterSpacing: "-0.015em", fontWeight: "700" }],
        "hero-lg": ["80px", { lineHeight: "1.05", letterSpacing: "-0.015em", fontWeight: "700" }],
        "hero-md": ["64px", { lineHeight: "1.05", letterSpacing: "-0.012em", fontWeight: "700" }],
        "section-title": ["56px", { lineHeight: "1.07", letterSpacing: "-0.012em", fontWeight: "700" }],
        "section-subtitle": ["28px", { lineHeight: "1.14", letterSpacing: "0.007em", fontWeight: "600" }],
        "body-xl": ["21px", { lineHeight: "1.381", fontWeight: "400" }],
        "body-lg": ["19px", { lineHeight: "1.421", fontWeight: "400" }],
      },
      spacing: {
        "section": "120px",
        "section-sm": "80px",
      },
    },
  },
  plugins: [],
};

export default config;
