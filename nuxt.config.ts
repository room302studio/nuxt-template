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
  modules: [
    // '@nuxtjs/supabase',
    '@vueuse/nuxt',
    '@nuxt/ui',
    '@nuxt/content',
    '@vueuse/motion/nuxt',
    ['@nuxtjs/google-fonts', {
      families: {
        'Figtree': [400, 700],
      },
    }],
  ],
  content: {
    documentDriven: true
  },
  runtimeConfig: {
    // add the openai api key to the runtime config
    public: {
      OPENAI_API_KEY: process.env.OPENAI_API_KEY,
      PRODUCTION: process.env.PRODUCTION,
    },
  },
})
