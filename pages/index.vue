<template>
  <section class="bg-black text-white dark:bg-white dark:text-black columns-2 gap-4">


    <div v-for="(metric, index) in metrics" :key="metric" class="p-4">
      <!-- {{ metric }} -->

      <UCard class="bg-gray-200 dark:bg-gray-800 text-gray-400">
        <template #header>
          {{ metric }}
        </template>
        <pre>{{ healthData[index].data[0] }}</pre>
        <!-- <pre>{{ healthData[index].data }}</pre> -->
      </UCard>
    </div>


    <!-- <pre class="text-red-500">
      {{ metrics }}
    </pre>
    <pre>
      {{ healthData }}
    </pre> -->
  </section>
</template>

<script setup>
/*
// Use the global state in this component
const store = useAppStore()
// Access the state variables and functions
const { activeItem, itemList, setActiveItem, addItem, removeItem } = store
*/

const { data: healthData, metrics } = useHealthData()
</script>

<style></style>
