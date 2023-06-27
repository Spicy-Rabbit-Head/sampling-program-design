<script setup lang="ts">
import {reactive} from "vue";
import {Step} from "@/type/interface.ts";


const phase = ['短路', '负载', '开路', '对机']
const checkTheMachine = ['计算补偿值', '补偿值写入', '验证']

const steps: Step[] = reactive<Array<Step>>([])

for (let i = 0; i < phase.length; i++) {
  steps.push({
    current: 0,
    currentStatus: 'process',
    name: phase[i],
    content: []
  })
  if (i === 3) {
    checkTheMachine.forEach(item => {
      steps[i].content.push({
        name: item,
        content: '等待中'
      })
    })
  } else {
    for (let j = 1; j <= 4; j++) {
      steps[i].content.push({
        name: `A${j}`,
        content: '等待中'
      })
    }
  }
}

</script>

<template>
  <div class="t-flex-auto t-py-2 t-px-10 t-flex t-flex-col t-select-none">
    <div class="t-h-[600px] t-flex-none t-grid t-grid-cols-1 t-content-evenly">
      <a-steps v-for="(item1,index1) in steps" :key="index1" :current="item1.current" :status="item1.currentStatus">
        <a-step v-for="item2 in item1.content" :description="item2.content">{{ item1.name + item2.name }}</a-step>
      </a-steps>
    </div>
    <div class="t-flex-auto t-grid t-grid-cols-2">
      <div class="t-bg-emerald-400">
        1
      </div>
      <div class="t-bg-cyan-500">
        2
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>