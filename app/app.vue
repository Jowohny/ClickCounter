<script setup lang="ts">
import { ref, onMounted } from 'vue';

const count = ref(0)
const toast = useToast()

const handleIncrement = () => {
  count.value++
}
</script>

<template>
  <div class="min-h-screen min-w-screen flex justify-center items-center flex-col bg-slate-900">
    <h1 class="text-white text-8xl font-thin">Global Clicks</h1>
    <p class="text-white text-9xl font-bold m-40">{{ count }}</p>
    <button class="px-8 py-4 bg-emerald-300 rounded-xl text-5xl text-semibold" @click="handleIncrement">Click Me!</button>
    <UNotifications />
  </div>
</template>