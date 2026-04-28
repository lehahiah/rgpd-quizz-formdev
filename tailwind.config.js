/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: {
            DEFAULT: '#0A69B3',
            dark: '#073d6b',
            light: '#dbeeff',
          },
          action: '#007EFF',
          accent: {
            DEFAULT: '#F39207',
            light: '#FEF3DC',
          },
          bg: '#F7F7F7',
          surface: '#FFFFFF',
          border: '#E6E6E6',
          text: {
            DEFAULT: '#000000',
            muted: '#4a4a4a',
          },
          success: '#2E9E6F',
          warning: '#F39207',
          danger: '#D9534F',
          // Legacy aliases kept for ProgressBar / QuizQuestion answer ring colors
          teal: {
            DEFAULT: '#1FA4D8',
            50:  '#dbeeff',
            100: '#bfdbf7',
            200: '#93c5f5',
            500: '#1FA4D8',
            600: '#0A69B3',
            700: '#073d6b',
          },
          amber: {
            DEFAULT: '#F39207',
            50:  '#FEF3DC',
            100: '#fde68a',
            200: '#fbbf24',
            400: '#F39207',
            500: '#F39207',
            600: '#d97706',
          },
          navy: {
            DEFAULT: '#073d6b',
            50:  '#dbeeff',
            100: '#bfdbf7',
            200: '#93c5f5',
            600: '#0A69B3',
            700: '#073d6b',
            800: '#052d50',
          },
          offwhite: '#F7F7F7',
          slate: '#000000',
        },
      },
      fontFamily: {
        sans:  ['Ubuntu Sans', 'Ubuntu', 'system-ui', '-apple-system', 'sans-serif'],
        title: ['Montserrat', 'Ubuntu Sans', 'sans-serif'],
        score: ['Russo One', 'Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
