<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          Sign in to your account
        </h2>
      </div>

      <div class="mt-8 space-y-6">
        <button @click="handleGitHubLogin"
          class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          :disabled="loading">
          <span class="absolute left-0 inset-y-0 flex items-center pl-3">
            <Icon name="mdi:github" class="h-5 w-5" />
          </span>
          {{ loading ? 'Signing in...' : 'Sign in with GitHub' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const supabase = useSupabaseClient()
const config = useRuntimeConfig()
const loading = ref(false)
const toast = useToast()

async function handleGitHubLogin() {
  loading.value = true
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: config.public.SITE_URL + '/auth/confirm',
        scopes: 'read:user'
      }
    })
    if (error) throw error
  } catch (error) {
    toast.add({
      title: 'Error signing in with GitHub',
      description: error.message,
      color: 'red'
    })
  } finally {
    loading.value = false
  }
}

// Redirect if already logged in
const user = useSupabaseUser()
watch(user, (newUser) => {
  if (newUser) {
    navigateTo('/')
  }
})
</script>