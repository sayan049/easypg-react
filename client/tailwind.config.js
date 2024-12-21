/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'custom-gradient': 'linear-gradient(123deg, #09e1ff69, #d9d9d900 72.32%)',
      },
    },
  },
  
  plugins: [],
}

