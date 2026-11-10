/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        /* "Confocal" palette: the design used by every page, the header and the footer. */
        cf: {
          bg: '#060A10',
          raised: '#0A1019',
          panel: '#0C131D',
          line: '#1C2735',
          'line-strong': '#243246',
          text: '#E6EDF5',
          'text-2': '#B8C4D3',
          muted: '#93A2B5',
          accent: '#4FD6E8',
          'accent-hover': '#86E6F2',
          ink: '#04131A',
          active: '#12202E',
          blue: '#6E8BFF',
          'cyan-2': '#5BB3F2',
          magenta: '#E25A9E',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        geist: ['Geist', 'Inter', 'system-ui', 'sans-serif'],
        'geist-mono': ['"Geist Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      borderRadius: {
        /* Pixel values (Tailwind's defaults are 1rem / 1.5rem). */
        '2xl': '16px',
        '3xl': '24px',
      },
    },
  },
  plugins: [],
};
