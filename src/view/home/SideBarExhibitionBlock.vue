<script setup lang="ts">
import VChart from "vue-echarts";
import {useEcharts} from "@/hooks/useEcharts.ts";

const {option} = useEcharts();

</script>

<template>
  <div class="t-h-72 t-flex-none">
    <v-chart :option="option"/>
  </div>
</template>

<style scoped>

</style>