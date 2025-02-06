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
      colors: {
        // Style 1 - Color Palette
        'primary': 'hsl(var(--primary))',
        'primary-foreground': 'hsl(var(--primary-foreground))',
        'secondary': 'hsl(var(--secondary))',
        'secondary-foreground': 'hsl(var(--secondary-foreground))',
        'background': 'hsl(var(--background))',
        'foreground': 'hsl(var(--foreground))',
        'muted': 'hsl(var(--muted))',
        'muted-foreground': 'hsl(var(--muted-foreground))',
        'accent': 'hsl(var(--accent))',
        'accent-foreground': 'hsl(var(--accent-foreground))',
        'border': 'hsl(var(--border))',
        'ring': 'hsl(var(--ring))',
      },
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
      },
      borderRadius: {
        'lg': 'var(--radius)',
        'md': 'calc(var(--radius) - 2px)',
        'sm': 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [],
} satisfies Config;