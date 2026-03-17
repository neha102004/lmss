import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        udemy: {
          dark: '#1c1d1f',
          purple: '#a435f0',
          black: '#000',
        },
      },
    },
  },
  plugins: [],
};
export default config;
