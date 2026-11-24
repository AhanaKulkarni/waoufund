/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#F8FAFF",
        "soft-blue": "#E0EDFF",
        lavender: "#EAE5FF",
        "primary-blue": "#5268E8",
        "violet-accent": "#8271ED",
        "dark-text": "#171C2F",
        "secondary-text": "#69748A",
        border: "#E6EAF2",
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
      },
      boxShadow: {
        subtle: "0 4px 20px -2px rgba(82, 104, 232, 0.06)",
        card: "0 10px 30px -4px rgba(23, 28, 47, 0.04)",
        float: "0 20px 40px -8px rgba(82, 104, 232, 0.12)",
      },
    },
  },
  plugins: [],
};
