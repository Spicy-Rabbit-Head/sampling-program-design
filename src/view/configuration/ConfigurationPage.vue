<script setup lang="ts">
import IconAntDesignControlOutlined from "~icons/ant-design/control-outlined"
import IconAntDesignDeleteRowOutlined from "~icons/ant-design/delete-row-outlined"
import { onMounted, ref } from "vue";
import { useIpcSendEvent } from "@/hooks/useIpcSendEvent.ts";
import { useConfig } from "@/hooks/useConfig.ts";
import { useHome } from "@/hooks/useHome.ts";
import { useProofreadingMachine } from "@/hooks/useProofreadingMachine.ts";
import { useConfigStore } from "@/store";
import { PositionInterface } from "@/type/interface.ts";
import { useNotification } from "naive-ui";

const {
  readModifiableConfigurations,
  standardProductPathUpdate,
  standardProductPasswordUpdate,
  iniConfigurationUpdate,
  workshopListQuery,
  workshopListUpdate,
  testHeadAction,
  manualPosition,
  onceMeasure,
  clearMeasureData,
  compensationDeviationUpdate,
  proofreadingDeviationUpdate,
  verificationPLCStatus,
  proofreadingMachineMove,
  rrDeviationUpdate,
} = useIpcSendEvent();


const {
  workshopOptions,
  changePermission,
  comparisonSuccess,
  exitPermission,
  visible,
  password,
  handleCancel,
  manualData,
} = useConfig();
const {autoButton} = useHome();
const {calibrationStatus} = useProofreadingMachine();
const configStore = useConfigStore();

onMounted(() => {
  readModifiableConfigurations()
})

const position = ref<number>(0)

const readyPosition: Array<PositionInterface> = []
for (let i = 0; i < 7; i++) {
  readyPosition.push({
    value: i,
    label: `准备位置${i}`
  })
}

// 密码输入框
const passwordInput = ref();

// 获取焦点
function gainFocus() {
  passwordInput.value.focus();
}

// 通知
const {error} = useNotification();

// 错误通知
function errorNotification(message: string) {
  error({
    title: '错误',
    content: message,
    duration: 5000,
  });
}

// 密码比对
function passwordComparison() {
  if (password.value === "666666") {
    password.value = ""
    return true
  } else {
    errorNotification("密码错误")
    return false
  }
}

</script>

<template>
  <div class="t-h-full t-w-full t-flex t-flex-col">
    <!--  权限  -->
    <div class="t-h-14 t-flex-none t-border t-rounded-md t-m-2 t-px-2 t-flex t-items-center t-gap-2">
      <n-button secondary strong :disabled="changePermission || calibrationStatus || autoButton"
                @click.stop="visible = true">
        <IconAntDesignControlOutlined/>
        获取权限
      </n-button>
      <n-button secondary strong :disabled="!changePermission" @click.stop="exitPermission">
        <IconAntDesignDeleteRowOutlined/>
        退出权限
      </n-button>
    </div>
    <!--  配置框  -->
    <div class="t-grid t-grid-cols-2 t-gap-2 t-flex-auto t-px-2">
      <div class="t-flex t-flex-col t-gap-2 t-text-center t-pb-2">
        <!--  配置250Bini文件地址  -->
        <n-input-group>
          <n-input-group-label class="t-w-1/5">250B配置地址 :</n-input-group-label>
          <n-input readonly placeholder="N/A" class="t-font-mono" v-model:value="configStore.iniConfiguration"/>
          <n-button type="warning" @click.stop="iniConfigurationUpdate" :disabled="!changePermission">
            修改
          </n-button>
        </n-input-group>
        <!--  配置量测标品数据文件地址  -->
        <n-input-group>
          <n-input-group-label class="t-w-1/5">标品数据地址 :</n-input-group-label>
          <n-input readonly placeholder="N/A" class="t-font-mono" v-model:value="configStore.standardProductPath"/>
          <n-button type="warning" @click.stop="standardProductPathUpdate" :disabled="!changePermission">
            修改
          </n-button>
        </n-input-group>
        <!--  配置量测标品数据文件密码  -->
        <n-input-group>
          <n-input-group-label class="t-w-1/5">标品数据密码 :</n-input-group-label>
          <n-input placeholder="N/A" type="password" class="t-font-mono" show-password-on="mousedown"
                   v-model:value="configStore.standardProductPassword"
                   @blur="standardProductPasswordUpdate(configStore.standardProductPassword)"
                   :disabled="!changePermission"/>
        </n-input-group>
        <!--  补偿上下限及验证差值上下限  -->
        <n-input-group>
          <n-input-group-label class="t-w-1/5">补偿值偏差上限 :</n-input-group-label>
          <n-input-number placeholder="N/A" class="t-font-mono"
                          v-model:value="configStore.compensationDeviationUpperLimit"
                          @blur="compensationDeviationUpdate(configStore.compensationDeviationUpperLimit)"
                          :disabled="!changePermission"/>
          <n-input-group-label class="t-w-1/5">验证差值上限 :</n-input-group-label>
          <n-input-number placeholder="N/A" class="t-font-mono"
                          v-model:value="configStore.verificationDeviationUpperLimit"
                          @blur="proofreadingDeviationUpdate(configStore.verificationDeviationUpperLimit)"
                          :disabled="!changePermission"/>
        </n-input-group>
        <n-input-group>
          <n-input-group-label class="t-w-1/5">RR偏差上限 :</n-input-group-label>
          <n-input-number placeholder="N/A" class="t-font-mono"
                          v-model:value="configStore.rrDeviationUpperLimit"
                          @blur="rrDeviationUpdate(configStore.rrDeviationUpperLimit)"
                          :disabled="!changePermission"/>
        </n-input-group>
        <div class="t-flex-auto"></div>
        <div class="t-grid t-grid-cols-4 t-border t-rounded-md t-h-32 t-overflow-hidden t-overflow-y-auto">
          <div v-for="index1 in 4" :key="index1">
            <p class="t-border-b t-py-1 t-border-r last:t-border-r-0">{{ index1 }}</p>
            <div class="t-truncate t-border-r" v-for="(item,index2) in manualData[index1 -1]" :key="index2">
              {{ item[0] }} : {{ item[1] }}
            </div>
          </div>
        </div>
      </div>
      <div class="t-grid t-gap-2 t-grid-rows-4">
        <div class="t-grid t-grid-cols-3">
          <!--  配置查询标品条件  -->
          <n-input-group>
            <n-input-group-label>环境车间 :</n-input-group-label>
            <n-select v-model:value="configStore.currentWorkshop" :consistent-menu-width="false"
                      :options="workshopOptions" @focus="workshopListQuery"
                      @update-value="workshopListUpdate"
                      :disabled="!changePermission"/>
          </n-input-group>
        </div>
        <div class="t-p-2 t-row-span-3 t-m-2 t-border t-rounded-lg t-grid t-grid-cols-3">
          <!--  上下丝杆动作  -->
          <div class="t-col-span-2">
            <p class="t-mb-1">测试头动作 :</p>
            <a-button-group>
              <a-button type="primary" @click.stop="testHeadAction(2)" :disabled="!changePermission">
                测试头上位
              </a-button>
              <a-button type="primary" @click.stop="testHeadAction(1)" :disabled="!changePermission">
                测试头下位
              </a-button>
              <a-button type="primary" @click.stop="testHeadAction(0)" :disabled="!changePermission">
                测试头间距移动
              </a-button>
            </a-button-group>
          </div>
          <!-- 移动到准备位置 -->
          <div>
            <p class="t-mb-1">回原点 :</p>
            <a-button type="primary" status="warning" @click.stop="testHeadAction(3)" :disabled="!changePermission">
              原点归复
            </a-button>
          </div>
          <div class="t-col-span-2">
            <p class="t-mb-1">移动到准备位置 :</p>
            <a-button-group>
              <a-select v-model:model-value="position" :options="readyPosition"
                        :disabled="!changePermission"/>
              <a-button type="primary" status="success" :disabled="!changePermission"
                        @click.stop="manualPosition(position)">
                移动到位置
              </a-button>
            </a-button-group>
          </div>
          <div>
            <p class="t-mb-1">位置移动 :</p>
            <a-button-group>
              <a-button type="primary" :disabled="!changePermission" @click.stop="manualPosition(7)">
                校机位置
              </a-button>
              <a-button type="primary" :disabled="!changePermission" @click.stop="manualPosition(8)">
                对机位置
              </a-button>
            </a-button-group>
          </div>
          <div>
            <p class="t-mb-1">校机位置 :</p>
            <a-button-group>
              <a-button type="primary" :disabled="!changePermission" @click.stop="proofreadingMachineMove(0)">
                0 欧姆
              </a-button>
              <a-button type="primary" :disabled="!changePermission" @click.stop="proofreadingMachineMove(1)">
                50 欧姆
              </a-button>
            </a-button-group>
          </div>
          <div>
            <p class="t-mb-1">对机位置 :</p>
            <a-button-group>
              <a-button type="primary" :disabled="!changePermission" @click.stop="proofreadingMachineMove(2)">
                间距移动
              </a-button>
            </a-button-group>
          </div>
          <div>
            <p class="t-mb-1">量测 :</p>
            <a-button type="primary" status="success" :disabled="!changePermission" @click.stop="onceMeasure">
              一次测试
            </a-button>
          </div>
          <div>
            <p class="t-mb-1">验证 :</p>
            <a-button type="primary" status="success" :disabled="!changePermission" @click.stop="verificationPLCStatus">
              验证PLC链接状态
            </a-button>
          </div>
          <div>
            <p class="t-mb-1">数据 :</p>
            <a-button type="primary" status="warning" :disabled="!changePermission" @click.stop="clearMeasureData">
              清除测量数据
            </a-button>
          </div>
        </div>
      </div>
    </div>
    <a-modal v-model:visible="visible" type="password" :mask-closable="false" title="输入密码" @cancel="handleCancel"
             :on-before-ok="passwordComparison" @ok="comparisonSuccess" @open="gainFocus">
      <a-input-password ref="passwordInput" v-model="password" placeholder="输入密码"/>
    </a-modal>
  </div>
</template>

<style scoped>

</style>