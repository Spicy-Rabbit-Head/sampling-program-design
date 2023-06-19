<script setup lang="ts">
import {useIpcRenderer, useIpcRendererOn} from "@vueuse/electron";
import TopBarMode from "@/view/layout/TopBarMode.vue";

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
  <div class="t-w-screen t-h-screen">
    <top-bar-mode>
      <button @click="send">发送</button>
    </top-bar-mode>
  </div>
</template>

<style scoped>
</style>
