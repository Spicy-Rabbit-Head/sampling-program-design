<script setup lang="ts">
import SideBarFunctionalBlock from "@/view/home/SideBarFunctionalBlock.vue";
import SideBarDataBlock from "@/view/home/SideBarDataBlock.vue";
import SideBarExhibitionBlock from "@/view/home/SideBarExhibitionBlock.vue";
import VChart from "vue-echarts";
import {useEcharts} from "@/hooks/useEcharts.ts";

const {globalOptions} = useEcharts();
</script>

<template>
  <side-bar-functional-block/>
  <side-bar-data-block/>
  <div class="t-h-72 t-flex-none">
    <v-chart :option="globalOptions"/>
  </div>
</template>

<style scoped>

</style>