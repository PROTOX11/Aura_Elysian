/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FEF7F0',
          100: '#FDF2E9',
          200: '#FCE7D3',
          300: '#F9D5B7',
          400: '#F4BF96',
          500: '#EFA972',
          600: '#E8945C',
          700: '#D97B47',
          800: '#B65D37',
          900: '#93482B',
        },
        lavender: {
          50: '#F7F6FF',
          100: '#F0EFFF',
          200: '#E6E6FA',
          300: '#D1CCEF',
          400: '#B8ADE0',
          500: '#9B8CD0',
          600: '#7F6BBF',
          700: '#6B5AAE',
          800: '#5A4A8F',
          900: '#4A3D74',
        },
        blush: {
          50: '#FEF7F7',
          100: '#FDEFEF',
          200: '#F8BBD9',
          300: '#F49BC4',
          400: '#F07BAE',
          500: '#EC5B99',
          600: '#E83B84',
          700: '#D91B6F',
          800: '#B81859',
          900: '#971543',
        },
        gold: {
          50: '#FFFDF5',
          100: '#FFFBEB',
          200: '#F4E4BC',
          300: '#EFDB9A',
          400: '#E9D278',
          500: '#E4C956',
          600: '#DFC034',
          700: '#C9A832',
          800: '#A58A2B',
          900: '#816C24',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'Times New Roman', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};