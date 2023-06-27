<script setup lang="ts">
import IconAntDesignCaretUpOutlined from '~icons/ant-design/CaretUpOutlined'
import IconAntDesignCaretDownOutlined from '~icons/ant-design/CaretDownOutlined'
import {useProofreadingMachine} from "@/hooks/useProofreadingMachine.ts";
import ProofreadingMachineStatus from "@/view/verifier/ProofreadingMachineStatus.vue";

// 校对机闭包
const {
  calibrationStatus,
  stateReversal,
  communicationMode,
  standardNumber,
  modes,
  portSelection,
  calibrationMode,
  logs
} = useProofreadingMachine();

</script>

<template>
  <div class="t-w-screen t-h-full t-flex">
    <!-- 左侧功能栏 -->
    <div class="t-w-1/5 t-p-2">
      <div class="t-flex t-flex-col t-p-2 t-border-2 t-rounded-md t-h-full">
        <!-- 校对机功能及参数 -->
        <div class="t-grid t-grid-cols-1 t-gap-2">
          <n-button type="success" :disabled="calibrationStatus" @click.stop="stateReversal">
            自动校对机开始
          </n-button>
          <n-button type="error" :disabled="!calibrationStatus" @click.stop="stateReversal">
            自动校对机停止
          </n-button>
          <!-- 通讯方式单选 -->
          <n-radio-group class="t-mx-auto" v-model:value="communicationMode" name="radioGroup">
            <n-radio v-for="song in modes" :key="song.value" :value="song.value">
              {{ song.label }}
            </n-radio>
          </n-radio-group>
          <!-- 当前通讯方式端口选择 -->
          <n-input-group>
            <n-input-group-label>当前端口 :</n-input-group-label>
            <n-select :options="portSelection" placeholder=""/>
          </n-input-group>
          <!-- 校准模式选择 -->
          <n-input-group>
            <n-input-group-label>校准模式 :</n-input-group-label>
            <n-select :options="calibrationMode" placeholder="" :consistent-menu-width="false"/>
          </n-input-group>
          <!-- 对机编号 -->
          <n-input-group>
            <n-input-group-label>对机编号 :</n-input-group-label>
            <n-input-group-label>{{ standardNumber }}</n-input-group-label>
          </n-input-group>
        </div>
        <n-button type="error" dashed class="t-w-20 t-mt-2 t-ml-auto">
          清除记录
        </n-button>
        <!-- 日志框 -->
        <div class="t-flex t-flex-col t-flex-auto t-mt-2 t-border-2 t-rounded-md">
          <!-- 日志顶栏 -->
          <div class="t-border-b-2 t-h-12 t-flex t-justify-between t-items-center t-px-1">
            <span>日志记录框</span>
            <span>{{ logs.length + ' : 500' }}</span>
            <div class="t-cursor-pointer">
              <n-popover trigger="hover" placement="right">
                <template #trigger>
                  <icon-ant-design-caret-up-outlined/>
                </template>
                <span>滚动到顶部</span>
              </n-popover>
              <n-popover trigger="hover" placement="right">
                <template #trigger>
                  <icon-ant-design-caret-down-outlined/>
                </template>
                <span>滚动到底部</span>
              </n-popover>
            </div>
          </div>
          <!-- 日志主体 -->
          <div class="t-flex-auto t-px-1 t-break-words">
            <div v-for="item in logs">
              {{ item.time }} :
              <p>{{ item.content }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 右侧状态栏 -->
    <proofreading-machine-status/>
  </div>
</template>