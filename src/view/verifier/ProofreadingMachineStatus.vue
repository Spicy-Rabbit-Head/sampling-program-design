<script setup lang="ts">
import { useProofreadingMachine } from "@/hooks/useProofreadingMachine.ts";
import { storeToRefs } from "pinia";
import { useGlobalStore } from "@/store";

const {
  stateWord,
  steps,
  columns,
  dataBase,
  modelDisplay,
} = useProofreadingMachine();

const {outputDisplay} = storeToRefs(useGlobalStore());

</script>

<template>
  <div class="t-w-4/5 t-flex-auto t-py-2 t-px-10 t-flex t-flex-col t-select-none">
    <div class="t-h-[450px] t-flex-none t-grid t-grid-cols-1 t-content-evenly">
      <a-steps v-for="(item1,index1) in steps" :key="index1" :current="item1.current" :status="item1.currentStatus">
        <a-step v-for="item2 in item1.content" :description="item2.content">{{ item1.name + item2.name }}</a-step>
      </a-steps>
    </div>
    <div class="t-flex-auto t-grid t-grid-cols-5 t-border-2 t-rounded-md t-border-emerald-500">
      <div class="t-flex t-flex-col t-items-center t-justify-center t-gap-2 t-col-span-2">
        <div class="t-text-6xl t-flex">
          <span class="t-ml-2">{{ stateWord }}</span>
        </div>
        <a-descriptions :data="outputDisplay" :column="1" bordered/>
      </div>
      <div class="t-p-2 t-m-2 t-text-center t-col-span-3">
        <table class="t-w-full t-h-full t-border-2 t-rounded-md t-table-fixed">
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
    <a-modal v-model:visible="modelDisplay" :hide-cancel="true" message-type="error">
      <template #title>
        提示
      </template>
      <div class="t-text-center">
        校对机过程失败
      </div>
    </a-modal>
  </div>
</template>

<style scoped>
</style>