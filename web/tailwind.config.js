/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          black: "#0a0a0b",
          blue: "#93C5FD",
          purple: "#8B5CF6"
        }
      }
    }
  },
  plugins: []
};


