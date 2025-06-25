/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // YouTube-inspired dark mode colors
        youtube: {
          red: '#FF0000',
          'red-hover': '#CC0000',
          'red-light': '#FF4444',
        },
        dark: {
          bg: {
            primary: '#0F0F0F',
            secondary: '#181818',
            card: '#212121',
            hover: '#272727',
            elevated: '#282828',
          },
          border: '#303030',
          text: {
            primary: '#FFFFFF',
            secondary: '#AAAAAA',
            tertiary: '#717171',
          },
        },
        // Additional accent colors for charts and UI elements
        accent: {
          blue: '#3EA6FF',
          green: '#2BA640',
          purple: '#9147FF',
          orange: '#FF7626',
          yellow: '#FFD600',
        },
      },
      animation: {
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.2s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-youtube': 'linear-gradient(to right, #FF0000, #CC0000)',
      },
      boxShadow: {
        'youtube': '0 2px 8px rgba(0, 0, 0, 0.5)',
        'youtube-hover': '0 4px 12px rgba(0, 0, 0, 0.6)',
        'card': '0 1px 3px rgba(0, 0, 0, 0.5)',
      },
    },
  },
  plugins: [],
}