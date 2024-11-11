import { useLocalStorage } from '@vueuse/core'

const OPENROUTER_INSTRUCTIONS = 'Get your API key from <a href="https://openrouter.ai/keys" target="_blank" class="underline">OpenRouter</a>. This gives you access to models from OpenAI, Anthropic, Google, and more.'

export function useLLMConfig() {
  const runtimeConfig = useRuntimeConfig()
  
  // Check env variable first, fall back to localStorage
  const apiKey = useLocalStorage('openrouter_api_key', runtimeConfig.public.OPENROUTER_API_KEY || '')
  const apiKeyAddedDate = useLocalStorage('openrouter_api_key_added_date', null)

  const hasValidKey = computed(() => !!apiKey.value)

  const setApiKey = (key) => {
    apiKey.value = key
    apiKeyAddedDate.value = new Date().toISOString()
  }

  const clearApiKey = () => {
    apiKey.value = ''
    apiKeyAddedDate.value = null
  }

  return {
    apiKey,
    apiKeyAddedDate,
    hasValidKey,
    instructions: OPENROUTER_INSTRUCTIONS,
    setApiKey,
    clearApiKey,
    currentConfig: computed(() => ({
      apiKey: apiKey.value
    }))
  }
} 