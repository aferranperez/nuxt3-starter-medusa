import { tailwindConfig } from '@storefront-ui/vue/tailwind-config';
import type { Config } from 'tailwindcss';

export default <Config>{
    presets: [tailwindConfig],
    content: [
        "components/**/*.{js,vue,ts}",
        "layouts/**/*.vue",
        "pages/**/*.vue",
        "composables/**/*.{js,ts}",
        "plugins/**/*.{js,ts}",
        './node_modules/@storefront-ui/vue/**/*.{js,mjs}',
        './**/*.vue',
        "app.vue",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ["Maax", "sans-serif"],
            },
            colors: {
                primary: {
                  50: '#f5f9ff',
                  100: '#e9f3ff',
                  200: '#c8e0ff',
                  300: '#a6ccff',
                  400: '#6ea1ff',
                  500: '#3375ff',
                  600: '#2e6ae6',
                  700: '#264ebf',
                  800: '#1d3f99',
                  900: '#132f72',
                }
            },
        },
    },
    plugins: [
        require("@tailwindcss/forms"),
        require("daisyui"), 
    ],
}
