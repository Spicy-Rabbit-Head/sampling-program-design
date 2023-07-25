<script setup lang="ts">
import VChart from "vue-echarts";
import {useEcharts} from "@/hooks/useEcharts.ts";
import {ref} from "vue";

const lineNumber = ref<number>();
const {globalOptions} = useEcharts();
const globalChart = ref<any>(null);
const assemblyChart = ref<any>(null);
// 监听视口大小变化，实时更新图表高度
window.addEventListener('resize', handleResize);

function handleResize() {
  // 0.3秒后更新图表高度
  globalChart.value.resize();
  assemblyChart.value.resize();
}

function toggle(value: any) {
  console.log(value);
}

</script>

<template>
  <div class="t-w-full t-h-full t-grid t-grid-cols-2 t-box-border">
    <div>
      <v-chart ref="globalChart" :option="globalOptions"/>
    </div>
    <div class="t-flex t-flex-col t-items-center">
      <a-select :model-value="lineNumber" default-value="1" placeholder="选择行数" @change="toggle"
                class="t-my-1 !t-w-1/3">
        <a-option v-for="i in 24" :key="i" :value="i">第 {{ i }} 行</a-option>
      </a-select>
      <v-chart ref="assemblyChart" :option="globalOptions"/>
    </div>
  </div>
</template>

<style scoped>

</style>