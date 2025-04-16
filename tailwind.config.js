/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        green: {
          50: '#f0f9f0',
          100: '#dcf1dc',
          200: '#b9e3b9',
          300: '#8fd08f',
          400: '#62ba62',
          500: '#45a049',
          600: '#2c5c2c',
          700: '#294d29',
          800: '#1f3e1f',
          900: '#193619',
        },
      },
      fontFamily: {
        sans: ['var(--font-rubik)', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}; 