// tailwind.config.cjs
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx,css}',
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        agro: {
          50: '#f7fbf7',
          100: '#eef7ee',
          500: '#16a34a'
        }
      }
    }
  },
  plugins: []
}
