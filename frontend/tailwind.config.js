/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        feedants: {
          bg: '#F6F8FA',
          teal: '#0E7490',
          tealDark: '#155E75',
          tealLight: '#E0F2FE',
          accent: '#06B6D4',
          gold: '#F59E0B',
          silver: '#94A3B8',
          bronze: '#B45309',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        subtle: '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
        card: '0 4px 6px -1px rgba(0, 0, 0, 0.06), 0 2px 4px -2px rgba(0, 0, 0, 0.04)',
        cta: '0 -4px 16px -2px rgba(0, 0, 0, 0.08)',
      },
    },
  },
  plugins: [],
}
