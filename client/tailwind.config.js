/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#080B10',
        secondary: '#111722',
        surface: '#161F2E',
        surfaceLight: '#1E293B',
        accent: {
          DEFAULT: '#FF6B00',
          hover: '#FF8533',
          dark: '#CC5500',
          glow: 'rgba(255, 107, 0, 0.35)',
        },
        primaryText: '#FFFFFF',
        secondaryText: '#A0AAB8',
        mutedText: '#64748B',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'Plus Jakarta Sans', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)',
      },
      boxShadow: {
        'luxury': '0 20px 50px rgba(0, 0, 0, 0.7), 0 0 30px rgba(255, 107, 0, 0.1)',
        'accent-glow': '0 0 25px rgba(255, 107, 0, 0.45)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.5)',
      },
    },
  },
  plugins: [],
}

