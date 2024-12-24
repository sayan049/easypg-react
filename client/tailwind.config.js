/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'custom-gradient': 'linear-gradient(123deg, #09e1ff69, #d9d9d900 72.32%)',
        'new-gradient': 'linear-gradient(172deg, #00acc4, #09e1ff69 58.65%)', // Added gradient
        'input-color':'#116e7b1a',
        'mobile-owner':'linear-gradient(132deg, rgb(71 228 249) 0%, rgba(255,255,255,1) 99%)'

      },
    },
  },
  plugins: [],
};
