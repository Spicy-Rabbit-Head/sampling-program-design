<script setup lang="ts">
import {useHome} from "@/hooks/useHome.ts";
import {useGlobalStore} from "@/store";
import {storeToRefs} from "pinia";
import {useIpcSendEvent} from "@/hooks/useIpcSendEvent.ts";
import {useProofreadingMachine} from "@/hooks/useProofreadingMachine.ts";
// import {useNotification} from "naive-ui";
import {useConfig} from "@/hooks/useConfig.ts";

const {
  autoButton,
  stopSwitch,
  options,
  optionsValue,
  optionsExhibition,
  startSwitch,
} = useHome();

const {calibrationStatus} = useProofreadingMachine();

const {currentFileName, filePath} = storeToRefs(useGlobalStore());

const {readNumberFile, closeAutoTest, startAutoTest} = useIpcSendEvent();
const {exitPermission} = useConfig();

function start() {
  exitPermission();
  startSwitch();
  startAutoTest();
}

function stop() {
  closeAutoTest();
  stopSwitch();
}

// 通知
// const {error} = useNotification();

// 错误通知
// function errorNotification(message: string) {
//   error({
//     title: '错误',
//     content: message,
//     duration: 5000,
//   });
// }

</script>

<template>
  <div class="t-basis-2/3 t-flex t-flex-col t-gap-2">
    <n-input-group>
      <n-input-group-label class="t-bg-gray-100">当前料号 :</n-input-group-label>
      <n-input class="t-font-mono" placeholder="" readonly v-model:value="currentFileName"/>
      <n-button type="warning" :disabled="autoButton || calibrationStatus" @click="readNumberFile(currentFileName)">
        修改
      </n-button>
    </n-input-group>
    <div class="t-grow t-flex t-flex-col t-border-2 t-rounded-md t-border-emerald-500">
      <div class="t-h-6 t-text-center t-border-b t-bg-emerald-500 t-text-white t-font-semibold">当前文件地址</div>
      <div class="t-flex-1 t-break-words t-overflow-y-auto t-px-1 t-font-mono">{{ filePath }}</div>
    </div>
    <n-input-group class="t-text-center">
      <n-select v-model:value="optionsValue" :options="options" placeholder=""/>
      <n-input-group-label>当前选择 :</n-input-group-label>
      <n-input placeholder="" readonly v-model:value="optionsExhibition"/>
    </n-input-group>
    <n-button :disabled="autoButton || calibrationStatus" @click.stop="start" type="success">
      自动抽测
    </n-button>
    <n-button :disabled="!autoButton" @click.stop="stop" type="error">
      停止抽测
    </n-button>
  </div>
</template>

<style scoped>

</style>