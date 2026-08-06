/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1b4d3e', // Xanh lục lúa sấy sẫm
          light: '#2a6a57',
          dark: '#0e2b22',
        },
        accent: {
          DEFAULT: '#d4af37', // Vàng lúa chín óng
          light: '#e5c052',
          dark: '#b3901b',
        },
        silo: {
          success: '#2e7d32', // Xanh đầy kho
          warning: '#ef6c00', // Đang sấy/Khấu trừ cao
          danger: '#c62828', // Hết sức chứa
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        premium: '0 4px 20px -2px rgba(27, 77, 62, 0.1)',
        card: '0 2px 12px 0 rgba(0, 0, 0, 0.04)',
      }
    },
  },
  plugins: [],
}
