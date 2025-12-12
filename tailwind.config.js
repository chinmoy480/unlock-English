/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                serif: ['Playfair Display', 'serif'],
            },
            colors: {
                brand: {
                    navy: '#0B1E38',
                    navyLight: '#1A365D',
                    orange: '#FF6B00',
                    orangeDark: '#CC5500',
                    green: '#D4E09B',
                    greenLight: '#F1F5E6',
                }
            },
            animation: {
                marquee: 'marquee 25s linear infinite',
                fadeIn: 'fadeIn 0.5s ease-out forwards',
                slideUp: 'slideUp 0.5s ease-out forwards',
                zoomIn: 'zoomIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
                float: 'float 6s ease-in-out infinite',
                pulseSlow: 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                slideInRight: 'slideInRight 0.5s ease-out forwards',
                shimmer: 'shimmer 2s linear infinite',
                glow: 'glow 2s ease-in-out infinite alternate',
            },
            keyframes: {
                marquee: {
                    '0%': { transform: 'translateX(100%)' },
                    '100%': { transform: 'translateX(-100%)' },
                },
                fadeIn: {
                    'from': { opacity: '0' },
                    'to': { opacity: '1' }
                },
                slideUp: {
                    'from': { transform: 'translateY(20px)', opacity: '0' },
                    'to': { transform: 'translateY(0)', opacity: '1' }
                },
                zoomIn: {
                    'from': { transform: 'scale(0.9)', opacity: '0' },
                    'to': { transform: 'scale(1)', opacity: '1' }
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-15px)' },
                },
                slideInRight: {
                    'from': { transform: 'translateX(20px)', opacity: '0' },
                    'to': { transform: 'translateX(0)', opacity: '1' }
                },
                shimmer: {
                    '0%': { backgroundPosition: '-1000px 0' },
                    '100%': { backgroundPosition: '1000px 0' }
                },
                glow: {
                    'from': { boxShadow: '0 0 10px #FF6B00, 0 0 20px #FF6B00' },
                    'to': { boxShadow: '0 0 20px #FF6B00, 0 0 30px #FF6B00' }
                }
            }
        },
    },
    plugins: [],
}
