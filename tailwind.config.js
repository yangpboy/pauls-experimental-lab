/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'light-bg': 'var(--color-light-bg)',
        'light-ink': 'var(--color-light-ink)',
        'light-teal': 'var(--color-light-teal)',
        'light-coral': 'var(--color-light-coral)',
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
