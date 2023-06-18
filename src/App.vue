<script setup lang="ts">
import {useIpcRenderer, useIpcRendererOn} from "@vueuse/electron";

const ipcRenderer = useIpcRenderer()

// 发送到主进程
function send() {
  ipcRenderer.send('message', '你好世界')
}

// 接收主进程
useIpcRendererOn('reply', (event, arg) => {
  console.log(arg)
})

// 打开新窗口
function opSend() {
  ipcRenderer.send('open')
}

</script>

<template>
  <button @click="send">
    发送
  </button>
  <button @click="opSend">
    打开新窗口
  </button>
</template>

<style scoped>
</style>
