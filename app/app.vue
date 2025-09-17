<script setup lang="ts">
import { ref } from 'vue';

const count = ref(0)

const handleIncrement = () => {
  count.value++
}

</script>

<template>
  <div class="counter-container">
    <h1>Global Clicks</h1>
    <p id="count">{{ count }}</p>
    <button @click="handleIncrement">Click Me!</button>
  </div>
</template>