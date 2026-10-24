/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/renderer/**/*.{js,jsx}',
    '../../packages/ui/src/**/*.{js,jsx}',
    '../../packages/writer/src/**/*.{js,jsx}',
    '../../packages/sheets/src/**/*.{js,jsx}',
    '../../packages/slides/src/**/*.{js,jsx}',
    '../../packages/notes/src/**/*.{js,jsx}',
    '../../packages/mail/src/**/*.{js,jsx}',
    '../../packages/forms/src/**/*.{js,jsx}',
    '../../packages/planner/src/**/*.{js,jsx}',
    '../../packages/draw/src/**/*.{js,jsx}',
    '../../packages/base/src/**/*.{js,jsx}',
    '../../packages/drive/src/**/*.{js,jsx}',
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
