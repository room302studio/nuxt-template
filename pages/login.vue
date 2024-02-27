<script setup lang="ts">
const supabase = useSupabaseClient()
const email = ref('')

const signInWithOtp = async () => {
  const { error } = await supabase.auth.signInWithOtp({
    email: email.value,
    options: {
      emailRedirectTo: 'http://localhost:3000/confirm',
    }
  })
  if (error) console.log(error)
}
</script>
<template>
  <div class="max-w-screen-md p-4 flex space-x-4">

    <UInput v-model="email" type="email" />

    <UButton @click="signInWithOtp" variant="outline">
      Sign In with E-Mail
    </UButton>
  </div>
</template>