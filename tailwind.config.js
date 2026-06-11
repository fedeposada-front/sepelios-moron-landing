/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        burgundy: {
          DEFAULT: "#7A1016",
          deep: "#5E0C11",
          soft: "#8E2128",
        },
        gold: {
          DEFAULT: "#C7A56A",
          soft: "#D8BE8E",
        },
        bg: {
          DEFAULT: "#F7F4EF",
          warm: "#F1EBE1",
        },
        ink: "#1E1A18",
        muted: "#5F5752",
        line: "#E4DCCF",
        white: "#FFFFFF",
        wa: {
          DEFAULT: "#25D366",
          deep: "#1FAE55",
        },
      },
      borderRadius: {
        xl2: "16px",
        xl3: "24px",
      },
      fontFamily: {
        head: ['"Playfair Display"', "Georgia", "serif"],
        body: ["Montserrat", "system-ui", "sans-serif"],
      },
      boxShadow: {
        sm: "0 1px 2px rgba(30, 26, 24, 0.04), 0 2px 8px rgba(30, 26, 24, 0.05)",
        md: "0 4px 16px rgba(30, 26, 24, 0.07), 0 12px 36px rgba(30, 26, 24, 0.06)",
      },
      maxWidth: {
        wrap: "1180px",
      },
    },
  },
  plugins: [],
}
