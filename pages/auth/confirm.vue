<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div class="text-center">
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
        Confirming your login...
      </h2>
      <p class="mt-2 text-gray-600 dark:text-gray-400">
        Please wait while we complete the authentication process.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
const user = useSupabaseUser()

// Redirect to home page after successful authentication
watch(user, (newUser) => {
  if (newUser) {
    navigateTo('/')
  }
})
</script>