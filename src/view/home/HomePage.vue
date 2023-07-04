<script setup lang="ts">

import SideBar from "@/view/home/SideBar.vue";

import {useIpcRenderer} from "@vueuse/electron";
import {onMounted} from "vue";
import {useHome} from "@/hooks/useHome.ts";

const {
  mainTable,
  selectPass,
  select
} = useHome();
const ipcRenderer = useIpcRenderer()
onMounted(() => {
  ipcRenderer.send('dll-init')
  ipcRenderer.send('get-port-list')
})

</script>


<template>
  <div class="t-h-full t-select-none t-flex t-p-1">
    <div class="t-w-[500px] t-flex-auto t-grid t-grid-cols-32 t-gap-0.5">
      <n-popover trigger="hover" v-for="(item,index) in mainTable" :key="item.path">
        <template #trigger>
          <span
              class="t-font-mono t-rounded-md t-bg-cyan-500 t-cursor-pointer t-text-white t-border t-text-[0.5rem] 2xl:t-text-[0.75rem] t-whitespace-nowrap t-flex t-items-center t-justify-center"
              :class="item.class" @click.stop="select(index)" @contextmenu.prevent.stop="selectPass(index)">
            {{ item.path }}
          </span>
        </template>
        <template #header>
          <n-text strong depth="1">
            <span>{{ '位置 : ' + item.path }}</span>
          </n-text>
        </template>
        <span>{{ 'FL : xxxxxx' }}</span><br/>
        <span>{{ 'XX : xxxxxx' }}</span><br/>
        <span>{{ 'XX : xxxxxx' }}</span><br/>
        <span>{{ 'XX : xxxxxx' }}</span>
      </n-popover>
    </div>
    <div class="t-w-[300px] t-flex-none t-ml-1 t-flex t-flex-col">
      <side-bar/>
    </div>
  </div>
</template>

<style scoped>

</style>