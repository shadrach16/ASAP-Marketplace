


/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // --- ADD THIS 'colors' OBJECT ---
      colors: {
        primary: {
          DEFAULT: '#2563EB', // Your main brand color (e.g., blue-600)
          light: '#DBEAFE',   // A light version for backgrounds (e.g., blue-100)
          dark: '#1D4ED8',    // A dark version for hover (e.g., blue-700)
        },
        text: {
          primary: '#111827',   // Main text color (e.g., gray-900)
          secondary: '#4B5563', // Lighter text (e.g., gray-600)
          light: '#9CA3AF',     // Very light text (e.g., gray-400)
        },
        background: {
          light: '#F9FAFB', // Your main page background (e.g., gray-50)
        },
        border: {
          DEFAULT: '#E5E7EB', // Default border color (e.g., gray-200)
          light: '#F3F4F6'    // Lighter border (e.g., gray-100)
        }
      },
        keyframes: {
        'bounce-letter': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-15px)' }, // Adjust height here
        }
      },
      // And this:
      animation: {
        'bounce-letter': 'bounce-letter 1.4s ease-in-out infinite',
      }
      // --- END OF ADDITION ---
    },
  },
  plugins: [],
}