<script setup lang="ts">
import VChart from "vue-echarts";
import {useEcharts} from "@/hooks/useEcharts.ts";
import {ref} from "vue";
import {SelectOptionData} from "@arco-design/web-vue";

const lineOption: Array<SelectOptionData> = [];
for (let i = 0; i < 24; i++) {
  lineOption.push({
    label: `第 ${i + 1} 行`,
    value: i
  });
}

const {globalOptions, subitemOptions, lineNumber} = useEcharts();
// 图表实例
const globalChart = ref<any>(null);
const assemblyChart = ref<any>(null);
// 监听视口大小变化，实时更新图表高度
window.addEventListener('resize', handleResize);

// 图表大小变化
function handleResize() {
  // 0.3秒后更新图表高度
  globalChart.value.resize();
  assemblyChart.value.resize();
}

</script>

<template>
  <div class="t-w-full t-h-full t-grid t-grid-cols-2 t-box-border">
    <div>
      <v-chart ref="globalChart" :option="globalOptions"/>
    </div>
    <div class="t-flex t-flex-col t-items-center">
      <a-select v-model:model-value="lineNumber" default-value="第 1 行" placeholder="选择行数"
                class="t-my-1 !t-w-1/3" :options="lineOption"/>
      <v-chart ref="assemblyChart" :option="subitemOptions"/>
    </div>
  </div>
</template>

<style scoped>

</style>