module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  important: true,
  theme: {
    container: { center: true },
    extend: {
      colors: {
        primary: 'var(--primary-color)',
        'primary-hover': 'var(--primary-color-hover)',
        secondary: 'var(--secondary-color)',
        'grey-primary': '#F7F8F9',
        'grey-primary-200': '#f0f2f4',
        'grey-primary-300': '#7A7A9D',
        'grey-primary-500': '#646a7a',
        'grey-secondary': '#f1f2f3',
        'grey-secondary-100': '#c5c7cd',
        'grey-secondary-200': '#aaafbb',
        'grey-secondary-300': '#777e91',
        'grey-secondary-400': '#3e3a55',
        'grey-secondary-500': '#0e092a',
        'grey-light': '#f5f2fd',
        'grey-light-100': '#fcf8fa',
        'grey-light-200': '#f9f0f4',
        'grey-light-300': '#f7e9ef',
        'grey-light-400': '#e8eaee',
        'grey-light-500': '#f1dae4',
        'grey-light-900': '#250e18',
        'grey-dark': '#dfe1e7',
        'grey-heavy': '#45445f',
        red: {
          100: '#FCD9DF',
        },
        blue: {
          600: '#2D5DD9',
        },
        orange: {
          100: '#FFE7D7', //GEST
          500: '#F67800',
        },
        sky: {
          100: '#DDF8FB', // REC
          200: '#E3F0F9',
        },
        slate: {
          200: '#E9E5F5',
        },
        lime: {
          600: '#52C41A',
        },
        rose: {
          100: '#FCE9E9', //QR
        },
        fuchsia: {
          100: '#FFE9FD', //SELECT
        },
        emerald: {
          50: '#EBFBEB', //PAID
        },
        yellow: {
          50: '#FFF5E1', //BPA
        },
        indigo: {
          100: '#E6E6FF', //COMPTA
        },
        info: '#5487f5',
        'info-light': '#e5edfe',
        success: '#00c48c',
        'success-light': '#d9f6ee',
        'success-light-hover': 'rgba(217, 246, 238, 0.8)',
        'overlay-color': 'rgba(7, 6, 50, 0.4)',
        'success-heavy': '#00c48c',
        alert: '#fba707',
        'alert-light': '#fff8e7',
        warning: '#ff934b',
        'warning-light': '#fff1e9',
        error: '#f74360',
        'error-light': '#ffe8eb',
        'border-light': 'var(--border)',
        'white-smoke': '#f5f5f5',
        teal: '#1abac4',
        purple: '#9d43f7',
        'dark-title': '#070632',
        grey: '#23262F',
        'grey-light': '#F4F5F6',
        zinc: {
          200: '#d9dce4',
        },
        'scroll-bar': '#d9dce4',
        'default-info': '#3765DE',
        'grey-collapse': '#b1b7cc',
        'grey-filter': '#f6f3f4',
        'grey-light-500': '#434357',
        'grey-5': '#E9ECF7',
        'grey-300': '#7F8491',
        gray: {
          100: '#EFF2F5',
          200: '#E9E9E9',
          400: '#AAAFBB',
        },
      },
      fontFamily: {
        'myriad-pro': ['Myriad Pro', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        nav: '0px 2px 10px rgba(12, 26, 75, 0.08)',
        filter:
          '0px 1px 1px rgba(12, 26, 75, 0.1), 0px 20px 24px rgba(20, 37, 63, 0.06)',
        'input-active': 'inset 0 0 0 2px var(--primary-color-hover)',
        DEFAULT:
          '0px 0px 1px rgba(12, 26, 75, 0.1), 0px 4px 20px -2px rgba(50, 50, 71, 0.08)',
      },
      maxWidth: {
        container: '1200px',
      },
      screens: {
        '2xl': { max: '1600px' },
        quiz: { max: '1440px' },
        xl: { max: '1200px' },
        xlg: { max: '1150px' },
        lg: { max: '992px' },
        xmd: { max: '960px' },
        md: { max: '768px' },
        sm: { max: '576px' },
        ss: { max: '480px' },
        xs: { max: '375px' },
      },
    },
  },
  plugins: [],
};
