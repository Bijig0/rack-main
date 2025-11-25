/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: ['./src/**/*.{ts,tsx}'],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: { '2xl': '1400px' },
    },
    extend: {
      backgroundColor: {
        overlay: 'rgba(0, 0, 0, 0.66)',
      },
      fontSize: {
        header: ['3.75rem', '4rem'],
        md: ['1rem', '1.5rem'],
        'business-header': ['3rem', '3.5rem'],
      },

      fontFamily: {
        futura: ['Futura', 'sans-serif'],
        roobert: ['Roobert', 'sans-serif'],
        business: ['Roobert', 'sans-serif'],
      },
      colors: {
        'green-light': '#cceeec',
        'blue-light': '#b3d6f1',
        facebook: '#3c5997',
        dark: '#1a202c',
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },

        rajah: {
          50: '#FEF8F0',
          100: '#FDEEDD',
          200: '#FCDCBB',
          300: '#FACB99',
          400: '#F9BA77',
          500: '#F7A855',
          600: '#F48815',
          700: '#BE6609',
          800: '#7F4406',
          900: '#3F2203',
          950: '#221202',
        },
        lavenderindigo: {
          50: '#F8F0FE',
          100: '#EEDDFD',
          200: '#DCBBFC',
          300: '#CB99FA',
          400: '#BA77F9',
          500: '#A855F7',
          600: '#8815F4',
          700: '#6609BE',
          800: '#44067F',
          900: '#22033F',
          950: '#120222',
        },
        aquamarine: {
          50: '#F0FEF8',
          100: '#DDFDEE',
          200: '#BBFCDC',
          300: '#99FACB',
          400: '#77F9BA',
          500: '#55F7A8',
          600: '#15F488',
          700: '#09BE66',
          800: '#067F44',
          900: '#033F22',
          950: '#022212',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate'), require('@tailwindcss/typography')],
}
