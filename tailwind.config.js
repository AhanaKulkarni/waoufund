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
        background: "#FAFBFF",
        "soft-blue": "#DDEBFF",
        lavender: "#E8DEFF",
        "primary-blue": "#5368EA",
        violet: "#8069EA",
        "dark-text": "#171A2E",
        "secondary-text": "#68738A",
        border: "#E9EAF2",
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
      },
    },
  },
  plugins: [],
};
