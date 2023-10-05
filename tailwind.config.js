/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gray: {
          850: '#18202F'
        }
      },
      spacing: {
        '2px': '2px'
      }
    },
  },
  plugins: [],
}
