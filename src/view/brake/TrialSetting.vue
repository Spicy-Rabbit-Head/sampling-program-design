<script setup lang="ts">


import {computed, onMounted, reactive, ref} from "vue";

const trialSettingSwitch = ref(false)
const column = reactive<Array<number>>([])
const computedColumn = computed(() => {
  return column.slice(startColumn.value - 8, column.length)
})

const startColumn = ref<number>(8);
const stopColumn = ref<number>();

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

</script>

<template>
  <div class="t-h-full t-grid">
    <div class="t-flex t-w-full">
      <div class="t-w-[320px] t-p-2 t-border-r-2 t-border-b-2 t-rounded-md t-flex t-flex-col t-gap-4">
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