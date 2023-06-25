<script setup lang="ts">

import {ref} from "vue";

const calibrationStatus = ref<boolean>(false);

function stateReversal() {
  if (calibrationStatus.value) {
    calibrationStatus.value = false
    return
  }
  calibrationStatus.value = true
}

const communicationMode = ref<string>('')
const modes = [
  {
    label: "串口",
    value: "serialPort"
  },
  {
    label: '以太网',
    value: 'ethernet'
  },
]
const portSelection = ref([])
const calibrationMode = ref([
  {
    label: "2",
    value: '1',
  },
  {
    label: "2222",
    value: '2',
  },
])

</script>

<template>
  <div class="t-w-screen t-h-full t-flex">
    <div class="t-w-1/5 t-p-2">
      <div class="t-flex t-flex-col t-p-2 t-border-2 t-rounded-md t-h-full">
        <div class="t-grid t-grid-cols-1 t-gap-2">
          <n-button type="success" :disabled="calibrationStatus" @click.stop="stateReversal">
            自动校对机开始
          </n-button>
          <n-button type="error" :disabled="!calibrationStatus" @click.stop="stateReversal">
            自动校对机停止
          </n-button>
          <n-radio-group class="t-mx-auto" v-model:value="communicationMode" name="radioGroup">
            <n-radio v-for="song in modes" :key="song.value" :value="song.value">
              {{ song.label }}
            </n-radio>
          </n-radio-group>
          <n-input-group>
            <n-input-group-label>当前端口 :</n-input-group-label>
            <n-select :options="portSelection" placeholder=""/>
          </n-input-group>
          <n-input-group>
            <n-input-group-label>校准模式 :</n-input-group-label>
            <n-select :options="calibrationMode" placeholder="" :consistent-menu-width="false"/>
          </n-input-group>
        </div>
        <n-button type="error" dashed class="t-w-20 t-mt-2 t-ml-auto">
          清除记录
        </n-button>
        <div class="t-bg-fuchsia-600 t-flex-auto t-mt-1">
          2
        </div>
      </div>
    </div>
    <div class="t-bg-emerald-400 t-flex-auto">
      2
    </div>
  </div>
</template>

<style scoped>

</style>