
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        // The Wall: Deep warm grey, almost brown/black.
        canvas: '#161514', 
        
        // Surface is transparent usually, but if needed, a darker shade of the wall
        surface: '#161514',      
        surfaceHighlight: '#1f1e1d', 
        
        // Faint grid lines projected on the wall
        border: 'rgba(255, 255, 255, 0.08)',       
        
        txt: {
          // Projector White: slightly off-white to look realistic, high brightness
          main: '#e4e4e7',       // Zinc 200
          muted: '#a1a1aa',      // Zinc 400
          dim: '#52525b',        // Zinc 600
        },

        accent: {
          // Laser Green: Sharper, more synthetic
          DEFAULT: '#00ff9d',    
          dim: 'rgba(0, 255, 157, 0.05)', 
          // Reduced glow opacity (0.4 -> 0.2)
          glow: 'rgba(0, 255, 157, 0.2)', 
          text: '#00ff9d',       
        },
      },
      boxShadow: {
          // Soft white glow for projector elements (Reduced intensity)
          'projector': '0 0 10px rgba(255, 255, 255, 0.05)',
          // Sharp green glow for laser elements - Reduced blur (10px -> 6px)
          'laser': '0 0 3px theme("colors.accent.DEFAULT"), 0 0 6px theme("colors.accent.glow")',
      },
      dropShadow: {
          // Bloom effects for text/icons (Significantly reduced for subtle readability)
          'projector': '0 0 4px rgba(228, 228, 231, 0.15)',
          // Toned down laser drop shadow
          'laser': '0 0 2px theme("colors.accent.DEFAULT")',
      },
      animation: {
          'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite', 
          'scan': 'scan 4s linear infinite',
          'shine-45': 'shine45 0.6s ease-in-out', 
      },
      keyframes: {
          scan: {
              '0%': { transform: 'translateY(-100%)' },
              '100%': { transform: 'translateY(100%)' }
          },
          shine45: {
              '0%': { transform: 'translateX(-150%) translateY(-150%) rotate(45deg)' },
              '100%': { transform: 'translateX(150%) translateY(150%) rotate(45deg)' }
          }
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
