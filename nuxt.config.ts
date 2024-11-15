import pkg from './package.json';

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
    }
  },
  nitro: {
    future: {
      nativeSWR: true
    }
  },
  routeRules: {
    '/**': { cache: { swr: true } }
  },
  ssr: false, // for netlify deploy
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/supabase',
    '@vueuse/nuxt',
    '@nuxt/ui',
    [
      '@nuxtjs/google-fonts',
      {
        families: {
          Figtree: [400, 500, 700, 800],
        },
      },
    ],
  ],
  runtimeConfig: {
    WEATHER_KEY: process.env.WEATHER_KEY,
    public: {
      SITE_URL: process.env.SITE_URL,
      CLICKHOUSE_HOST: process.env.CLICKHOUSE_HOST,
      CLICKHOUSE_USER: process.env.CLICKHOUSE_USER,
      CLICKHOUSE_PASSWORD: process.env.CLICKHOUSE_PASSWORD,
    },
  },
  supabase: {
    redirectOptions: {
      login: '/auth/login',
      callback: '/auth/confirm',
      exclude: ['/auth/login', '/auth/confirm']
    },
    cookieOptions: {
      secure: process.env.NODE_ENV === 'production'
    }
  }
});
