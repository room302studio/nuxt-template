import { Configuration, OpenAIApi } from 'openai';
import { OpenAIExt } from 'openai-ext';
import { encode } from '@nem035/gpt-3-encoder';

// Map of model names to their respective token costs
const TOKEN_COSTS = {
  'gpt-3.5-turbo': 0.002,
  'gpt-4': 0.03
};

// Function to count tokens in given array of messages
function countMessageTokens(messageArray = []) {
  let totalTokens = 0;
  messageArray.forEach((message) => {
    const encodedMessage = encode(JSON.stringify(message)); // Replace with your custom encoding function if needed.
    totalTokens += encodedMessage.length;
  });
  return totalTokens;
}

// Function to calculate and display cost of messages
function messagesToCost(messageArray = [], model, $toast) {
  const messageTokens = countMessageTokens(messageArray);
  const tokenCost = TOKEN_COSTS[model];
  // Round the total cost to 3 decimal places
  const totalCost = (messageTokens / 1000 * tokenCost).toFixed(3);

  const costText = `Cost for ${model}: $${totalCost} - Tokens: ${messageTokens}`;
  $toast.info(costText);
}

export default function useOpenAi(apiKey) {
  // Create the OpenAI client
  const openai = new OpenAIApi(
    new Configuration({
      apiKey,
    }),
  );

  // Function to get chat completion stream
  async function getChatCompletionStream(promptMessages = [], options = {}, onContent, onDone, onError) {
    const { $toast } = useNuxtApp();
    const model = options.model;
    
    messagesToCost(promptMessages, model, $toast);

    const streamConfig = {
      openai,
      apiKey,
      handler: {
        onContent,
        onDone,
        onError,
      },
    };

    try {
      OpenAIExt.streamClientChatCompletion(
        {
          ...options,
          messages: promptMessages,
        },
        streamConfig,
      );
    } catch (error) {
      console.error('Error in chat completion stream:', error);
      throw error;
    }
  }

  // Function to get chat completion
  async function getChatCompletion(promptMessages = [], options = {}) {
    const { $toast } = useNuxtApp();
    const model = options.model;

    messagesToCost(promptMessages, model, $toast);

    try {
      const completion = await openai.createChatCompletion({
        ...options,
        messages: promptMessages,
      });

      return completion.data.choices[0].message;
    } catch (error) {
      console.error('Error in chat completion:', error);
      throw error;
    }
  }

  return {
    getChatCompletionStream,
    getChatCompletion,
  };
}