<script setup lang="ts">

import {reactive} from "vue";
import SideBar from "@/view/home/SideBar.vue";

type tab = {
  path: string,
  class: string,
}


const test = reactive<Array<tab>>([]);

for (let i = 1; i <= 24; i++) {
  for (let j = 1; j <= 32; j++) {
    test.push({path: `${i}-${j}`, class: ""});
  }
}

function select(i: number) {
  test[i].class = "t-bg-red-500";
}
</script>

<template>
  <div class="t-h-full t-select-none t-flex t-p-1">
    <div class="t-w-[500px] t-flex-auto t-grid t-grid-cols-32 t-gap-0.5">
      <n-popover trigger="hover" v-for="(item,index) in test" :key="item.path">
        <template #trigger>
          <span class="t-rounded-md t-bg-cyan-500 t-cursor-pointer t-text-white t-border t-text-[8px] t-whitespace-nowrap t-flex t-items-center t-justify-center"
                :class="item.class" @click.stop="select(index)">{{ item.path }}
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