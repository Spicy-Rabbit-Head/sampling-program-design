<script setup lang="ts">


import {computed, onMounted, reactive, ref} from "vue";
import {Step} from "@/type/interface.ts";

const trialSettingSwitch = ref(false)
const column = reactive<Array<number>>([])
const computedColumn = computed(() => {
  return column.slice(startColumn.value - 8, column.length)
})

const startColumn = ref<number>(8);
const stopColumn = ref<number>(8);

function scopeOfJudgment(index: any) {
  stopColumn.value = index;
}

const item = ref(false)
onMounted(() => {
  column.length = 0
  for (let i = 8; i <= 32; i++) {
    column.push(i)
  }
})

const steps = reactive<Step>({});

function initStep() {
  steps.name = '试调'
  steps.current = 0
  steps.currentStatus = 'process'
  steps.content = [
    {
      name: '等待量测文本',
      content: '等待中'
    },
    {
      name: '计算刹车点',
      content: '等待中'
    },
    {
      name: '展示结果',
      content: '等待中'
    }
  ]
}

initStep()

const brakingPoint = reactive<Array<number>>([])

</script>

<template>
  <div class="t-h-full t-flex t-flex-col">
    <div class="t-flex">
      <div class="t-w-[320px] t-p-2 t-border-2 t-m-4 t-rounded-md t-flex t-flex-col t-gap-10">
        <n-button type="primary" :disabled="trialSettingSwitch || item" @click.stop="trialSettingSwitch = true">
          开始试调并计算刹车点
        </n-button>
        <n-button type="warning" :disabled="!trialSettingSwitch || item" @click.stop="trialSettingSwitch = false">停止试调
        </n-button>
        <a-input-group>
          <a-select v-model:model-value="startColumn" :options="column" placeholder="" :disabled="item"
                    @change="scopeOfJudgment">
            <template #prefix>
              起始列
            </template>
          </a-select>
          <a-select v-model:model-value="stopColumn" :options="computedColumn" placeholder="" :disabled="item">
            <template #prefix>
              结束列
            </template>
          </a-select>
        </a-input-group>
      </div>
      <div class="t-flex-auto t-flex t-items-center t-justify-center t-p-4">
        <a-steps class="t-w-full" :current="steps.current" :status="steps.currentStatus">
          <a-step v-for="item in steps.content" :description="item.content">{{ item.name }}</a-step>
        </a-steps>
      </div>
    </div>
    <div class="t-flex-auto t-grid t-grid-cols-3">
      <div class="t-col-span-2 t-bg-blue-500">
        1
      </div>
      <div class="t-m-2 t-p-2 t-border-2 t-rounded-md t-grid t-grid-rows-12 t-grid-flow-col t-gap-2">
        <div class="t-flex t-border-2 t-rounded-md" v-for="item in 24" :key="item">
          <p class="t-border-r-2 t-flex t-items-center t-justify-center t-w-1/5">{{ item }}</p>
          <p class="t-flex t-flex-auto t-items-center t-justify-center">{{ brakingPoint[item - 1] }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>