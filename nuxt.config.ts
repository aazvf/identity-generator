export default defineNuxtConfig({
    // target: "static",
    ssr: false,
    alias: {
        "@": `./`,
    },

    build: {
        postcss: {
            postcssOptions: {
                plugins: {
                    tailwindcss: {},
                    autoprefixer: {},
                },
            },
        },
    },
});
