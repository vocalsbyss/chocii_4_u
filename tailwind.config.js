/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cocoa: {
          950: "#24130F",
          900: "#361D17",
          800: "#4D2B22",
          700: "#63392E",
          600: "#7C493B",
        },
        cream: {
          50: "#FFFCF8",
          100: "#FFF5E9",
          200: "#FCE7D0",
          300: "#F7D5B0",
          400: "#EFC18C",
        },
        caramel: {
          400: "#D9A066",
          500: "#C58A55",
          600: "#A9703E",
          700: "#86542A",
        },
        strawberry: {
          400: "#F2788D",
          500: "#E85D75",
          600: "#CF3E58",
        },
      },
      fontFamily: {
        serif: ["Playfair Display", "Georgia", "serif"],
        sans: ["Plus Jakarta Sans", "Inter", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
      animation: {
        "float-slow": "float 6s ease-in-out infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "spin-slow": "spin 20s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
      },
    },
  },
  plugins: [],
};
