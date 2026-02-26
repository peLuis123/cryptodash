/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',  
  theme: {
    extend: {
      colors: {
       
        dark: {
          bg: {
            primary: '#0B1F14',
            secondary: '#102217',
            tertiary: '#152A1E',
            card: '#1a2e24',
          },
          text: {
            primary: '#f1f5f9',
            secondary: '#cbd5e1',
            tertiary: '#94a3b8',
          },
          accent: '#2bee79',
        },
        
        light: {
          bg: {
            primary: '#ffffff',
            secondary: '#f8fafc',
            tertiary: '#f1f5f9',
            card: '#ffffff',
          },
          text: {
            primary: '#0f172a',
            secondary: '#475569',
            tertiary: '#64748b',
          },
          accent: '#10b981',
        },
      },
    },
  },
  plugins: [],
}
