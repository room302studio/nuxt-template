// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false, // for netlify deploy
  devtools: { enabled: true },
  css: [
    'tachyons/css/tachyons.css',
    'vue-toast-notification/dist/theme-default.css',
  ],
  modules: [
    // '@nuxtjs/supabase',
    '@vueuse/nuxt',
    '@pinia/nuxt',
    '@vueuse/motion/nuxt',
    ['@nuxtjs/google-fonts', {
      families: {
        'Figtree': [400, 700],
      },
    }],
  ],
  runtimeConfig: {
    // add the openai api key to the runtime config
    public: {
      OPENAI_API_KEY: process.env.OPENAI_API_KEY,
      PRODUCTION: process.env.PRODUCTION,
    },
  },
})
 