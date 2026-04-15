/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'light-bg': 'var(--color-light-bg)',
        'light-ink': 'var(--color-light-ink)',
        'light-orange': 'var(--color-light-orange)',
        'light-yellow': 'var(--color-light-yellow)',
        'light-green': 'var(--color-light-green)',
        'light-gray': 'var(--color-light-gray)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Bricolage Grotesque', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
