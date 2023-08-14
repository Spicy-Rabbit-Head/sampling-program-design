<script setup lang="ts">

import SideBar from "@/view/home/SideBar.vue";

import {onMounted} from "vue";
import {useHome} from "@/hooks/useHome.ts";
import {useIpcSendEvent} from "@/hooks/useIpcSendEvent.ts";

const {
  mainTable,
  selectPass,
  select,
  optionsValue,
  visible,
  stopAlarm,
} = useHome();

const {
  renderThreadInitialization,
  dllInitialization,
  cacheDataRead,
  updateTestDataLimit,
  initLog,
  initMeasure,
} = useIpcSendEvent();

onMounted(() => {
  renderThreadInitialization();
  dllInitialization();
  cacheDataRead();
  updateTestDataLimit();
  initLog();
  initMeasure();
})

</script>
<template>
  <div class="t-h-full t-select-none t-flex t-p-1">
    <div class="t-w-[500px] t-flex-auto t-grid t-grid-cols-32 t-gap-0.5">
      <n-popover trigger="hover" v-for="(item,index) in mainTable[optionsValue]" :key="item.path">
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
        <div class="t-truncate" v-for="(itemData,index) in item.data" :key="index">
          {{ itemData[0] }} : {{ itemData[1] }}
        </div>
      </n-popover>
    </div>
    <div class="t-w-[300px] t-flex-none t-ml-1 t-flex t-flex-col">
      <side-bar/>
    </div>
    <a-modal v-model:visible="visible" :closable="false" hideCancel :maskClosable="false" :escToClose="false"
             @ok="stopAlarm" :okText="'清除警报并重置'">
      <template #title>
        量测异常
      </template>
      <div>
        当前盘量测不良品超过设定值上限，请检查!
      </div>
    </a-modal>
  </div>
</template>

<style scoped>

</style>