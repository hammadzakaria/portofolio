/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBg: '#0a0a0a',
        darkCard: '#111518',
        textMuted: '#8b949e',
        accentCyan: '#0ea5e9', // Subtle accent cyan
      },
      fontFamily: {
        sans: ['Inter', 'Poppins', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
      },
      letterSpacing: {
        widest: '.2em',
        mega: '.3em',
      }
    },
  },
  plugins: [],
}
