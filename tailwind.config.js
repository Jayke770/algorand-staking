const konstaConfig = require('konsta/config')
module.exports = konstaConfig({
  konsta: {
    colors: {
      'brand-teamdao-primary': '#2afe30',
      'brand-teamdao-secondary': '#1b8520',
      'brand-teamdao-amber': '#4d3810',
      'brand-teamdao-black': "#1d1d1d",
      'brand-teamdao-white': "#fff",
      'brand-teamdao-red': '#ff3b30',
      'brand-teamdao-blue': '#2563eb',
      'brand-teamdao-teal': '#0d9488'
    }
  },
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'teamdao-primary': '#2afe30',
        'teamdao-secondary': '#1b8520',
      },
      fontFamily: {
        'robus': ['Robus'],
        'evil-empire': ['EvilEmpire'],
        'teamdao': ['teamdao']
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
});