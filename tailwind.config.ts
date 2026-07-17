import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // ─── FreshMart Blue Design System ─────────────────────────────
        // Primary: Royal Blue — all interactive elements, CTAs, focus rings
        primary: {
          DEFAULT: "#2563EB",   // blue-600 — primary action color
          hover:   "#1D4ED8",   // blue-700 — hover state
          active:  "#1E40AF",   // blue-800 — pressed / active
          50:      "#EFF6FF",   // blue-50  — light tint backgrounds
          100:     "#DBEAFE",   // blue-100 — soft badge backgrounds
          200:     "#BFDBFE",   // blue-200 — borders on light bg
          300:     "#93C5FD",   // blue-300 — disabled text
          400:     "#60A5FA",   // blue-400 — secondary icon accents
          500:     "#3B82F6",   // blue-500 — mid-weight usage
          600:     "#2563EB",   // blue-600 — same as DEFAULT
          700:     "#1D4ED8",   // blue-700 — same as hover
          800:     "#1E40AF",   // blue-800 — deep
          900:     "#1E3A8A",   // blue-900 — darkest tint
        },
        // Secondary: Sky Blue — accents, badges, info states
        secondary: {
          DEFAULT: "#38BDF8",   // sky-400
          hover:   "#0EA5E9",   // sky-500
          50:      "#F0F9FF",   // sky-50
          100:     "#E0F2FE",   // sky-100
          600:     "#0284C7",   // sky-600
        },
        // Accent: Amber — sale badges, accent highlights
        accent: {
          DEFAULT: "#F59E0B",
          50:      "#FFFBEB",
          100:     "#FEF3C7",
        },
        dark: "#0F172A",         // Near-black for admin bg
        section: "#F8FAFC",      // Off-white page section bg
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        "2xl": "16px",
        "3xl": "24px",
      },
      boxShadow: {
        card:         "0 1px 3px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.06)",
        "card-hover": "0 4px 20px rgba(0,0,0,0.12), 0 8px 32px rgba(0,0,0,0.08)",
        product:      "0 2px 8px rgba(0,0,0,0.06)",
        "product-hover": "0 8px 30px rgba(0,0,0,0.12)",
        // Blue glow for primary CTAs
        "blue-glow":  "0 0 20px rgba(37,99,235,0.35)",
        "blue-sm":    "0 0 10px rgba(37,99,235,0.25)",
      },
      spacing: {
        "18":  "4.5rem",
        "88":  "22rem",
        "128": "32rem",
      },
      screens: {
        xs:   "390px",
        sm:   "640px",
        md:   "768px",
        lg:   "1024px",
        xl:   "1280px",
        "2xl":"1440px",
      },
      animation: {
        "fade-in":    "fadeIn 0.3s ease-out",
        "slide-up":   "slideUp 0.4s ease-out",
        float:        "float 3s ease-in-out infinite",
        "pulse-blue": "pulseBlue 2s ease-in-out infinite",
        "spin-slow":  "spin 1.5s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%":   { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%":      { transform: "translateY(-12px)" },
        },
        // Blue pulse replaces old green pulse
        pulseBlue: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(37,99,235,0.4)" },
          "50%":      { boxShadow: "0 0 0 12px rgba(37,99,235,0)" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
