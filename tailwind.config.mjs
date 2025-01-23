export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        widget: {
          bg: {
            light: '#ffffff', // Light mode background
            dark: '#10172a', // Dark mode background
          },
          input: {
            light: '#f0f0f0', // Light mode input
            dark: '#1d293b', // Dark mode input
          },
          focus: '#e19822',
        },
      },
    },
  },
  plugins: [],
};
