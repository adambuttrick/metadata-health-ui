import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '2rem',
        sm: '4rem',
        md: '6rem',
        lg: '8rem',
        xl: '10rem',
        '2xl': '12rem'
      },
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        barlow: ['Barlow', 'sans-serif'],
      },
      colors: {
        'datacite': {
          'light-blue': '#00B1E2',
          'dark-blue': '#243B54',
          'grey': '#C0CED6',
          'turquoise': '#46BCAB',
          'light-red': '#F07C73',
          'medium-blue': '#0D60D4',
          'dark-pink': '#BC2B66',
          'lime': '#E2E254',
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#00B1E2",         // DataCite Light Blue
          foreground: "#243B54",      // DataCite Dark Blue
        },
        secondary: {
          DEFAULT: "#C0CED6",         // DataCite Grey
          foreground: "#243B54",      // DataCite Dark Blue
        },
        destructive: {
          DEFAULT: "#F07C73",         // DataCite Light Red
          foreground: "#243B54",      // DataCite Dark Blue
        },
        muted: {
          DEFAULT: "#C0CED6",         // DataCite Grey
          foreground: "#243B54",      // DataCite Dark Blue
        },
        accent: {
          DEFAULT: "#46BCAB",         // DataCite Turquoise
          foreground: "#243B54",      // DataCite Dark Blue
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "#243B54",      // DataCite Dark Blue
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "#243B54",      // DataCite Dark Blue
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
export default config