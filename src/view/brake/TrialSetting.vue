<script setup lang="ts">
import { useTrialSetting } from "@/hooks/useTrialSetting.ts";
import { useIpcSendEvent } from "@/hooks/useIpcSendEvent.ts";

const {
  trialSettingSwitch,
  steps,
  columns,
  data,
  scopeOfJudgment,
  startColumn,
  column,
  computedColumn,
  item,
  stopColumn
} = useTrialSetting();

const {startProofreading, stopProofreading} = useIpcSendEvent();

</script>

<template>
  <div class="t-h-full t-w-full">
    <div class="t-flex t-h-1/4">
      <div class="t-w-[320px] t-p-2 t-border-2 t-m-4 t-rounded-md t-flex t-flex-col t-gap-4">
        <n-button type="primary" :disabled="trialSettingSwitch || item"
                  @click.stop="startProofreading({start: startColumn,end: stopColumn});">
          开始试调并计算刹车点
        </n-button>
        <n-button type="warning" :disabled="!trialSettingSwitch || item" @click.stop="stopProofreading">停止试调
        </n-button>
        <a-input-group>
          <a-select v-model:model-value="startColumn" :options="column" placeholder="" :disabled="item"
                    @change="scopeOfJudgment">
            <template #prefix>
              起始列
            </template>
          </a-select>
          <a-select v-model:model-value="stopColumn" :options="computedColumn" placeholder="" :disabled="item">
            <template #prefix>
              结束列
            </template>
          </a-select>
        </a-input-group>
      </div>
      <div class="t-flex-auto t-flex t-items-center t-justify-center t-p-4">
        <a-steps class="t-w-full" :current="steps.current" :status="steps.currentStatus">
          <a-step v-for="item in steps.content" :description="item.content">{{ item.name }}</a-step>
        </a-steps>
      </div>
    </div>
    <div class="t-h-3/4">
      <a-table :scroll="{y:'100%'}" :columns="columns" :data="data" :pagination="false"
               table-layout-fixed :bordered="{cell:true}"/>
    </div>
  </div>
</template>

<style scoped>

</style>