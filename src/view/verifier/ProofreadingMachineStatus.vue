<script setup lang="ts">
import IconNotoFaceWithMonocle from "~icons/noto/FaceWithMonocle";
import {useProofreadingMachine} from "@/hooks/useProofreadingMachine.ts";
import {useGlobalStore} from "@/store";
import {storeToRefs} from "pinia";

const {
  stateWord,
  steps,
  columns,
} = useProofreadingMachine();
const {outputDisplay, dataBase} = storeToRefs(useGlobalStore());

</script>

<template>
  <div class="t-w-4/5 t-flex-auto t-py-2 t-px-10 t-flex t-flex-col t-select-none">
    <div class="t-h-[500px] t-flex-none t-grid t-grid-cols-1 t-content-evenly">
      <a-steps v-for="(item1,index1) in steps" :key="index1" :current="item1.current" :status="item1.currentStatus">
        <a-step v-for="item2 in item1.content" :description="item2.content">{{ item1.name + item2.name }}</a-step>
      </a-steps>
    </div>
    <div class="t-flex-auto t-grid t-grid-cols-2 t-border-2 t-rounded-md t-border-emerald-500">
      <div class="t-flex t-flex-col t-items-center t-justify-center t-gap-2">
        <div class="t-text-6xl t-flex">
          <icon-noto-face-with-monocle/>
          <span class="t-ml-2">{{ stateWord }}</span>
        </div>
        <a-descriptions :data="outputDisplay" :column="2" bordered/>
      </div>
      <div class="t-p-2 t-m-2 t-text-center">
        <table class="t-w-[96%] t-h-full t-border-2 t-rounded-md t-table-fixed">
          <tr class="t-bg-gray-200 t-w-1/5">
            <th v-for="item in columns" :key="item.dataIndex">{{ item.title }}</th>
          </tr>
          <tr v-for="(item1,index1) in dataBase" :key="index1">
            <td class="t-border-2 t-truncate t-px-1" :class="item2.style" v-for="(item2) in item1"
                :key="item2.key">
              {{ item2.value }}
            </td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>