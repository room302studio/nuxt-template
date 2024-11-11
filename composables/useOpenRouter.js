import { computed } from 'vue'

const BASE_URL = 'https://openrouter.ai/api/v1'

// Just keeping the most common models
export const MODEL_CONFIGS = {
  'openai/gpt-3.5-turbo': {
    name: 'GPT-3.5 Turbo',
  },
  'openai/gpt-4': {
    name: 'GPT-4',
  },
  'anthropic/claude-3-sonnet': {
    name: 'Claude 3 Sonnet',
  },
}

export function useOpenRouter() {
  const config = useRuntimeConfig()
  const apiKey = computed(() => config.public.OPENROUTER_API_KEY)
  const hasValidKey = computed(() => !!apiKey.value)

  async function chat(messages = [], options = {}) {
    if (!hasValidKey.value) {
      throw new Error('No API key found. Add OPENROUTER_API_KEY to your .env file')
    }

    try {
      const response = await fetch(`${BASE_URL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey.value}`,
          'HTTP-Referer': window.location.origin,
        },
        body: JSON.stringify({
          messages,
          model: options.model || 'openai/gpt-3.5-turbo',
          stream: options.stream,
          ...options,
        }),
      })

      if (options.stream) {
        return response.body
      }

      const data = await response.json()
      return data.choices[0].message
    } catch (error) {
      console.error('Error in OpenRouter chat:', error)
      throw error
    }
  }

  return {
    chat,
    hasValidKey,
    MODEL_CONFIGS,
  }
} 