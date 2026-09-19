/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./app/javascript/**/*.{js,jsx,ts,tsx}",
    "./app/views/**/*.{erb,html}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        display: "var(--font-display)",
        body: "var(--font-body)",
        mono: "var(--font-mono)",
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        rail: "hsl(var(--rail))",
        "border-strong": "hsl(var(--border-strong))",
        hairline: "hsl(var(--hairline))",
        "foreground-2": "hsl(var(--foreground-2))",
        harm: {
          DEFAULT: "hsl(var(--harm))",
          soft: "hsl(var(--harm-soft))",
        },
        proficiency: {
          DEFAULT: "hsl(var(--proficiency))",
          soft: "hsl(var(--proficiency-soft))",
          ink: "hsl(var(--proficiency-ink))",
        },
        arcane: {
          DEFAULT: "hsl(var(--arcane))",
          soft: "hsl(var(--arcane-soft))",
          ink: "hsl(var(--arcane-ink))",
        },
        vitality: {
          DEFAULT: "hsl(var(--vitality))",
          soft: "hsl(var(--vitality-soft))",
          ink: "hsl(var(--vitality-ink))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
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
};
