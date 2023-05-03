/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        boxShadow: {
            'dark-out': [
                '5px 5px 10px #1a232f',
                '-5px -5px 10px #242f3f'
            ],
            'light-in': [
                'inset 5px 5px 10px #2f3745',
                'inset -5px -5px 10px #3f4b5d'
            ]
        }
      },
    },
    plugins: [],
}
