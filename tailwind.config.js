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
            },
            boxShadow: {
                'status': '0 1px rgba(255,255,255,.5), 0 8px 13px rgba(0,0,0,.15) inset'
            },
            fontFamily: {
                'noto': ['NotoSerif'],
            },
        },
    },
    corePlugins: {
        preflight: false,
    },
    plugins: [],
}

