import { type Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      keyframes: {
        "float-up": {
          '0%': { transform: 'translate(-50%, -50%)' },
          '100%': { transform: 'translate(-50%, -80%)' }
        },
        "float-down": {
          '0%': { transform: 'translate(-50%, -80%)' },
          '100%': { transform: 'translate(-50%, -50%)' }
        },
        "sway": {
          '0%, 100%': { transform: 'translate(-50%, -50%) rotate(-5deg)' },
          '50%': { transform: 'translate(-50%, -50%) rotate(5deg)' }
        }
      },
      animation: {
        "float-up": "float-up 2s ease-in-out forwards",
        "float-down": "float-down 2s ease-in-out forwards",
        "sway": "sway 2s ease-in-out infinite"
      }
    },
  },
  plugins: [],
} satisfies Config;