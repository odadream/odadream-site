
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        canvas: '#050505',
        surface: '#0a0a0a',
        surfaceHighlight: '#171717',
        border: '#27272a',
        
        txt: {
          main: '#e4e4e7',
          muted: '#a1a1aa',
          dim: '#52525b',
        },

        accent: {
          DEFAULT: '#10b981',
          dim: 'rgba(16, 185, 129, 0.05)',
          glow: 'rgba(16, 185, 129, 0.2)',
          text: '#34d399',
        },
      },
      boxShadow: {
          'neon-soft': '0 0 30px -5px theme("colors.accent.glow")',
          'neon-text': '0 0 8px rgba(16, 185, 129, 0.3)',
      },
      dropShadow: {
          'neon': '0 0 2px theme("colors.accent.DEFAULT")',
      },
      animation: {
          'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          'scan': 'scan 4s linear infinite',
          'shine-45': 'shine45 1s ease-in-out forwards',
      },
      keyframes: {
          scan: {
              '0%': { transform: 'translateY(-100%)' },
              '100%': { transform: 'translateY(100%)' }
          },
          shine45: {
              '0%': { transform: 'translateX(-100%) translateY(-100%)' },
              '100%': { transform: 'translateX(100%) translateY(100%)' }
          }
      }
    },
  },
  plugins: [],
}
