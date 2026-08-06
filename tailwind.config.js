/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        'muted-foreground': 'hsl(var(--muted-foreground))',
        navy: {
          DEFAULT: '#0B1F3A',
          hover: '#12335C',
          gradientEnd: '#163D6B',
          footer: '#08172B',
        },
        steel: {
          DEFAULT: '#3B5B8A',
          hover: '#2c476f',
        },
        sky: {
          DEFAULT: '#DCEEFF',
          light: '#f0f7ff',
        },
        section: {
          white: '#FFFFFF',
          about: '#FFFFFF',
          services: '#F5F9FF',
          research: '#FFFFFF',
          tech: '#EEF4FA',
          whyus: '#FFFFFF',
          process: '#F8FBFF',
          articles: '#FFFFFF',
          testimonials: '#F7F9FC',
          faq: '#FFFFFF',
        },
        border: {
          light: '#E5E7EB',
        },
        text: {
          primary: '#0F172A',
          secondary: '#475569',
          muted: '#64748B',
          links: '#CBD5E1',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 4px 20px -2px rgba(11, 31, 58, 0.05)',
        hover: '0 20px 30px -10px rgba(11, 31, 58, 0.12)',
        card: '0 2px 10px rgba(0, 0, 0, 0.04)',
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
      },
    },
  },
  plugins: [],
};
