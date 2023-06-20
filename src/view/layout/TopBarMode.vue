<script setup lang="ts">
import {useTopBar} from "@/hooks/useTopBar.ts";

const {
  topBarWindow,
  topBarWindowState,
  topBarFunction,
  menuOptions,
  tagsToggle
} = useTopBar()

</script>
<template>
  <div class="t-flex t-flex-col t-h-screen">
    <div class="t-h-10 t-flex-none t-flex t-items-center t-w-screen t-bg-gray-200">
      <!-- 标题 -->
      <div style="-webkit-app-region: drag" class="t-flex-none t-px-1 t-flex t-select-none">
        <img src="/favicon.png" class="t-w-6 t-h-6 t-mr-1" alt=""/>
        <span class="t-font-mono t-subpixel-antialiased t-font-semibold">B03抽测程式</span>
      </div>
      <!-- 路由切换 -->
      <div style="-webkit-app-region: drag" class="t-flex-auto t-h-full t-flex t-items-center t-px-4">
        <span v-for="(item ,index) in menuOptions"
              style="-webkit-app-region: no-drag" :key="index"
              @click.stop="tagsToggle(item.key)"
              :class="item.class"
              class="t-mx-4 hover:t-text-emerald-400 t-font-sans t-cursor-pointer">
          {{ item.label }}
        </span>
      </div>
      <!-- 窗口功能 -->
      <div class="t-flex t-flex-none">
        <span v-for="(item,index) in topBarWindowState" :key="index" class="hover:t-text-sky-500">
          <component v-if="item" class="t-mx-1" :is="topBarWindow[index]" @click.stop="topBarFunction(index)"/>
        </span>
      </div>
    </div>
    <!-- 主体 -->
    <div class="t-h-[600px] t-flex-auto t-w-screen">
      1
    </div>
  </div>
</template>

<style scoped>

</style>