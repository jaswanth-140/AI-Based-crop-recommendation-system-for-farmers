/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        poppins: ["Poppins", "ui-sans-serif", "system-ui", "sans-serif"],
        noto: ["Noto Sans", "Noto Sans Devanagari", "Noto Sans Telugu", "ui-sans-serif", "sans-serif"]
      },
      fontSize: {
        'hero': ['36px', { lineHeight: '1.2', fontWeight: '700' }],
        'header': ['24px', { lineHeight: '1.3', fontWeight: '600' }],
        'body': ['16px', { lineHeight: '1.5', fontWeight: '400' }],
        'caption': ['12px', { lineHeight: '1.4', fontWeight: '400' }]
      },
      colors: {
        fertile: {
          start: "#10b981",
          end: "#059669",
          DEFAULT: "#10b981"
        },
        sky: {
          start: "#0ea5e9",
          end: "#0284c7",
          DEFAULT: "#0ea5e9"
        },
        soil: {
          start: "#a16207",
          end: "#854d0e",
          DEFAULT: "#a16207"
        },
        sunset: {
          start: "#f97316",
          end: "#ea580c",
          DEFAULT: "#f97316"
        },
        harvest: {
          start: "#fbbf24",
          end: "#f59e0b",
          DEFAULT: "#fbbf24"
        },
        rain: "#06b6d4",
        leaf: "#22c55e",
        warning: "#fb923c",
        danger: "#ef4444"
      },
      boxShadow: {
        'glow-md': '0 0 20px rgba(16, 185, 129, 0.4)',
        'glow-lg': '0 0 30px rgba(16, 185, 129, 0.5)',
        'colored': '0 10px 40px -10px rgba(6, 182, 212, 0.3)',
        'colored-lg': '0 20px 60px -15px rgba(6, 182, 212, 0.4)',
        'card-hover': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 0 60px -15px rgb(14 165 233 / 0.3)',
        'card': '0 4px 6px -1px rgb(0 0 0 / 0.05), 0 0 0 1px rgb(14 165 233 / 0.05)'
      },
      keyframes: {
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' }
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '33%': { transform: 'translateY(-8px) rotate(2deg)' },
          '66%': { transform: 'translateY(-4px) rotate(-2deg)' }
        },
        'spring-in': {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '50%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        },
        'count-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        'progress-fill': {
          '0%': { width: '0%' },
          '100%': { width: 'var(--progress-width)' }
        }
      },
      animation: {
        'spin-slow': 'spin 8s linear infinite',
        'shimmer': 'shimmer 2s infinite',
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float-slow 8s ease-in-out infinite',
        'gradientShift': 'gradientShift 15s ease infinite',
        'spring-in': 'spring-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'count-up': 'count-up 0.6s ease-out',
        'progress-fill': 'progress-fill 1.5s cubic-bezier(0.4, 0, 0.2, 1)'
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)'
      }
    }
  },
  plugins: [require("@tailwindcss/forms")]
};

