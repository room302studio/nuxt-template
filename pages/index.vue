<template>
  <div class="max-w-2xl mx-auto p-4">
    <!-- Header with clear button -->
    <div class="mb-4 flex justify-end">
      <button @click="clearChat" class="border p-2">
        Clear Chat
      </button>
    </div>

    <!-- Messages -->
    <div class="space-y-2 mb-4">
      <div v-for="msg in messages" :key="msg" class="border p-2">
        <strong>{{ msg.role }}:</strong> {{ msg.content }}
      </div>
    </div>

    <!-- Input -->
    <form @submit.prevent="sendMessage" class="flex gap-2">
      <input v-model="input" class="flex-1 border p-2" :disabled="isLoading" />
      <button :disabled="isLoading">
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
