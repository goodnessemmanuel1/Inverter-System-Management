/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        volt: {
          50: '#eef9ff',
          100: '#d9f1ff',
          200: '#bbe6ff',
          300: '#8cd7ff',
          400: '#55beff',
          500: '#2ea0ff',
          600: '#1280f5',
          700: '#0b68e1',
          800: '#1054b6',
          900: '#13498f',
          950: '#0d2d5c',
        },
        navy: {
          900: '#040d1e',
          800: '#071428',
          700: '#0a1d3a',
          600: '#0e2650',
          500: '#122f66',
        }
      },
      fontFamily: {
        display: ['Orbitron', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'slide-in': 'slideIn 0.3s ease-out',
        'fade-in': 'fadeIn 0.4s ease-out',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(46, 160, 255, 0.3)' },
          '100%': { boxShadow: '0 0 20px rgba(46, 160, 255, 0.8)' },
        },
        slideIn: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(-8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
