
/** @type {import('tailwindcss').Config} */

// Helper to support opacity with CSS vars
function withOpacityValue(variable) {
  return ({ opacityValue }) => {
    if (opacityValue === undefined) {
      return `rgb(var(${variable}))`
    }
    return `rgb(var(${variable}) / ${opacityValue})`
  }
}

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
        canvas: withOpacityValue('--color-canvas'),
        surface: withOpacityValue('--color-surface'),
        overlay: withOpacityValue('--color-overlay'),
        
        // The Projector Light (White in dark, Ink in light)
        hud: withOpacityValue('--color-hud'),

        // FIXED: Use modern slash syntax for alpha with space-separated vars
        // UPDATED: Added 'dim' variant for internal content separators
        border: {
          DEFAULT: `rgb(var(--color-border) / var(--opacity-border))`,       
          dim: `rgb(var(--color-border) / var(--opacity-border-dim))`,
        },
        
        txt: {
          main: withOpacityValue('--color-txt-main'),
          muted: withOpacityValue('--color-txt-muted'),
          dim: withOpacityValue('--color-txt-dim'),
        },

        accent: {
          DEFAULT: withOpacityValue('--color-accent'),
          // FIXED: Modern syntax
          dim: 'rgb(var(--color-accent) / 0.05)', 
          glow: 'rgb(var(--color-accent) / 0.2)', 
          text: withOpacityValue('--color-accent'),       
        },
      },
      boxShadow: {
          // Layer 5: Projector Bloom
          'projector': '0 0 15px rgb(var(--color-hud) / 0.1)',
          
          // Layer 6: Laser Sharp Glow
          'laser': '0 0 5px rgb(var(--color-accent)), 0 0 10px rgb(var(--color-accent) / 0.4)',
          
          // Layer 2 & 3: Physical Panel Shadow (The Plate)
          'plate': '0 10px 30px -10px rgba(0, 0, 0, 0.5)',
          
          // Layer 3: Diode Ambient Glow
          'diode': '0 0 40px -5px rgb(var(--color-accent) / 0.15)',
      },
      dropShadow: {
          // Text Projection
          'projector': '0 0 8px rgb(var(--color-hud) / 0.3)',
          // Laser Text
          'laser': '0 0 4px rgb(var(--color-accent))',
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
