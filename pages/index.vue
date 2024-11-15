<template>
  <div class="max-w-2xl mx-auto p-4">
    <!-- Header with clear button -->
    <div class="mb-4 flex justify-end">
      <button @click="clearChat" class="border p-2 rounded-md">
        Clear Chat
      </button>
    </div>

    <!-- Messages -->
    <div class="space-y-2 mb-4">
      <div v-for="msg in messages" :key="msg" class="group border p-2 hover:bg-gray-50 transition-colors pointer">
        <strong class="group-hover:text-gray-600 transition-colors mr-1">{{ msg.role }}:</strong>
        <span class="group-hover:text-gray-900 text-gray-700">{{ msg.content }}</span>
      </div>
    </div>

    <!-- Input -->
    <form @submit.prevent="sendMessage" class="group flex gap-2">
      <input v-model="input"
        class="flex-1 border p-2 border-gray-300 rounded-md outline-none focus:border-gray-400 transition-colors"
        :disabled="isLoading" />
      <button :disabled="isLoading" class="text-gray-500 group-hover:text-gray-900 transition-colors">
        {{ isLoading ? 'Sending...' : 'Send' }}
      </button>
    </form>
  </div>
</template>

<script setup>
const store = useAppStore()
const { chat, hasValidKey } = useOpenRouter()
const input = ref('')
const isLoading = ref(false)
const messages = computed(() => store.itemList.value)

function clearChat() {
  store.itemList.value = []
}

async function sendMessage() {
  if (!input.value.trim() || isLoading.value) return

  // Add user message as an object
  store.addItem({
    role: 'user',
    content: input.value
  })

  input.value = ''
  isLoading.value = true

  try {
    // Messages are already in the correct format for the API
    const response = await chat(messages.value)

    // Add AI response as an object
    store.addItem({
      role: 'assistant',
      content: response.content
    })
  } catch (error) {
    console.error('Error:', error)
    store.addItem({
      role: 'system',
      content: 'Error: Could not get AI response'
    })
  } finally {
    isLoading.value = false
  }
}
</script>
