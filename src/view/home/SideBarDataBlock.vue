<script setup lang="ts">

import type { StatusOverview } from "@/type/interface.ts";
import { useHome } from "@/hooks/useHome.ts";
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

const {realTimeValue, origin} = useHome();
</script>

<template>
  <a-modal v-model:visible="origin" message-type="error" :mask-closable="false" hide-cancel :closable="false">
    <template #title>
      提示
    </template>
    <div class="t-text-center t-text-2xl">
      检测到会原点,请重新启动指定抽测
    </div>
  </a-modal>
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
        <div class="t-truncate" v-for="(item,index) in realTimeValue" :key="index">
          {{ item[0] }} : {{ item[1] }}
        </div>
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
