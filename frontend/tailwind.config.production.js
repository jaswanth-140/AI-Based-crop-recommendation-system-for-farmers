/** 
 * Tailwind CSS Configuration
 * EPICS - AI Crop Recommendation System
 * 
 * Production-ready configuration with design tokens
 * Version: 2.0
 */

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  
  darkMode: 'class', // Enable dark mode support
  
  theme: {
    // Breakpoints
    screens: {
      'xs': '475px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },

    // Design Tokens
    extend: {
      // ===== COLOR SYSTEM =====
      colors: {
        // Primary (Teal)
        primary: {
          50: '#F0FDFA',
          100: '#CCFBF1',
          200: '#99F6E4',
          300: '#5EEAD4',
          400: '#2DD4BF',
          500: '#14B8A6',
          600: '#0D9488',
          700: '#0F766E',  // Main brand color
          800: '#115E59',
          900: '#134E4A',
        },
        
        // Accent (Indigo - CTAs)
        accent: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',  // Main CTA color
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A',
        },

        // Agricultural themed colors
        soil: {
          light: '#D97706',
          DEFAULT: '#92400E',
          dark: '#78350F',
        },
        harvest: {
          light: '#FBBF24',
          DEFAULT: '#F59E0B',
          dark: '#D97706',
        },
        leaf: {
          light: '#10B981',
          DEFAULT: '#059669',
          dark: '#047857',
        },
        sky: {
          light: '#38BDF8',
          DEFAULT: '#0EA5E9',
          dark: '#0284C7',
        },
        rain: {
          light: '#22D3EE',
          DEFAULT: '#06B6D4',
          dark: '#0891B2',
        },
      },

      // ===== TYPOGRAPHY =====
      fontFamily: {
        // Latin scripts
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        
        // Indian scripts
        devanagari: ['Noto Sans Devanagari', 'Noto Sans', 'sans-serif'],
        tamil: ['Noto Sans Tamil', 'Noto Sans', 'sans-serif'],
        telugu: ['Noto Sans Telugu', 'Noto Sans', 'sans-serif'],
        kannada: ['Noto Sans Kannada', 'Noto Sans', 'sans-serif'],
        gujarati: ['Noto Sans Gujarati', 'Noto Sans', 'sans-serif'],
        bengali: ['Noto Sans Bengali', 'Noto Sans', 'sans-serif'],
        malayalam: ['Noto Sans Malayalam', 'Noto Sans', 'sans-serif'],
        gurmukhi: ['Noto Sans Gurmukhi', 'Noto Sans', 'sans-serif'],
      },

      fontSize: {
        // Display
        'display': ['3rem', { lineHeight: '1.1', fontWeight: '700', letterSpacing: '-0.02em' }],      // 48px
        
        // Headings
        'h1': ['2.25rem', { lineHeight: '1.2', fontWeight: '700', letterSpacing: '-0.01em' }],       // 36px
        'h2': ['1.875rem', { lineHeight: '1.3', fontWeight: '600' }],                                 // 30px
        'h3': ['1.5rem', { lineHeight: '1.3', fontWeight: '600' }],                                   // 24px
        'h4': ['1.25rem', { lineHeight: '1.4', fontWeight: '600' }],                                  // 20px
        'h5': ['1.125rem', { lineHeight: '1.4', fontWeight: '600' }],                                 // 18px
        
        // Body
        'body-lg': ['1.125rem', { lineHeight: '1.6', fontWeight: '400' }],                            // 18px
        'body': ['1rem', { lineHeight: '1.5', fontWeight: '400' }],                                   // 16px
        'body-sm': ['0.875rem', { lineHeight: '1.5', fontWeight: '400' }],                            // 14px
        
        // Utility
        'caption': ['0.75rem', { lineHeight: '1.4', fontWeight: '500' }],                             // 12px
        'tiny': ['0.625rem', { lineHeight: '1.4', fontWeight: '500' }],                               // 10px
        
        // Interactive
        'button': ['0.9375rem', { lineHeight: '1', fontWeight: '600' }],                              // 15px
        'button-lg': ['1rem', { lineHeight: '1', fontWeight: '600' }],                                // 16px
      },

      // ===== SPACING =====
      spacing: {
        '4.5': '1.125rem',    // 18px
        '13': '3.25rem',      // 52px
        '15': '3.75rem',      // 60px
        '18': '4.5rem',       // 72px
        '22': '5.5rem',       // 88px
        '26': '6.5rem',       // 104px
        '30': '7.5rem',       // 120px
      },

      // ===== BORDER RADIUS =====
      borderRadius: {
        'sm': '6px',
        'DEFAULT': '8px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '20px',
        '3xl': '24px',
      },

      // ===== SHADOWS =====
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'DEFAULT': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        
        // Colored shadows
        'primary': '0 10px 15px -3px rgba(15, 118, 110, 0.3), 0 4px 6px -2px rgba(15, 118, 110, 0.05)',
        'accent': '0 10px 15px -3px rgba(37, 99, 235, 0.3), 0 4px 6px -2px rgba(37, 99, 235, 0.05)',
        'success': '0 10px 15px -3px rgba(34, 197, 94, 0.3), 0 4px 6px -2px rgba(34, 197, 94, 0.05)',
        'warning': '0 10px 15px -3px rgba(245, 158, 11, 0.3), 0 4px 6px -2px rgba(245, 158, 11, 0.05)',
        'error': '0 10px 15px -3px rgba(220, 38, 38, 0.3), 0 4px 6px -2px rgba(220, 38, 38, 0.05)',
        
        // Inner shadows
        'inner': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
        'inner-lg': 'inset 0 4px 8px 0 rgba(0, 0, 0, 0.1)',
      },

      // ===== ANIMATIONS =====
      transitionDuration: {
        '0': '0ms',
        '75': '75ms',
        '150': '150ms',
        '300': '300ms',
        '500': '500ms',
        '700': '700ms',
        '1000': '1000ms',
      },

      transitionTimingFunction: {
        'default': 'cubic-bezier(0.22, 0.9, 0.41, 1)',
        'bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'spring': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      },

      animation: {
        'fade-in': 'fadeIn 300ms ease-in-out',
        'slide-up': 'slideUp 300ms ease-out',
        'slide-down': 'slideDown 300ms ease-out',
        'slide-in-right': 'slideInRight 300ms ease-out',
        'scale-in': 'scaleIn 200ms ease-out',
        'spin-slow': 'spin 3s linear infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'bounce-slow': 'bounce 2s infinite',
      },

      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },

      // ===== Z-INDEX =====
      zIndex: {
        '1': '1',
        '5': '5',
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },

      // ===== BACKDROP BLUR =====
      backdropBlur: {
        'xs': '2px',
      },

      // ===== MAX WIDTH =====
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },

      // ===== MIN HEIGHT =====
      minHeight: {
        '12': '3rem',
        '14': '3.5rem',
        '16': '4rem',
        '20': '5rem',
      },

      // ===== ASPECT RATIO =====
      aspectRatio: {
        '4/3': '4 / 3',
        '3/2': '3 / 2',
        '2/3': '2 / 3',
      },
    },
  },

  // ===== PLUGINS =====
  plugins: [
    require('@tailwindcss/forms')({
      strategy: 'class', // Use form-input, form-select classes
    }),
    
    // Custom plugin for utilities
    function({ addUtilities, addComponents, theme }) {
      // Touch-friendly utilities
      const touchUtilities = {
        '.touch-target': {
          minHeight: '44px',
          minWidth: '44px',
        },
        '.touch-target-lg': {
          minHeight: '52px',
          minWidth: '52px',
        },
      };

      // Glass morphism utilities
      const glassUtilities = {
        '.glass': {
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(10px)',
          borderWidth: '1px',
          borderColor: 'rgba(255, 255, 255, 0.18)',
        },
        '.glass-dark': {
          backgroundColor: 'rgba(15, 23, 42, 0.7)',
          backdropFilter: 'blur(10px)',
          borderWidth: '1px',
          borderColor: 'rgba(255, 255, 255, 0.1)',
        },
      };

      // Card components
      const cardComponents = {
        '.card': {
          backgroundColor: theme('colors.white'),
          borderRadius: theme('borderRadius.lg'),
          padding: theme('spacing.6'),
          boxShadow: theme('boxShadow.md'),
        },
        '.card-flat': {
          backgroundColor: theme('colors.white'),
          borderRadius: theme('borderRadius.lg'),
          padding: theme('spacing.6'),
          borderWidth: '1px',
          borderColor: theme('colors.neutral.200'),
        },
        '.card-elevated': {
          backgroundColor: theme('colors.white'),
          borderRadius: theme('borderRadius.lg'),
          padding: theme('spacing.6'),
          boxShadow: theme('boxShadow.lg'),
        },
      };

      // Button components
      const buttonComponents = {
        '.btn': {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: `${theme('spacing.3')} ${theme('spacing.6')}`,
          fontSize: theme('fontSize.button[0]'),
          fontWeight: theme('fontSize.button[1].fontWeight'),
          borderRadius: theme('borderRadius.md'),
          transition: 'all 150ms ease',
          cursor: 'pointer',
          '&:disabled': {
            opacity: '0.6',
            cursor: 'not-allowed',
          },
        },
        '.btn-primary': {
          backgroundColor: theme('colors.accent.600'),
          color: theme('colors.white'),
          '&:hover:not(:disabled)': {
            backgroundColor: theme('colors.accent.700'),
            boxShadow: theme('boxShadow.lg'),
          },
          '&:focus-visible': {
            boxShadow: `0 0 0 3px ${theme('colors.accent.600')}40`,
          },
        },
        '.btn-secondary': {
          backgroundColor: theme('colors.neutral.100'),
          color: theme('colors.neutral.700'),
          borderWidth: '1px',
          borderColor: theme('colors.neutral.300'),
          '&:hover:not(:disabled)': {
            backgroundColor: theme('colors.neutral.200'),
          },
        },
        '.btn-outline': {
          backgroundColor: 'transparent',
          color: theme('colors.primary.700'),
          borderWidth: '2px',
          borderColor: theme('colors.primary.700'),
          '&:hover:not(:disabled)': {
            backgroundColor: theme('colors.primary.50'),
          },
        },
      };

      addUtilities(touchUtilities);
      addUtilities(glassUtilities);
      addComponents(cardComponents);
      addComponents(buttonComponents);
    },
  ],

  // ===== SAFELIST =====
  // Prevent purging of dynamically generated classes
  safelist: [
    'bg-primary-50',
    'bg-primary-100',
    'bg-accent-50',
    'bg-success-50',
    'bg-warning-50',
    'bg-error-50',
    'text-primary-700',
    'text-accent-600',
    'text-success-600',
    'text-warning-600',
    'text-error-600',
    'border-primary-600',
    'border-accent-600',
    'shadow-primary',
    'shadow-accent',
  ],
};
