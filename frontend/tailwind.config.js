/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1', // Main Indigo accent
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#1e1b4b', // Deep Hero background text
        },
        tealAccent: {
          500: '#0d9488',
          600: '#0f766e',
        },
        amberAccent: {
          500: '#f59e0b',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        opendyslexic: ['OpenDyslexic', 'Inter', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'linguapath': '0 20px 40px -15px rgba(30, 27, 75, 0.07)',
        'linguapath-hover': '0 25px 50px -12px rgba(99, 102, 241, 0.15)',
      },
    },
  },
  plugins: [],
};
