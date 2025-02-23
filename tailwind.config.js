/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#0D0D14',
          secondary: '#141421',
        },
        accent: {
          purple: {
            light: '#9F7AEA',
            DEFAULT: '#7A6FE3',
            dark: '#553C9A',
          },
          teal: {
            light: '#2ED6A7',
            DEFAULT: '#25B592',
            dark: '#1C8870',
          },
          gold: {
            light: '#F7B731',
            DEFAULT: '#F5A623',
            dark: '#D48806',
          },
          metallic: {
            light: '#C5C5D3',
            DEFAULT: '#A1A1B5',
            dark: '#71718A',
          },
        },
      },
      animation: {
        'gradient-x': 'gradient-x 15s ease infinite',
        'gradient-y': 'gradient-y 15s ease infinite',
        'gradient-xy': 'gradient-xy 15s ease infinite',
        borderFlow: 'borderFlow 3s linear infinite',
        float: 'float 6s ease-in-out infinite',
        'pulse-soft': 'pulse-soft 4s ease-in-out infinite',
        glow: 'glow 2s ease-in-out infinite',
        'rocket-float': 'rocket-float 3s ease-in-out infinite',
        'slide-up': 'slide-up 0.3s ease-out',
        'slide-down': 'slide-down 0.3s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
        'fade-out': 'fade-out 0.3s ease-out',
        gradient: 'gradient 8s linear infinite',
      },
      keyframes: {
        'gradient-y': {
          '0%, 100%': {
            'background-size': '400% 400%',
            'background-position': 'center top',
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'center center',
          },
        },
        'gradient-x': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center',
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center',
          },
        },
        'gradient-xy': {
          '0%, 100%': {
            'background-size': '400% 400%',
            'background-position': 'left center',
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center',
          },
        },
        borderFlow: {
          '0%': {
            transform: 'translateX(-100%)',
          },
          '100%': {
            transform: 'translateX(100%)',
          },
        },
        float: {
          '0%, 100%': {
            transform: 'translateY(0)',
          },
          '50%': {
            transform: 'translateY(-10px)',
          },
        },
        'rocket-float': {
          '0%, 100%': {
            transform: 'translateY(0) rotate(-45deg)',
            filter: 'drop-shadow(0 0 8px rgba(159, 122, 234, 0.3))',
          },
          '50%': {
            transform: 'translateY(-6px) rotate(-45deg)',
            filter: 'drop-shadow(0 0 12px rgba(159, 122, 234, 0.5))',
          },
        },
        'pulse-soft': {
          '0%, 100%': {
            opacity: 1,
          },
          '50%': {
            opacity: 0.8,
          },
        },
        glow: {
          '0%, 100%': {
            opacity: 1,
            transform: 'scale(1)',
          },
          '50%': {
            opacity: 0.8,
            transform: 'scale(1.02)',
          },
        },
        'slide-up': {
          '0%': {
            transform: 'translateY(10px)',
            opacity: 0,
          },
          '100%': {
            transform: 'translateY(0)',
            opacity: 1,
          },
        },
        'slide-down': {
          '0%': {
            transform: 'translateY(-10px)',
            opacity: 0,
          },
          '100%': {
            transform: 'translateY(0)',
            opacity: 1,
          },
        },
        'fade-in': {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        'fade-out': {
          '0%': { opacity: 1 },
          '100%': { opacity: 0 },
        },
        gradient: {
          '0%': {
            'background-position': '0% 50%',
          },
          '50%': {
            'background-position': '100% 50%',
          },
          '100%': {
            'background-position': '0% 50%',
          },
        },
      },
      maxWidth: {
        content: '1200px',
      },
      spacing: {
        18: '4.5rem',
        22: '5.5rem',
      },
      fontSize: {
        xxs: '0.625rem',
      },
      boxShadow: {
        glow: '0 0 20px -5px rgba(122, 111, 227, 0.15)',
        'glow-lg': '0 0 30px -5px rgba(122, 111, 227, 0.2)',
        'glow-teal': '0 0 20px -5px rgba(46, 214, 167, 0.15)',
        'glow-gold': '0 0 20px -5px rgba(247, 183, 49, 0.15)',
        'inner-glow': 'inset 0 0 20px -5px rgba(122, 111, 227, 0.1)',
        float: '0 10px 20px -5px rgba(0, 0, 0, 0.2)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(var(--tw-gradient-stops))',
        'gradient-mesh':
          "url(\"data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M15 0C6.716 0 0 6.716 0 15c0 8.284 6.716 15 15 15 8.284 0 15-6.716 15-15 0-8.284-6.716-15-15-15zm0 27C8.373 27 3 21.627 3 15S8.373 3 15 3s12 5.373 12 12-5.373 12-12 12z' fill='%239C92AC' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E\")",
      },
      transitionTimingFunction: {
        'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
    },
  },
  plugins: [],
};
