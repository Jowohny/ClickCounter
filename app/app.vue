<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const count = ref(0);
let socket: WebSocket | null = null;


onMounted(() => {
  //asspulled this also, didn't feel like switching the url back and forth
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const url = `${protocol}//${window.location.host}`;

  // Establish the WebSocket connection.
  socket = new WebSocket(url);

  socket.onopen = () => console.log('WebSocket connection established.');
  
  //this activates everytime a message is received from the server, via the broadcastCount 'method' in the server
  socket.onmessage = (event) => {
    //parses numerical data from the server everytime a click is registered and updates the reference to the count, in turn updates the count in the template
    const data = JSON.parse(event.data);
    count.value = data.count;
  };
  
  //just closes the connection
  socket.onclose = () => console.log('WebSocket connection closed.');
});

const handleIncrement = () => {
  //checks if there is a socket available at the URL and also checks if its open, then sends an 'incrememnt' action message to the server which incrememts the count on the server side
  if (socket?.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({ action: 'increment' }));
  }
};

</script>

<template>
  <div class="min-h-screen min-w-screen flex justify-center items-center flex-col bg-slate-900">
    <h1 class="text-white text-8xl font-thin">Global Clicks</h1>
    <p class="text-white text-9xl font-bold m-40">{{ count }}</p>
    <button class="px-8 py-4 bg-emerald-300 rounded-xl text-5xl text-semibold" @click="handleIncrement">Click Me!</button>
  </div>
</template>