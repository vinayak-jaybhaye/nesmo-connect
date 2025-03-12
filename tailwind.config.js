/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'gradient-pulse': 'gradientPulse 3s ease infinite',
        'float': 'float 6s ease-in-out infinite',
        'twinkle': 'twinkle 1.5s infinite alternate',
        'orb-move-1': 'orbMove1 15s infinite linear',
        'orb-move-2': 'orbMove2 12s infinite linear',
      },
      keyframes: {
        gradientPulse: {
          '0%, 100%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        twinkle: {
          from: { opacity: '0.3' },
          to: { opacity: '1' },
        },
        orbMove1: {
          '0%': { transform: 'translate(0, 0) rotate(0deg)' },
          '50%': { transform: 'translate(50px, -50px) rotate(180deg)' },
          '100%': { transform: 'translate(0, 0) rotate(360deg)' },
        },
        orbMove2: {
          '0%': { transform: 'translate(0, 0) rotate(0deg)' },
          '50%': { transform: 'translate(-30px, 40px) rotate(-180deg)' },
          '100%': { transform: 'translate(0, 0) rotate(-360deg)' },
        }
      }
    }
  },
  plugins: [],
}

