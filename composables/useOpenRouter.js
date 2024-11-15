import { computed } from 'vue'

const BASE_URL = 'https://openrouter.ai/api/v1'

export const MODEL_CONFIGS = {
  'anthropic/claude-3.5-sonnet:beta': {
    name: 'Claude 3.5 Sonnet (Beta)',
  },
  'google/gemini-flash-1.5-8b': {
    name: 'Gemini Flash 1.5',
  },
  'google/gemini-pro-1.5': {
    name: 'Gemini Pro 1.5',
  },
  'qwen/qwen-2.5-coder-32b-instruct': {
    name: 'Qwen 2.5 Coder',
  },
  'nvidia/llama-3.1-nemotron-70b-instruct': {
    name: 'Nemotron 70B',
  },
  'meta-llama/llama-3.2-3b-instruct:free': {
    name: 'Llama 3.2 3B (Free)',
  },
  'meta-llama/llama-3.2-3b-instruct': {
    name: 'Llama 3.2 3B',
  }
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