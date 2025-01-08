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
        'mobile-owner':'linear-gradient(132deg, rgb(71 228 249) 0%, rgba(255,255,255,1) 99%)',
        'login-owner':'linear-gradient(360deg, rgba(255,255,255,1) 0%, rgba(44,164,181,1) 100%)',
        'column-owner':'linear-gradient(201deg, rgba(217, 217, 217, 1) 32%, rgba(44, 164, 181, 1) 100%)',
        'new-bg':' linear-gradient(63deg, rgba(44,164,181,1) 0%, rgba(255,255,255,1) 100%);',
        'fuck-bg':'linear-gradient(113deg, rgba(9,225,255,0.25) 25%, rgba(9,225,255,0.25) 25%)',
      },
      screens: {
        'max-lg': '1156px', // Custom breakpoint at 1156px
      },
    },
  },
  plugins: [],
};
