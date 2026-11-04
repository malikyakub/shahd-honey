/** @type {import('tailwindcss').Config} */
const c = (name) => `rgb(var(--rgb-${name}) / <alpha-value>)`

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        dark: c('dark'),
        amber: {
          DEFAULT: c('amber'),
          // ONLY for small amber-coloured text on cream. Never use `text-amber` on cream.
          deep: c('amber-deep'),
        },
        cream: c('cream'),
        'pale-amber': c('pale-amber'),
      },
      fontFamily: {
        heading: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        body: ['Montserrat', 'system-ui', 'sans-serif'],
      },
      // Consistent spacing scale (4px base), named for layout rhythm.
      spacing: {
        'space-1': 'var(--space-1)',
        'space-2': 'var(--space-2)',
        'space-3': 'var(--space-3)',
        'space-4': 'var(--space-4)',
        'space-5': 'var(--space-5)',
        'space-6': 'var(--space-6)',
        'space-7': 'var(--space-7)',
        'space-8': 'var(--space-8)',
        'space-9': 'var(--space-9)',
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        DEFAULT: 'var(--radius)',
        lg: 'var(--radius-lg)',
      },
      boxShadow: {
        soft: 'var(--shadow-soft)',
        lift: 'var(--shadow-lift)',
      },
      letterSpacing: {
        brand: '0.32em',
      },
      maxWidth: {
        site: '72rem',
      },
    },
  },
  plugins: [],
}
