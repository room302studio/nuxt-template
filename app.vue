<template>
  <div>
    <NuxtWelcome class="debug"/>
  </div>
</template>
<script setup>
import { enableToast } from '~/plugins/toast'

const { $toast } = useNuxtApp()

onMounted(() => {
  enableToast()

  let hello = $toast.success('Hello World')

  // force dismiss hello
  // hello.dismiss()
})
</script>
<style>
/* use Figtree font for everything */
body {
  font-family: 'Figtree', sans-serif;
}

.v-toast__text {
  font-family: 'Figtree', sans-serif;
  font-size: 0.75em;
}

/* override the default toast styles */
.v-toast__item {
  padding: 0.25em;
  box-shadow: 0 0 10px 0 rgba(0,0,0,0.15);
}

.v-toast__item--success {
  /* background-color: #4caf50; */
  /* grayscale */
  background-color: #222;
  /* animation: bgrainbow 15s infinite; */
    
  /* make a border that animates through the rainbow */
  border: 1px solid #000;
  animation: rainbow 22s infinite;
}

.v-toast__item--error {
  background-color: #f44336;
  /* grayscale */
  /* background-color: #999; */
}

.v-toast__item--warning {
  /* background-color: #ffc107; */
  /* grayscale */
  background-color: #666;
  color: #000;
  animation: rainbow 12s infinite;
}

.v-toast__item--info {
  /* background-color: #2196f3; */
  /* grayscale */
  background-color: #CCC;
  color: #000;
}


@keyframes rainbow {
  0% {
    border-color: #f00;
  }
  10% {
    border-color: #ff0;
  }
  20% {
    border-color: #0f0;
  }
  30% {
    border-color: #0ff;
  }
  40% {
    border-color: #00f;
  }
  50% {
    border-color: #f0f;
  }
  60% {
    border-color: #f00;
  }
  70% {
    border-color: #ff0;
  }
  80% {
    border-color: #0f0;
  }
  90% {
    border-color: #0ff;
  }
  100% {
    border-color: #00f;
  }
}

</style>