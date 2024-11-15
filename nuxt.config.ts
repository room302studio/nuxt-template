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
    ['@nuxtjs/google-fonts', {
      families: {
        'Figtree': [400, 700],
      },
    }],
  ],
  runtimeConfig: {
    public: {
      OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY,
      OPENAI_API_KEY: process.env.OPENAI_API_KEY,
      PRODUCTION: process.env.PRODUCTION,
    },
  },
  css: ['~/assets/css/main.css'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
})
