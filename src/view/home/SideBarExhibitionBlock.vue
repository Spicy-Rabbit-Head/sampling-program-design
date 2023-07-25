<script setup lang="ts">
import VChart from "vue-echarts";
import {useEcharts} from "@/hooks/useEcharts.ts";

const {globalOptions} = useEcharts();

</script>

<template>
  <div class="t-h-72 t-flex-none">
    <v-chart :option="globalOptions"/>
  </div>
</template>

<style scoped>

</style>