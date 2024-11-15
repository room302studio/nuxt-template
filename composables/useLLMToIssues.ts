import { createParser, type Parser, type ParserEvent } from 'eventsource-parser'
import type { Issue } from '~/types'

/**
 * Composable for streaming and parsing issues from LLM responses
 */
export const useLLMToIssues = () => {
  const isProcessing = ref(false)
  const error = ref<Error | null>(null)
  const store = useAppStore()
  
  let abortController: AbortController | null = null
  let currentText = ''

  function cancelGeneration() {
    if (abortController) {
      abortController.abort()
      isProcessing.value = false
      error.value = null
      abortController = null
    }
  }

  /**
   * Parses a stream of SSE data into Issue objects.
   */
  async function* parseIssuesFromStream(stream: ReadableStream): AsyncIterableIterator<Issue> {
    const reader = stream.getReader()
    const decoder = new TextDecoder()
    
    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        console.log('Received chunk:', chunk)

        // Split the chunk into lines
        const lines = chunk.split('\n')
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6) // Remove 'data: ' prefix
            if (data === '[DONE]') continue

            try {
              const parsed = JSON.parse(data)
              const content = parsed.choices?.[0]?.delta?.content || ''
              console.log('Parsed content:', content)
              
              currentText += content

              // Look for complete XML tags - updated regex to be more flexible
              const issueRegex = /<IssueTitle>([\s\S]*?)<\/IssueTitle>[\s\S]*?<IssueText>([\s\S]*?)<\/IssueText>/g
              const matches = currentText.matchAll(issueRegex)
              
              for (const match of matches) {
                const [_, title, body] = match
                if (title && body) {
                  const issue: Issue = {
                    title: title.trim(),
                    body: body.trim()
                  }
                  console.log('Found complete issue:', issue)
                  yield issue
                  
                  // Remove this matched issue from currentText
                  currentText = currentText.replace(match[0], '')
                }
              }
            } catch (e) {
              console.error('Error parsing JSON:', e)
            }
          }
        }
      }
    } catch (err) {
      console.error('Error parsing stream:', err)
      throw err
    } finally {
      reader.releaseLock()
    }
  }

  /**
   * Streams issues from OpenRouter's /chat/completions endpoint.
   */
  const streamIssues = async (
    apiKey: string, 
    messages: any[], 
    shouldClear = false,
    modelId = 'anthropic/claude-3-sonnet-20240229'
  ) => {
    isProcessing.value = true
    error.value = null
    
    if (shouldClear) {
      store.itemList.value = []
    }
    
    abortController = new AbortController()
    currentText = ''
    
    try {
      console.log('Starting API request with messages:', messages)
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Issue Generator'
        },
        body: JSON.stringify({
          model: modelId,
          messages,
          stream: true,
          temperature: 0.7,
        }),
        signal: abortController.signal
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('API Error:', errorText)
        throw new Error(`HTTP error! status: ${response.status}, details: ${errorText}`)
      }

      console.log('Response received, starting stream...')
      for await (const issue of parseIssuesFromStream(response.body!)) {
        console.log('Adding issue to list:', issue)
        store.addItem(issue)
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') {
        console.log('Request cancelled')
      } else {
        error.value = err as Error
        console.error('Error streaming issues:', err)
      }
    } finally {
      isProcessing.value = false
      abortController = null
    }
  }

  return {
    streamIssues,
    isProcessing,
    error,
    cancelGeneration
  }
} 