<script setup lang="ts">
import IconAntDesignCaretUpOutlined from '~icons/ant-design/CaretUpOutlined'
import IconAntDesignCaretDownOutlined from '~icons/ant-design/CaretDownOutlined'
import IconAntDesignReloadOutlined from '~icons/ant-design/reload-outlined'
import IconAntDesignFormOutlined from '~icons/ant-design/form-outlined'
import {useProofreadingMachine} from "@/hooks/useProofreadingMachine.ts";
import ProofreadingMachineStatus from "@/view/verifier/ProofreadingMachineStatus.vue";
import {useGlobalStore} from "@/store";
import {storeToRefs} from "pinia";
import {useIpcSendEvent} from "@/hooks/useIpcSendEvent.ts";
import {onMounted, ref} from "vue";
import {useHome} from "@/hooks/useHome.ts";
import {useNotification} from "naive-ui";


// 校对机闭包
const {
  calibrationStatus,
  automaticCalibrationStop,
  logs,
  standardProducts
} = useProofreadingMachine();

// 全局状态
const globalStore = useGlobalStore();

// 全局状态只读
const {currentFileName, portSelection, calibrationMode, communicationMode} = storeToRefs(globalStore);

// 运行状态
const {autoButton} = useHome();

// 通知
const {error} = useNotification();

// IPC 事件
const {
  portUpdate,
  calibrationModeUpdate,
  readIniConfiguration,
  communicationModeUpdate,
  proofreadingOperationModeUpdate,
  readPortList,
  standardProductQuery,
  readNumberFile,
  automaticCalibrationStarts,
} = useIpcSendEvent();

onMounted(() => {
  standardProductQuery(currentFileName.value);
})

// 通讯方式
const modes = [
  {
    label: "串口",
    value: "serialPort"
  },
  {
    label: '以太网',
    value: 'ethernet'
  },
]

// 运行模式
const operationMode = [
  {
    label: '校机 + 对机',
    value: 0
  },
  {
    label: "仅校机",
    value: 1
  },
  {
    label: '仅对机',
    value: 2
  },
]

// 对机标品编号
const dockingNumber = ref<string>('');

// 验证标品编号
const verificationNumber = ref<string>('');

// 刷新动画
const loading = ref<boolean>(false);

// 对话框显示
const visible = ref<boolean>(false);

// 刷新状态
function refreshStatus() {
  loading.value = true
  standardProductQuery(currentFileName.value);
  setTimeout(() => {
    loading.value = false
  }, 500)
}

// 错误通知
function errorNotification(message: string) {
  error({
    title: '错误',
    content: message,
    duration: 5000,
  });
}

// 对话框显示
function openDialogBox() {
  if (standardProducts[0].label === 'N/A') {
    errorNotification('当前料号未检测到标品数据');
    return;
  }
  visible.value = true;
}

// 对话框确认
function handleBeforeOk() {
  if (dockingNumber.value === '' || verificationNumber.value === '') {
    errorNotification('对机编号和验证编号不能为空');
    return false;
  }
  if (dockingNumber.value === verificationNumber.value) {
    errorNotification('对机编号和验证编号不能相同');
    return false;
  }
  return true;
}

// 对话框取消
function handleCancel() {
  visible.value = false;
  dockingNumber.value = '';
  verificationNumber.value = '';
}

</script>

<template>
  <div class="t-w-screen t-h-full t-flex">
    <!-- 左侧功能栏 -->
    <div class="t-w-1/5 t-p-2">
      <div class="t-flex t-flex-col t-p-2 t-border-2 t-rounded-md t-h-full t-w-full">
        <!-- 校对机功能及参数 -->
        <div class="t-w-full t-grid t-grid-cols-1 t-gap-2">
          <n-button type="success" :disabled="calibrationStatus || autoButton" @click.stop="openDialogBox">
            自动校对机开始
          </n-button>
          <n-button type="error" :disabled="!calibrationStatus" @click.stop="automaticCalibrationStop">
            自动校对机停止
          </n-button>
          <!--  校对机运行模式  -->
          <n-input-group class="t-text-center">
            <n-input-group-label class="t-w-5/12">运行模式 :</n-input-group-label>
            <n-select class="t-w-7/12" v-model:value="globalStore.proofreadingOperationMode" :options="operationMode"
                      @update-value="proofreadingOperationModeUpdate" placeholder=""
                      :disabled="calibrationStatus || autoButton" :consistent-menu-width="false"/>
          </n-input-group>
          <!-- 通讯方式单选 -->
          <n-radio-group class="t-mx-auto" v-model:value="globalStore.communicationMode"
                         @update-value="communicationModeUpdate" name="radioGroup">
            <n-radio v-for="song in modes" :disabled="calibrationStatus || autoButton" :key="song.value"
                     :value="song.value">
              {{ song.label }}
            </n-radio>
          </n-radio-group>
          <!-- 当前通讯方式端口选择 -->
          <n-input-group class="t-text-center">
            <n-input-group-label class="t-w-5/12">当前端口 :</n-input-group-label>
            <n-select class="t-w-7/12" v-if="communicationMode != 'ethernet'" v-model:value="globalStore.currentPort"
                      @focus="readPortList" @update-value="portUpdate" :options="portSelection"
                      :disabled="calibrationStatus || autoButton" placeholder=""/>
            <n-input v-else v-model:value="globalStore.currentAddress" readonly placeholder=""/>
          </n-input-group>
          <!-- 校准模式选择 -->
          <n-input-group class="t-text-center">
            <n-input-group-label class="t-w-5/12">校准模式 :</n-input-group-label>
            <n-select class="t-w-7/12" v-model:value="globalStore.currentCalibrationMode" :options="calibrationMode"
                      @update-value="calibrationModeUpdate" @focus="readIniConfiguration" placeholder=""
                      :disabled="calibrationStatus || autoButton" :consistent-menu-width="false"/>
          </n-input-group>
          <!-- 对机编号 -->
          <div>
            <div class="t-flex t-items-center t-justify-between">
              <span class="t-text-[16px] t-font-normal">当前料号 :</span>
              <n-tooltip trigger="hover" placement="right">
                <template #trigger>
                  <n-button circle secondary :disabled="calibrationStatus || autoButton" @click.stop="readNumberFile">
                    <template #icon>
                      <n-icon>
                        <IconAntDesignFormOutlined/>
                      </n-icon>
                    </template>
                  </n-button>
                </template>
                修改料号
              </n-tooltip>
            </div>
            <div class="t-border t-mt-2 t-h-8 t-rounded-md t-flex t-items-center t-justify-center">
              {{ currentFileName }}
            </div>
          </div>
          <div class="t-flex t-items-center t-justify-between">
            <div class="t-text-[16px] t-font-normal">标品编号对应值 :</div>
            <n-tooltip trigger="hover" placement="right">
              <template #trigger>
                <n-button circle secondary :loading="loading" :disabled="calibrationStatus || autoButton"
                          @click.stop="refreshStatus">
                  <template #icon>
                    <n-icon>
                      <IconAntDesignReloadOutlined/>
                    </n-icon>
                  </template>
                </n-button>
              </template>
              刷新状态
            </n-tooltip>
          </div>
          <a-descriptions :value-style="{padding:'4px 2px'}" align="center" :data="standardProducts" bordered
                          table-layout="fixed"
                          layout="vertical"/>
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
    <!--  自动前判断对话框  -->
    <a-modal v-model:visible="visible" title="Modal Form" @cancel="handleCancel" :on-before-ok="handleBeforeOk"
             @ok="automaticCalibrationStarts">
      <div class="t-grid t-grid-cols-2">
        <div>
          <span>选择对机标品编号 :</span>
          <n-select v-model:value="dockingNumber" :options="standardProducts"/>
        </div>
        <div>
          <span>选择验证标品编号 :</span>
          <n-select v-model:value="verificationNumber" :options="standardProducts"/>
        </div>
      </div>
    </a-modal>
  </div>
</template>