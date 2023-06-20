/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{vue,js,ts,jsx,tsx}",
    ],
    prefix: 't-',
    theme: {
        extend: {
            gridTemplateColumns: {
                '32': 'repeat(32, minmax(0, 1fr))',
            }
        },
    },
    corePlugins: {
        preflight: false,
    },
    plugins: [],
}

