/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/Components/ChatBot/*.{js,jsx,ts,tsx,css}',
  ],
  theme: {
    extend: {
      zIndex: {
        '9999': '9999',
        '10001':'10001',
        '10000':'10000',
       // Custom value
        
      },
    },
  },
  corePlugins: {
    preflight: false, // Disables Tailwind base styles globally
  },
  plugins: [],
};
