<script setup lang="ts">

import type {StatusOverview} from "@/type/interface.ts";
// 状态概述
const status: Array<StatusOverview> = [
  {
    label: "default",
    bgColor: "t-bg-cyan-500",
  },
  {
    label: "pass",
    bgColor: "t-bg-green-600",
  },
  {
    label: "F+",
    bgColor: "t-bg-red-500",
  },
  {
    label: "F-",
    bgColor: "t-bg-blue-500",
  },
  {
    label: "CI",
    bgColor: "t-bg-pink-400",
  },
  {
    label: "RI",
    bgColor: "t-bg-yellow-500",
  }
]
</script>

<template>
  <div class="t-h-44 t-my-2 t-grid t-grid-cols-1 t-rounded-md t-text-center t-shadow-status"
       style="background-image: linear-gradient(to right, #a8edea 0%, #fed6e3 100%);">
    <div class="t-w-full t-h-6 t-grid t-grid-cols-2 t-py-1">
      <span>状态一览</span>
      <span>当前测量值</span>
    </div>
    <div class="t-grid t-grid-cols-2 t-font-mono">
      <div class="t-grid t-grid-cols-1 t-h-36 t-content-around">
        <div v-for="(item,index) in status" :key="index"
             class="t-flex t-w-full t-justify-between t-items-center t-px-6">
          <span>{{ item.label }}</span>
          <span :class="item.bgColor" class="t-h-4 t-w-4 t-ml-6 t-rounded"/>
        </div>
      </div>
      <div id="z-slide" class="t-h-36 t-overflow-y-auto t-overflow-hidden">
        <div>{{ 'FL : xxxxxx' }}</div>
        <div>{{ 'XX : xxxxxx' }}</div>
        <div>{{ 'XX : xxxxxx' }}</div>
        <div>{{ 'XX : xxxxxx' }}</div>
        <div>{{ 'XX : xxxxxx' }}</div>
        <div>{{ 'XX : xxxxxx' }}</div>
        <div>{{ 'XX : xxxxxx' }}</div>
        <div>{{ 'XX : xxxxxx' }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
#z-slide::-webkit-scrollbar {
  display: block;
  width: 6px;
  cursor: pointer;
}

#z-slide::-webkit-scrollbar-thumb {
  background-color: #ff2e63;
  border-radius: 10px;
}
</style>