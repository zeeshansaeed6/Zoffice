/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/renderer/**/*.{js,jsx}',
    '../../packages/ui/src/**/*.{js,jsx}',
    '../../packages/writer/src/**/*.{js,jsx}',
    '../../packages/sheets/src/**/*.{js,jsx}',
    '../../packages/slides/src/**/*.{js,jsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'Carlito', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
