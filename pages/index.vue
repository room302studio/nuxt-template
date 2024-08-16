<template>
  <section class="p-4 text-4xl">
    <Splitpanes class="min-h-screen">
      <Pane size="40" class="p-8"> Hello </Pane>
      <Pane size="40" class="p-8"> World </Pane>
      <Pane size="20" class="p-1">
        <pre class="text-xs w-full">{{ weatherData }}</pre>
      </Pane>
    </Splitpanes>
  </section>
</template>

<script setup>
import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'


const { data: weatherData } = await useFetch('/api/weather', {
  method: 'POST',
  body: JSON.stringify({
    lat: 41.927059,
    lon: -74.2,
  })
});


</script>

<style>
.splitpanes {}

.splitpanes__splitter {
  background-color: #ccc;
  position: relative;
}

.splitpanes__splitter:before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  transition: opacity 0.4s;
  background-color: rgba(255, 255, 255, 0.3);
  opacity: 0;
  z-index: 1;
}

.splitpanes__splitter:hover:before {
  opacity: 1;
}

.splitpanes--vertical>.splitpanes__splitter:before {
  left: -12px;
  right: -12px;
  height: 100%;
}

.splitpanes--horizontal>.splitpanes__splitter:before {
  top: -12px;
  bottom: -12px;
  width: 100%;
}
</style>
