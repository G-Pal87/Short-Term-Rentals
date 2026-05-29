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
        secondary: "#2C5F5A",
        "secondary-dark": "#1e4540",
        cream: "#FDF8F3",
        "cream-dark": "#f5ede0",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "hero-gradient":
          "linear-gradient(135deg, #2C5F5A 0%, #1e4540 40%, #E8845A 100%)",
        "paphos-gradient":
          "linear-gradient(135deg, #2C7BA3 0%, #1a5a7a 50%, #E8845A 100%)",
        "tenerife-gradient":
          "linear-gradient(135deg, #E8845A 0%, #c4623e 50%, #2C5F5A 100%)",
      },
    },
  },
  plugins: [],
};
export default config;
