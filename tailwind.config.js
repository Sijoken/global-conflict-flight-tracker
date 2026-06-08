/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        war: {
          bg: '#0a0e1a',
          panel: '#0f1629',
          border: '#1e2d4a',
          accent: '#1a3a5c',
          red: '#e53e3e',
          orange: '#dd6b20',
          yellow: '#d69e2e',
          green: '#38a169',
          blue: '#3182ce',
          purple: '#805ad5',
          cyan: '#00b5d8',
          muted: '#4a5568',
          text: '#e2e8f0',
          subtext: '#a0aec0',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Courier New', 'monospace'],
      },
    },
  },
  plugins: [],
}