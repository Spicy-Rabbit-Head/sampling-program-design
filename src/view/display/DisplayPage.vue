<script setup lang="ts">
import VChart from "vue-echarts";
import {useEcharts} from "@/hooks/useEcharts.ts";
import {computed, ref} from "vue";
import {SelectOptionData} from "@arco-design/web-vue";
import IconAntDesignReloadOutlined from '~icons/ant-design/reload-outlined'
import {useIpcSendEvent} from "@/hooks/useIpcSendEvent.ts";

const lineOption: Array<SelectOptionData> = [];
for (let i = 0; i < 24; i++) {
  lineOption.push({
    label: `第 ${i + 1} 行`,
    value: i
  });
}

const {globalOptions, subitemOptions, lineNumber, addRandomData} = useEcharts();
const {updateTestDataLimit} = useIpcSendEvent();
// 图表实例
const globalChart = ref<any>(null);
const assemblyChart = ref<any>(null);
const viewportHeight = ref<number>(window.innerHeight)
const chartHeight = computed(() => {
  return `${viewportHeight.value}px`;
});
// 监听视口大小变化，实时更新图表高度
// window.addEventListener('resize', handleResize);
window.onresize = handleResize;

// 图表大小变化
function handleResize() {
  viewportHeight.value = window.innerHeight;
  // 0.1秒后更新图表高度
  setTimeout(() => {
    globalChart.value?.resize();
    assemblyChart.value?.resize();
  }, 100);
}

// 定时添加数据
setInterval(() => {
  addRandomData();
}, 10000);

const loading = ref<boolean>(false);

// 刷新状态
function refreshStatus() {
  loading.value = true
  updateTestDataLimit()
  setTimeout(() => {
    loading.value = false
  }, 500)
}

</script>

<template>
  <div class="t-w-full t-h-full t-grid t-grid-cols-2 t-box-border">
    <div :style="{height : chartHeight}">
      <v-chart ref="globalChart" :option="globalOptions"/>
    </div>
    <div :style="{height : chartHeight}" class="t-flex t-flex-col t-items-center">
      <div class="t-w-full t-flex t-justify-center t-items-center t-gap-4">
        <a-select v-model:model-value="lineNumber" placeholder="选择行数"
                  class="t-my-1 !t-w-1/3" :options="lineOption"/>
        <a-tooltip content="刷新" position="bottom">
          <a-button @click.stop="refreshStatus" :loading="loading">
            <template #icon>
              <n-icon>
                <IconAntDesignReloadOutlined/>
              </n-icon>
            </template>
          </a-button>
        </a-tooltip>
      </div>
      <v-chart ref="assemblyChart" :option="subitemOptions"/>
    </div>
  </div>
</template>

<style scoped>

</style>