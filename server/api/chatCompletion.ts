import { defineEventHandler } from 'h3'
import axios from 'axios'

// set up .env
import dotenv from 'dotenv'
dotenv.config()

async function getChatCompletion(
  messages = [
    {
      role: 'system',
      content: 'You are a helpful assistant.'
    },
    {
      role: 'user',
      content: 'Hello!'
    }
  ]
) {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
        }
      }
    )
    const completion = response.data.choices[0].message.content
    return completion
  } catch (error) {
    console.error('Error getting chat completion:', error)
    return null
  }
}

export default defineEventHandler(async (event) => {
  try {
    const requestBody = await useBody(event)
    if (!requestBody.data) {
      return createError({
        statusCode: 400,
        statusMessage:
          'There is no data in the request body. Please provide an array of message objects.'
      })
    }

    const chatCompletion = await getChatCompletion(requestBody.data)

    return {
      statusCode: 200,
      statusMessage: 'OK',
      data: chatCompletion
    }
  } catch (error) {
    return createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      error: error.message
    })
  }
})
