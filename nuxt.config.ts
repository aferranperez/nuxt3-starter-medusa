import { defineNuxtConfig } from "nuxt/config";

// https://v3.nuxtjs.org/docs/directory-structure/nuxt.config
export default defineNuxtConfig({
    modules: [
        "@nuxtjs/tailwindcss",
        "@pinia/nuxt",
        "@vueuse/nuxt",
        '@nuxt/devtools',
        'nuxt-primevue',
        "./modules/storesAutoImports",
    ],
    css: ["@/assets/css/main.css", "@/assets/css/fonts.css",'primeicons/primeicons.css'],
    build: {
        transpile: ["@heroicons/vue", "@headlessui/vue"],
    },
    runtimeConfig: {
        public: {
            BACKEND_URL:
                process.env.NUXT_PUBLIC_MEDUSA_URL || "http://localhost:9000",
            PUBLISHABLE_API_KEY:
                process.env.PUBLISHABLE_API_KEY
        },
    },
    tailwindcss: {
        viewer: false,
    },
});
