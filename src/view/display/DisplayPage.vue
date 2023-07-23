<script setup lang="ts">
import VChart from "vue-echarts";
import {useEcharts} from "@/hooks/useEcharts.ts";
import {computed, ref} from "vue";

const {option} = useEcharts();
const viewportHeight = ref<number>(window.innerHeight)
const chartHeight = computed(() => {
  return `${viewportHeight.value / 4}px`;
});
const chart = ref<any>(null);
// 监听视口大小变化，实时更新图表高度
window.addEventListener('resize', handleResize);

function handleResize() {
  // 视口大小变化时更新视口高度
  viewportHeight.value = window.innerHeight;
  // 0.5秒后更新图表高度
  setTimeout(() => {
    for (let i = 0; i < chart.value.length; i++) {
      chart.value[i].resize();
    }
  }, 300);
}

</script>

<template>
  <div class="t-w-full t-h-full t-grid t-grid-cols-6 t-box-border">
    <v-chart ref="chart" v-for="item in 24" :key="item" :style="{ height: chartHeight }" class=" t-w-full"
             :option="option"/>
  </div>
</template>

<style scoped>

</style>