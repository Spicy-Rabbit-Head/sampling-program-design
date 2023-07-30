<script setup lang="ts">


import {onUpdated, reactive, ref} from "vue";

const trialSettingSwitch = ref(false)
const trialSettingMode = ref<string>()
const bit = reactive({
  start: 0,
  end: 768
})
const column = reactive<Array<string>>([])

onUpdated(() => {
  column.length = 0
  for (let i = 0; i < 32; i++) {
    column.push('第 ' + (i + 1) + ' 列')
  }
})

</script>

<template>
  <div class="t-h-full t-grid">
    <div class="t-flex t-w-full">
      <div class="t-w-[320px] t-p-2 t-border-r-2 t-border-b-2 t-rounded-md t-flex t-flex-col t-gap-4">
        <n-button type="primary" :disabled="trialSettingSwitch" @click.stop="trialSettingSwitch = true">
          开始试调并计算刹车点
        </n-button>
        <n-button type="warning" :disabled="!trialSettingSwitch" @click.stop="trialSettingSwitch = false">停止试调
        </n-button>
        <a-select v-model:model-value="trialSettingMode" :options="['位模式','列模式']" placeholder="选择模式"/>
        <a-input-group v-if="trialSettingMode == '位模式'">
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
        <a-input-group v-else>
          <a-select :options="column" placeholder="">
            <template #prefix>
              起始
            </template>
          </a-select>
          <a-select :options="column" placeholder="">
            <template #prefix>
              结束
            </template>
          </a-select>
        </a-input-group>
      </div>
      <div class="t-flex-auto">
        2
      </div>
    </div>
    <div class="">
      3
    </div>
  </div>
</template>

<style scoped>

</style>