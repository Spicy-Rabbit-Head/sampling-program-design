<script setup lang="ts">
import VChart from "vue-echarts";
import {useEcharts} from "@/hooks/useEcharts.ts";

const {option} = useEcharts();

</script>

<template>
  <div class="t-h-60 t-flex-none t-bg-emerald-400">
    <v-chart :option="option"/>
  </div>
</template>

<style scoped>

</style>