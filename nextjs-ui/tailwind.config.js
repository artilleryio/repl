module.exports = {
  mode: 'jit',
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: {
        near: '#2B2B2B',
        DEFAULT: '#000000',
      },
      white: '#FFFFFF',
      beige: '#F8F8F8',
      gray: {
        light: '#E8E8E8',
        DEFAULT: '#9B9B9B',
        dark: '#4A4A4A' 
      },
      green: {
        DEFAULT: '#4AFF90',
        dark: '#24EB70'
      },
      blue: '#0047FF',
      red: '#FF0000',
      yellow: '#FFD600',
      orange: '#FF6D1B',
      purple: '#6100FF'
    },
    fontFamily: {
      display: ['Syne', 'sans-serif']
    },
    flex: {
      sidebar: '0 0 auto'
    },
    extend: {
      fontSize: {
        '11': '0.688rem',
        '13': '0.813rem'
      }
    }
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
