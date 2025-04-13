import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'airport-black': '#000000',
        'airport-yellow': '#FFCC00',
        'airport-white': '#FFFFFF',
        'airport-gray': '#474747',
      },
      fontFamily: {
        // Airport signage often uses Helvetica or similar sans-serif fonts
        'airport': ['Helvetica', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config; 