import Medusa from "@medusajs/medusa-js";

export default defineNuxtPlugin((nuxtApp) => {
    const runtimeConfig = useRuntimeConfig();

    const client = new Medusa({
        baseUrl: runtimeConfig.public.BACKEND_URL,
        maxRetries: 3,
        publishableApiKey: runtimeConfig.public.PUBLISHABLE_API_KEY
    });

    return {
        provide: {
            medusa: client,
        },
    };
});
