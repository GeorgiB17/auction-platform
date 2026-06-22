/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'hdm-red': '#E51433',
        'wine': '#763740',
        'hdm-iron-gray': '#3F4847',
        'carbon-black': '#202424',
        'black': '#000000',
        'carmine': '#A7283B'
      }
    },
  },
  plugins: [],
}

