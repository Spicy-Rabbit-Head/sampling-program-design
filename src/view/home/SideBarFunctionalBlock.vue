<script setup lang="ts">
import {useHome} from "@/hooks/useHome.ts";
import {useGlobalStore} from "@/store";
import {storeToRefs} from "pinia";
import {useIpcSendEvent} from "@/hooks/useIpcSendEvent.ts";
import {useProofreadingMachine} from "@/hooks/useProofreadingMachine.ts";

const {
  autoButton,
  startSwitch,
  options,
  optionsValue,
  optionsExhibition,
} = useHome();

const {calibrationStatus} = useProofreadingMachine();

const {currentFileName, filePath} = storeToRefs(useGlobalStore());

const {readNumberFile} = useIpcSendEvent();

</script>

<template>
  <div class="t-basis-2/3 t-flex t-flex-col t-gap-2">
    <n-input-group>
      <n-input-group-label class="t-bg-gray-100">当前料号 :</n-input-group-label>
      <n-input class="t-font-mono" placeholder="" readonly v-model:value="currentFileName"/>
      <n-button type="warning" :disabled="autoButton || calibrationStatus" @click="readNumberFile">
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
    <n-button :disabled="autoButton || calibrationStatus" @click.stop="startSwitch" type="success">
      自动抽测
    </n-button>
    <n-button :disabled="!autoButton" @click.stop="startSwitch" type="error">
      停止抽测
    </n-button>
  </div>
</template>

<style scoped>

</style>