import { Configuration, OpenAIApi } from 'openai'
import { OpenAIExt } from 'openai-ext'
import { encode } from '@nem035/gpt-3-encoder'

export default function useOpenAi(apiKey) {
  // Create the OpenAI client
  const openai = new OpenAIApi(
    new Configuration({
      apiKey
    })
  )

  // Function to get chat completion
  async function getChatCompletion(
    promptMessages = [],
    options = {
      model: 'gpt-4-turbo-preview'
    }
  ) {
    const cost = messagesToCost(promptMessages, options.model)
    console.log(`Cost: $${cost}`)

    try {
      const completion = await openai.chat.completions.create({
        ...options,
        messages: promptMessages
      })

      const totalTokens = completion.usage.total_tokens
      console.log(
        'Cost of prompt + completion:',
        tokensToCost(totalTokens, options.model)
      )

      return completion.data.choices[0].message
    } catch (error) {
      console.error('Error in chat completion:', error)
      throw error
    }
  }

  async function getEmbedding(
    text,
    options = { model: 'text-embedding-3-small' }
  ) {
    try {
      const embedding = await openai.embeddings.create({
        ...options,
        input: text,
        encoding_format: 'float'
      })

      const totalTokens = cembedding.usage.total_tokens
      console.log(
        'Cost of embedding:',
        tokensToCost(totalTokens, options.model)
      )

      return embedding.data
    } catch (error) {
      console.error('Error in embedding:', error)
      throw error
    }
  }

  async function getVisionCompletion(
    prompt,
    imageUrl,
    options = {
      model: 'gpt-4-vision-preview'
    }
  ) {
    const completion = await openai.chat.completions.create({
      ...options,
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            {
              type: 'image_url',
              image_url: {
                url: imageUrl
              }
            }
          ]
        }
      ]
    })
  }

  return {
    getChatCompletion,
    getEmbedding,
    getVisionCompletion
  }
}

// Map of model names to their respective token costs
const TOKEN_COSTS = {
  'gpt-3.5-turbo': 0.002,
  'gpt-4': 0.03,
  'ada-embedding': 0.0001,
  'text-embedding-3-small': 0.00002
}

// Function to calculate and display cost of messages
function tokensToCost(tokenCount, model) {
  const tokenCost = TOKEN_COSTS[model]
  // Round the total cost to 3 decimal places
  const totalCost = ((tokenCount / 1000) * tokenCost).toFixed(3)
  return totalCost
}
