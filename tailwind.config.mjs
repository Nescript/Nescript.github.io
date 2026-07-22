import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: {
          light: '#fafafa',
          dark: '#0c0d0e',
        },
        surface: {
          light: '#ffffff',
          dark: '#141619',
        },
        border: {
          light: '#e4e4e7',
          dark: '#27272a',
        },
        accent: {
          light: '#18181b',
          dark: '#f4f4f5',
          brand: '#3b82f6',
        },
        muted: {
          light: '#71717a',
          dark: '#a1a1aa',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Newsreader', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'Menlo', 'monospace'],
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            maxWidth: '68ch',
            color: 'inherit',
            a: {
              color: 'inherit',
              textDecoration: 'underline',
              textUnderlineOffset: '4px',
              textDecorationColor: theme('colors.muted.light'),
              '&:hover': {
                textDecorationColor: 'currentColor',
              },
            },
            h1: { color: 'inherit', fontWeight: '700', letterSpacing: '-0.025em' },
            h2: { color: 'inherit', fontWeight: '600', letterSpacing: '-0.02em' },
            h3: { color: 'inherit', fontWeight: '600' },
            code: {
              color: 'inherit',
              backgroundColor: 'rgba(125, 125, 125, 0.1)',
              padding: '0.2rem 0.4rem',
              borderRadius: '0.25rem',
              fontWeight: '400',
            },
            'code::before': { content: '""' },
            'code::after': { content: '""' },
            hr: {
              borderColor: 'var(--border-color)',
            },
          },
        },
      }),
    },
  },
  plugins: [typography],
};
