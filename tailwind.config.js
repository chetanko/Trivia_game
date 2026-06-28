/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        chalk: {
          50: '#f6fbf7',
          100: '#e1f2e6',
          500: '#2f8f61',
          700: '#1d6847',
          900: '#123b2b',
        },
        slateboard: {
          900: '#101820',
          800: '#182631',
          700: '#253442',
        },
        marigold: '#f4b942',
        coral: '#f45b69',
        skyroom: '#4f9cf9',
      },
      boxShadow: {
        board: '0 24px 70px rgba(16, 24, 32, 0.25)',
        glow: '0 0 0 4px rgba(244, 185, 66, 0.24)',
      },
      fontFamily: {
        display: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
