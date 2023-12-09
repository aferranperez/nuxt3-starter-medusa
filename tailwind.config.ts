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
        // './node_modules/@storefront-ui/vue/**/*.{js,mjs}',
        './**/*.vue',
        "app.vue",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ["Maax", "sans-serif"],
            },
        },
    },
    plugins: [
        require("@tailwindcss/forms"),
        require("daisyui"), 
    ],
}
