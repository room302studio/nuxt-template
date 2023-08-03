import pkg from './package.json'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      title: pkg.name,
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: pkg.version },
      ],
    },
  },
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
