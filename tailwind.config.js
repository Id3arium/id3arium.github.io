/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',   
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
    './out/**/*.{js,ts,jsx,tsx,mdx}',
    './public/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'white': '#ffffff',
        'black': '#000000',
        'blue': '#1fb6ff',
        'purple': '#7e5bef',
        'pink': '#ff49db',
        'orange': '#ff7849',
        'green': '#13ce66',
        'yellow': '#ffc82c',
        'grey-dark': '#273444',
        'grey': '#8492a6',
        'gray': '#8492a6',
        'grey-light': '#d3dce6',
        'grey-dark': '#CCCCCC',
        'clear': '#00000000',
        'transparent': '#00000000',
      },
      fontFamily: {
        sans: ['Graphik', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
      },
      left: {
        '1/5': '20%',
      },
      spacing: {
        '8xl': '96rem',
        '9xl': '128rem',
      },
      blur: { 
        'none': '0px',
        'sm': '5px',
        'md': '10x',
        'lg': '15px',
        'xlg': '20px',
      },
      backdropBlur: {
        'none': '0px',
        'sm': '5px',
        'md': '10x',
        'lg': '15px',
        'xlg': '20px',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      fontSize: {
        'sm-md': ['0.9375rem', '1.375rem'], // 15px with a line height of 22px
        'md-lg': ['1.0625rem', '1.625rem'],  // 17px with a line height of 26px
     },
    }
  },
}

