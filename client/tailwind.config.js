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
                    DEFAULT: '#003F2E',
                    dark: '#002a1e',
                },
                accent: {
                    beige: '#E6D4B8',
                    gold: '#D69C4E',
                    gold_dark: '#c48b3e',
                },
                muted: '#F9F9F9',
                text: '#212121',
            },
            fontFamily: {
                chillax: ['Chillax', 'sans-serif'],
                inter: ['Inter', 'sans-serif'],
                dmsans: ['DM Sans', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
