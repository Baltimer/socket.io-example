<template>
  <div class="flex bg-gray-200 w-full h-full p-5 gap-4">
    <div class="w-40 h-32 bg-white border-2 border-gray-700 flex flex-col" v-for="target in targets" :key="target.id">
      <div class="px-2 font-bold text-lg">{{target.name}}</div>
      <div class="flex w-full h-full justify-center items-center">
        <div class="w-12 h-12" :class="target.active ? 'bg-green-600' : 'bg-red-600'" @click="changeStatus(target)"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios'
import { ref } from 'vue'
import { io } from "socket.io-client";

const socket = io("http://localhost:8080")

const targets = ref([])

socket.on("new-target", (target) => {
  targets.value.push(target)
})

socket.on("update-status", (target) => {
  targets.value.forEach((t) => t.id == target.id ? t.active = target.active : "")
})

function changeStatus(target) {
  socket.emit("new-status", target.id)
}

axios.get('http://localhost:8080/target')
  .then(({data}) => {
    targets.value = data
  })
</script>