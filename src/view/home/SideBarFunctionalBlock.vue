<script setup lang="ts">
import {computed, ref} from "vue";
import {useIpcRenderer} from "@vueuse/electron";

const autoButton = ref<boolean>(false);
const regex: RegExp = /\\([^\\.]+)\./;
const currentFileName = computed<string>(() => {
  let str = filePath.value.match(regex);
  return str ? str[1] : '';
})
const filePath = ref<string>("D:\\.work_documents\\Syncdisk\\OW7680012002.qcc");

function startSwitch() {
  autoButton.value = !autoButton.value;
}

const options = [
  {
    label: '实时',
    value: 0,
  },
]

for (let i = 1; i <= 2; i++) {
  for (let j = 1; j <= 5; j++) {
    options.push({
      label: `${i}-${j}`,
      value: options.length,
    })
  }
}

const optionsValue = ref<number>(0);
const optionsExhibition = computed<string>(() => {
  return optionsValue ? 'Carrier' + options[optionsValue.value].label : '';
})
const ipcRenderer = useIpcRenderer()
</script>

<template>
  <div class="t-basis-2/3 t-flex t-flex-col t-gap-2">
    <n-input-group>
      <n-input-group-label class="t-bg-gray-100">当前料号 :</n-input-group-label>
      <n-input class="t-font-mono" placeholder="" readonly v-model:value="currentFileName"/>
      <n-button type="warning" :disabled="autoButton" @click="ipcRenderer.send('get-text')">
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
    <n-button :disabled="autoButton" @click.stop="startSwitch" type="success">
      自动抽测
    </n-button>
    <n-button :disabled="!autoButton" @click.stop="startSwitch" type="error">
      停止抽测
    </n-button>
  </div>
</template>

<style scoped>

</style>