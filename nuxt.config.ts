// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
    ssr: false,
    css: ['vuetify/lib/styles/main.sass', '@mdi/font/css/materialdesignicons.min.css', '@/assets/main.scss'],
    build: {
        transpile: ['@vuepic/vue-datepicker']
    },
    vite: {
        define: {
            'process.env.DEBUG': false,
        },
    },
    modules: ['@pinia/nuxt',
        '@vueuse/nuxt',],
    runtimeConfig: {
        secretKey: ""
    },
    imports: {
        dirs: [
            'store/**'
        ]
    },
})
