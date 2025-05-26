/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./app/**/*.{js,jsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
    ,
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          light: "#a6dbe3",
          default: "#2ca4b5",
          dark: "#208696",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      backgroundImage: {
        "custom-gradient":
          "linear-gradient(123deg, #09e1ff69, #d9d9d900 72.32%)",
        "new-gradient": "linear-gradient(309deg, #00acc4, #09e1ff69 58.65%)",
        "input-color": "#116e7b1a",
        "mobile-owner":
          "linear-gradient(132deg, rgb(71 228 249) 0%, rgba(255,255,255,1) 99%)",
        "login-owner":
          "linear-gradient(293deg, rgba(255,255,255,1) 0%, rgba(44,164,181,1) 100%)",
        "column-owner":
          "linear-gradient(201deg, rgba(217, 217, 217, 1) 32%, rgba(44, 164, 181, 1) 100%)",
        "new-bg":
          " linear-gradient(63deg, rgba(44,164,181,1) 0%, rgba(255,255,255,1) 100%)",
        "fuck-bg":
          "linear-gradient(113deg, rgba(9,225,255,0.25) 25%, rgba(9,225,255,0.25) 25%)",
        "text-bg": "linear-gradient(90deg, #105760, #4e6e7b)",
        "owner-gradient":
          "linear-gradient(123deg, #09e1ff69, #d9d9d900 72.32%)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        pulse: {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.5 },
        },
         fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(4px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse": "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        'fade-in': 'fadeIn 0.2s ease-in-out',
      },
      screens: {
        "max-lg": "1156px",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("tailwind-scrollbar-hide")],
};
