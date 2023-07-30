<script setup lang="ts">
import {useHome} from "@/hooks/useHome.ts";
import {useGlobalStore} from "@/store";
import {storeToRefs} from "pinia";
import {useIpcSendEvent} from "@/hooks/useIpcSendEvent.ts";
import {useProofreadingMachine} from "@/hooks/useProofreadingMachine.ts";
import {useConfig} from "@/hooks/useConfig.ts";
import {onMounted, reactive, ref} from "vue";
// import {useNotification} from "naive-ui";

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

const {readNumberFile, saveSpotTestData} = useIpcSendEvent();

const {exitPermission} = useConfig();

const globalStore = useGlobalStore()
const visible = ref(false)

const columnOption = reactive<Array<any>>([])

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

const item = ref(true)

// 判断
function judgment() {
  return true;
  // if (globalStore.spotTestMode == '列模式') {
  //   if (globalStore.spotTestColumn.start > globalStore.spotTestColumn.end) {
  //     errorNotification('起始列不能大于结束列')
  //     return false
  //   }
  // }
  // return true
}

// 打开抽测前的判断
function start() {
  visible.value = true
}

// 判断成功
function handleOk() {
  exitPermission();
  startSwitch();
  saveSpotTestData(globalStore.spotTestMode, globalStore.spotTestBit, globalStore.spotTestColumn);
}

// 更新列
onMounted(() => {
  columnOption.length = 0
  for (let i = 0; i < 32; i++) {
    columnOption.push({
      label: '第 ' + (i + 1) + ' 列',
      value: i
    })
  }
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
      {{ globalStore.currentModeComputing }}
    </div>
    <n-button :disabled="autoButton || calibrationStatus" @click.stop="start" type="success">
      自动抽测
    </n-button>
    <n-button :disabled="!autoButton" @click.stop="stopSwitch" type="error">
      停止抽测
    </n-button>
    <a-modal v-model:visible="visible" :on-before-ok="judgment" @ok="handleOk">
      <template #title>
        选择抽测模式
      </template>
      <a-select class="t-mb-2" v-model:model-value="globalStore.spotTestMode" :options="['位模式','列模式']"
                placeholder="选择模式" default-value="列模式" :disabled="item"/>
      <a-input-group v-if="globalStore.spotTestMode == '位模式'">
        <a-input-number v-model:model-value="globalStore.spotTestBit.start" :min="0" :max="768" :disabled="item">
          <template #prepend>
            起始位
          </template>
        </a-input-number>
        <a-input-number v-model:model-value="globalStore.spotTestBit.end" :min="globalStore.spotTestBit.start"
                        :max="768" :disabled="item">
          <template #prepend>
            结束位
          </template>
        </a-input-number>
      </a-input-group>
      <a-input-group v-else class="t-w-full">
        <a-select v-model:model-value="globalStore.spotTestColumn.start" :options="columnOption" placeholder=""
                  :disabled="item">
          <template #prefix>
            起始
          </template>
        </a-select>
        <a-select v-model:model-value="globalStore.spotTestColumn.end" :options="columnOption" placeholder=""
                  :disabled="item">
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