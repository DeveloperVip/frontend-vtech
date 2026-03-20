/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#eef3fd',
          100: '#d5e2fa',
          200: '#abc5f5',
          300: '#80a7f0',
          400: '#4f7de8',
          500: '#2d5fd4',
          600: '#1e4ec4',
          700: '#164DBC',   // ← màu chủ đạo
          800: '#1240a0',
          900: '#0d3283',
          950: '#081e52',
        },
        violet: {
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
        },
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #164DBC 0%, #3b5fd4 40%, #7c3aed 100%)',
        'brand-gradient-r': 'linear-gradient(to right, #164DBC, #7c3aed)',
      },
      boxShadow: {
        'glow-blue': '0 4px 24px rgba(22, 77, 188, 0.35)',
        'glow-violet': '0 4px 24px rgba(124, 58, 237, 0.25)',
        'card': '0 2px 16px rgba(0,0,0,0.08)',
        'card-hover': '0 8px 32px rgba(0,0,0,0.14)',
      },
      borderRadius: {
        'pill': '9999px',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      },
      animation: {
        wiggle: 'wiggle 0.3s ease-in-out infinite',
        'fade-in-up': 'fade-in-up 0.8s ease-out forwards',
      },
      typography: {
        DEFAULT: {
          css: {
            // Cho phép inline style text-align từ CKEditor không bị override
            'td, th': {
              textAlign: 'unset',
            },
            // Không ép figure về margin 0
            figure: {
              marginTop: '1.5rem',
              marginBottom: '1.5rem',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};

