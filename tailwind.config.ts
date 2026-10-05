import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // ── TechnoFind Design Tokens ──────────────────
        bg:      '#F5F3EF',
        surface: '#FFFFFF',
        ink: {
          DEFAULT: '#0D0D0D',
          muted:   '#6B6860',
          faint:   '#B8B5AF',
        },
        accent: {
          DEFAULT: '#D4541A',
          soft:    '#FBF0EB',
        },
        border:  '#E8E5E0',
        tag:     '#EDEAE5',
        // ── Semantic colors ───────────────────────────
        gold:    { DEFAULT: '#F5A623', soft: '#FEF9EC' },
        emerald: { DEFAULT: '#16A34A', soft: '#F0FDF4' },
        cobalt:  { DEFAULT: '#2563EB', soft: '#EFF6FF' },
        violet:  { DEFAULT: '#7C3AED', soft: '#F5F3FF' },
        crimson: { DEFAULT: '#EF4444', soft: '#FEF2F2' },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        sans:    ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '1rem' }],
      },
      borderRadius: {
        DEFAULT: '4px',
        sm:  '8px',
        md:  '12px',
        lg:  '16px',
        xl:  '20px',
        '2xl': '24px',
        full: '9999px',
      },
      boxShadow: {
        card:   '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        'card-md': '0 4px 16px rgba(0,0,0,0.08)',
        'card-lg': '0 8px 32px rgba(0,0,0,0.10)',
        accent: '0 4px 18px rgba(212,84,26,0.30)',
      },
      animation: {
        'drift':     'drift 7s ease-in-out infinite',
        'drift-alt': 'drift 7s ease-in-out 3.5s infinite',
        'fade-up':   'fadeUp 0.4s ease both',
        'pop':       'pop 0.6s cubic-bezier(0.34,1.56,0.64,1) both',
        'skeleton':  'skeleton 1.5s ease-in-out infinite',
        'pulse-dot': 'pulseDot 2s ease-in-out infinite',
      },
      keyframes: {
        drift: {
          '0%,100%': { transform: 'translate(0,0) scale(1)' },
          '50%':     { transform: 'translate(10px,-12px) scale(1.1)' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        pop: {
          from: { transform: 'scale(0.4)', opacity: '0' },
          to:   { transform: 'scale(1)',   opacity: '1' },
        },
        skeleton: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition:  '200% 0' },
        },
        pulseDot: {
          '0%,100%': { opacity: '1', transform: 'scale(1)' },
          '50%':     { opacity: '0.5', transform: 'scale(0.8)' },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};

export default config;
