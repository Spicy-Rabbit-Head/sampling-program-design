<script setup lang="ts">
import IconAntDesignCaretUpOutlined from '~icons/ant-design/CaretUpOutlined'
import IconAntDesignCaretDownOutlined from '~icons/ant-design/CaretDownOutlined'
import IconAntDesignReloadOutlined from '~icons/ant-design/reload-outlined'
import IconAntDesignFormOutlined from '~icons/ant-design/form-outlined'
import { useProofreadingMachine } from "@/hooks/useProofreadingMachine.ts";
import ProofreadingMachineStatus from "@/view/verifier/ProofreadingMachineStatus.vue";
import { useGlobalStore } from "@/store";
import { storeToRefs } from "pinia";
import { useIpcSendEvent } from "@/hooks/useIpcSendEvent.ts";
import { onMounted, ref, computed } from "vue";
import { useHome } from "@/hooks/useHome.ts";
import { SelectOption, useNotification } from "naive-ui";
import { useConfig } from "@/hooks/useConfig.ts";

// 校对机闭包
const {
  calibrationStatus,
  automaticCalibrationStop,
  logs,
  standardProducts,
} = useProofreadingMachine();

// 全局状态
const globalStore = useGlobalStore();

// 全局状态只读
const {
  currentFileName,
  calibrationMode,
  currentAddress,
  proofreadingOperationMode
} = storeToRefs(globalStore);

// 运行状态
const {autoButton} = useHome();

// 通知
const {error} = useNotification();

// IPC 事件
const {
  calibrationModeUpdate,
  readIniConfiguration,
  proofreadingOperationModeUpdate,
  standardProductQuery,
  readNumberFile,
  automaticCalibrationStarts,
  refreshInstance,
} = useIpcSendEvent();
const {exitPermission} = useConfig();

onMounted(() => {
  standardProductQuery(currentFileName.value);
})

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
const dockingNumber = ref<SelectOption>({});

// 验证标品编号
const verificationNumber = ref<SelectOption>({});

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
  if (standardProducts[0].Id === 0) {
    errorNotification('当前料号未检测到标品数据');
    return;
  }
  exitPermission();
  visible.value = true;
}

// 对话框确认
function handleBeforeOk() {
  if (proofreadingOperationMode.value === 1) {
    refreshInstance(currentFileName.value);
    return true;
  }
  if (dockingNumber.value.label === undefined || verificationNumber.value.label === undefined) {
    errorNotification('对机编号和验证编号不能为空');
    return false;
  }
  if (dockingNumber.value.label === verificationNumber.value.label) {
    errorNotification('对机编号和验证编号不能相同');
    return false;
  }
  globalStore.outputDisplayUpdate(dockingNumber.value, verificationNumber.value);
  refreshInstance(currentFileName.value);
  return true;
}

// 对话框取消
function handleCancel() {
  visible.value = false;
}

// 选择赋值
function DockingUpdate(_: any, option: SelectOption) {
  dockingNumber.value = option;
}

function VerificationUpdate(_: any, option: SelectOption) {
  verificationNumber.value = option;
}

// 日志滚动 DOM
const logsScroll = ref<HTMLDivElement | null>(null);

function logScrollStart(i: boolean) {
  if (logsScroll.value == null) return;
  if (i) {
    logsScroll.value.scrollTop = 0;
  } else {
    logsScroll.value.scrollTop = logsScroll.value.scrollHeight;
  }
}

const options = computed(() => {
  return standardProducts.map((item) => {
    return {
      label: item.Id.toString(),
      value: item.Fl,
      Rr: item.Rr,
    };
  });
});

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
          <!-- 当前通讯方式端口选择 -->
          <n-input-group class="t-text-center">
            <n-input-group-label class="t-w-5/12">当前端口 :</n-input-group-label>
            <n-input :value="currentAddress" readonly placeholder=""/>
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
                  <n-button circle secondary :disabled="calibrationStatus || autoButton"
                            @click.stop="readNumberFile(currentFileName)">
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
          <div class="t-grid t-grid-cols-3">
            <div v-if="standardProducts[0].Id === 0" class="t-col-span-3">
              <p class="t-text-center">未检测到标品数据</p>
            </div>
            <div v-else v-for="item in standardProducts" :key="item.Id" class="t-border t-grid t-gap-2">
              <p class="t-text-center">ID:{{ item.Id }}</p>
              <p class="t-text-center">FL:{{ item.Fl }}</p>
              <p class="t-text-center">RR:{{ item.Rr }}</p>
            </div>
          </div>
        </div>
        <n-button type="error" dashed class="t-w-20 t-mt-2 t-ml-auto" @click.stop="logs.length = 0">
          清除记录
        </n-button>
        <!-- 日志框 -->
        <div class="t-flex t-flex-col t-flex-auto t-mt-2 t-border-2 t-rounded-md">
          <!-- 日志顶栏 -->
          <div class="t-border-b-2 t-h-12 t-flex t-justify-between t-items-center t-px-1">
            <span>日志记录框</span>
            <span>{{ logs.length + ' : 200' }}</span>
            <div class="t-cursor-pointer">
              <n-popover trigger="hover" placement="right">
                <template #trigger>
                  <icon-ant-design-caret-up-outlined @click.stop="logScrollStart(true)"/>
                </template>
                <span>滚动到顶部</span>
              </n-popover>
              <n-popover trigger="hover" placement="right">
                <template #trigger>
                  <icon-ant-design-caret-down-outlined @click.stop="logScrollStart(false)"/>
                </template>
                <span>滚动到底部</span>
              </n-popover>
            </div>
          </div>
          <!-- 日志主体 -->
          <div ref="logsScroll"
               class="t-h-0 t-grow t-px-1 t-break-words t-overflow-y-auto t-scroll-smooth t-overflow-hidden">
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
          <n-select :options="options" @update-value="DockingUpdate"
                    :disabled="proofreadingOperationMode == 1"/>
        </div>
        <div>
          <span>选择验证标品编号 :</span>
          <n-select :options="options" @update-value="VerificationUpdate"
                    :disabled="proofreadingOperationMode == 1"/>
        </div>
      </div>
    </a-modal>
  </div>
</template>