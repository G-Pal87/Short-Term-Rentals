import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#C97759",
        "primary-dark": "#B0603F",
        "primary-light": "#DDA189",
        secondary: "#2A4F4B",
        "secondary-dark": "#1C3735",
        "secondary-light": "#4C6E6A",
        cream: "#FAF6F0",
        "cream-dark": "#EDE4D6",
        gold: "#B99A5B",
        "gold-light": "#D4BC85",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        serif: ["var(--font-playfair)", "Georgia", "serif"],
      },
      backgroundImage: {
        "hero-gradient":
          "linear-gradient(160deg, #1C3735 0%, #2A4F4B 60%, #4C6E6A 100%)",
        "paphos-gradient":
          "linear-gradient(160deg, #1C3735 0%, #2A4F4B 55%, #C97759 100%)",
        "tenerife-gradient":
          "linear-gradient(160deg, #7A4230 0%, #B0603F 55%, #2A4F4B 100%)",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(28px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        pulseDot: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.6", transform: "scale(1.3)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmerSweep: {
          "0%": { backgroundPosition: "-1200px 0" },
          "100%": { backgroundPosition: "1200px 0" },
        },
        slideRight: {
          "0%": { opacity: "0", transform: "translateX(-20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
      },
      animation: {
        "fade-up": "fadeUp 0.7s ease-out forwards",
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "pulse-dot": "pulseDot 2s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
        shimmer: "shimmerSweep 2.5s linear infinite",
        "slide-right": "slideRight 0.6s ease-out forwards",
      },
      boxShadow: {
        "card-hover": "0 20px 60px -10px rgba(44, 95, 90, 0.2)",
        premium: "0 25px 80px -15px rgba(0, 0, 0, 0.12)",
        glow: "0 0 40px rgba(232, 132, 90, 0.25)",
      },
    },
  },
  plugins: [],
};

export default config;
