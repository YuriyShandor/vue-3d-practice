/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [],
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      container: {
        center: true
      },
      colors: {
        white: 'var(--white)',
        black: 'var(--black)',
        blue: 'var(--blue)',
        green: 'var(--green)',
        'dark-red': 'var(--dark-red)',
        orange: 'var(--orange)',
        'hover-color': 'var(--hover-color)',
        'primary-background': 'var(--primary-background)',
        'secondary-background': 'var(--secondary-background)',
        'primary-color': 'var(--primary-color)',
        'secondary-color': 'var(--secondary-color)',
        'label-color': 'var(--label-color)',
        'heading-color': 'var(--heading-color)',
        'btn-color': 'var(--btn-color)',
        'btn-hover-color': 'var(--btn-hover-color)',
        'box-shadow-color': 'var(--box-shadow-color)'
      },
      fontFamily: {
        // eslint-disable-next-line quotes
        sans: `'Montserrat', Arial, sans-serif`,
        verdana: 'Verdana, Arial, sans-serif'
      },
      zIndex: {
        1000: '1000'
      }
    }
  },
  plugins: []
}
