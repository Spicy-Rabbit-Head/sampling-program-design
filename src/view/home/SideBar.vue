<script setup lang="ts">

import {ref} from "vue";

const autoButton = ref(false);

function startSwitch() {
  autoButton.value = !autoButton.value;
}

</script>

<template>
  <div class="t-basis-1/5">
    <n-input-group>
      <n-input-group-label>当前料号 :</n-input-group-label>
      <n-input placeholder="" disabled/>
      <n-button type="primary">
        修改
      </n-button>
    </n-input-group>
    <n-button class="t-w-full t-my-4" :disabled="autoButton" @click.stop="startSwitch" type="success">
      自动抽测
    </n-button>
    <n-button class="t-w-full" :disabled="!autoButton" @click.stop="startSwitch" type="success">
      停止抽测
    </n-button>
  </div>
  <div class="t-basis-2/5">
    2
  </div>
  <div class="t-basis-2/5 t-bg-emerald-400">
    3
  </div>
</template>

<style scoped>

</style>