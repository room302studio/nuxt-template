<template>
  <div>
    <NuxtPage />
    <UNotifications />
  </div>
</template>
<script setup>
// Apply auth middleware globally
definePageMeta({
  middleware: ['auth']
})
</script>
<style>
/* use Figtree font for everything */
body {
  font-family: 'Figtree', sans-serif;
}
</style>
