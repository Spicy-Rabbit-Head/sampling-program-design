<script setup lang="ts">
import {useHome} from "@/hooks/useHome.ts";
import {useGlobalStore} from "@/store";
import {storeToRefs} from "pinia";
import {useIpcSendEvent} from "@/hooks/useIpcSendEvent.ts";
import {useProofreadingMachine} from "@/hooks/useProofreadingMachine.ts";
import {useConfig} from "@/hooks/useConfig.ts";
import {computed, onUpdated, reactive, ref} from "vue";

const {
  autoButton,
  startSwitch,
  stopSwitch,
  options,
  optionsValue,
  optionsExhibition,
} = useHome();

const {calibrationStatus} = useProofreadingMachine();

const {currentFileName, filePath} = storeToRefs(useGlobalStore());

const {readNumberFile} = useIpcSendEvent();

const {exitPermission} = useConfig();
const visible = ref(false)
const spotTestMode = ref<string>()
const bit = reactive({
  start: 0,
  end: 768
})
const column = reactive({
  start: 0,
  end: 32
})

const columnOption = reactive<Array<any>>([])

function start() {
  visible.value = true
}

function handleOk() {
  exitPermission();
  startSwitch();
}

onUpdated(() => {
  columnOption.length = 0
  for (let i = 0; i < 32; i++) {
    columnOption.push({
      label: '第 ' + (i + 1) + ' 列',
      value: i
    })
  }
})

const currentModeComputing = computed(() => {
  if (spotTestMode.value == '位模式') {
    return `当前模式: 位模式; 起始位: ${bit.start}; 结束位: ${bit.end}`
  }
  return `当前模式: 列模式; 起始列: ${column.start + 1}; 结束列: ${column.end + 1}`
})

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
    <div class="t-text-center">
      {{ currentModeComputing }}
    </div>
    <n-button :disabled="autoButton || calibrationStatus" @click.stop="start" type="success">
      自动抽测
    </n-button>
    <n-button :disabled="!autoButton" @click.stop="stopSwitch" type="error">
      停止抽测
    </n-button>
    <a-modal v-model:visible="visible" @ok="handleOk">
      <template #title>
        选择抽测模式
      </template>
      <a-select class="t-mb-2" v-model:model-value="spotTestMode" :options="['位模式','列模式']"
                placeholder="选择模式"/>
      <a-input-group v-if="spotTestMode == '位模式'">
        <a-input-number v-model:model-value="bit.start" :min="0" :max="768">
          <template #prepend>
            起始位
          </template>
        </a-input-number>
        <a-input-number v-model:model-value="bit.end" :min="bit.start" :max="768">
          <template #prepend>
            结束位
          </template>
        </a-input-number>
      </a-input-group>
      <a-input-group v-else class="t-w-full">
        <a-select v-model:model-value="column.start" :options="columnOption" placeholder="">
          <template #prefix>
            起始
          </template>
        </a-select>
        <a-select v-model:model-value="column.end" :options="columnOption" placeholder="">
          <template #prefix>
            结束
          </template>
        </a-select>
      </a-input-group>
    </a-modal>
  </div>
</template>

<style scoped>

</style>