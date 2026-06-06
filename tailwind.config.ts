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
        primary: "#E8845A",
        "primary-dark": "#d06e45",
        "primary-light": "#f0a07a",
        secondary: "#2C5F5A",
        "secondary-dark": "#1e4540",
        "secondary-light": "#3d7a74",
        cream: "#FDF8F3",
        "cream-dark": "#f0e6d3",
        gold: "#C9A84C",
        "gold-light": "#e8c97a",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        serif: ["var(--font-playfair)", "Georgia", "serif"],
      },
      backgroundImage: {
        "hero-gradient":
          "linear-gradient(135deg, #1a3d38 0%, #2C5F5A 45%, #5a8f89 75%, #E8845A 100%)",
        "paphos-gradient":
          "linear-gradient(135deg, #1a5a7a 0%, #2C7BA3 50%, #E8845A 100%)",
        "tenerife-gradient":
          "linear-gradient(135deg, #c4623e 0%, #E8845A 50%, #2C5F5A 100%)",
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
