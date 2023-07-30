<script setup lang="ts">
import IconAntDesignControlOutlined from "~icons/ant-design/control-outlined"
import IconAntDesignDeleteRowOutlined from "~icons/ant-design/delete-row-outlined"
import {onMounted, ref, watch} from "vue";
import {useIpcSendEvent} from "@/hooks/useIpcSendEvent.ts";
import {useConfig} from "@/hooks/useConfig.ts";
import {useHome} from "@/hooks/useHome.ts";
import {useProofreadingMachine} from "@/hooks/useProofreadingMachine.ts";
import {useConfigStore} from "@/store";

const {
  readModifiableConfigurations,
  standardProductPathUpdate,
  standardProductPasswordUpdate,
  iniConfigurationUpdate,
  workshopListQuery,
  workshopListUpdate,
  screwAction,
} = useIpcSendEvent();


const {
  workshopOptions,
  changePermission,
  comparisonSuccess,
  exitPermission,
  visible,
  passwordComparison,
  password,
  handleCancel,
} = useConfig();
const {autoButton} = useHome();
const {calibrationStatus} = useProofreadingMachine();
const configStore = useConfigStore();

onMounted(() => {
  readModifiableConfigurations()
})

const readyPosition: Array<string> = []
for (let i = 0; i < 7; i++) {
  readyPosition.push(`准备位置 ${i}`)
}

// 密码输入框
const passwordInput = ref();

// 获取焦点
function gainFocus() {
  passwordInput.value.focus();
}

// watch(autoButton, (value) => {
//   if (value) {
//     exitPermission()
//   }
// })

watch(calibrationStatus, (value) => {
  if (value) {
    exitPermission()
  }
})

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
      <div class="t-flex t-flex-col t-gap-2 t-text-center">
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
      </div>
      <div class="t-grid t-gap-2">
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
        <div class="t-p-2 t-m-2 t-border t-rounded-lg t-grid t-grid-cols-3">
          <!--  上下丝杆动作  -->
          <div class="t-col-span-2">
            <p class="t-mb-1">测试头动作 :</p>
            <a-button-group>
              <a-button type="primary" @click.stop="screwAction(0)" :disabled="!changePermission">
                测试头上位
              </a-button>
              <a-button type="primary" @click.stop="screwAction(1)" :disabled="!changePermission">
                测试头下位
              </a-button>
              <a-button type="primary" @click.stop="screwAction(2)" :disabled="!changePermission">
                测试头间距移动
              </a-button>
            </a-button-group>
          </div>
          <!-- 移动到准备位置 -->
          <div>
            <p class="t-mb-1">回原点 :</p>
            <a-button type="primary" status="warning" :disabled="!changePermission">
              原点归复
            </a-button>
          </div>
          <div class="t-col-span-2">
            <p class="t-mb-1">移动到准备位置 :</p>
            <a-button-group>
              <a-select :options="readyPosition" default-value="准备位置 0" :disabled="!changePermission"/>
              <a-button type="primary" status="success" :disabled="!changePermission">
                移动到位置
              </a-button>
            </a-button-group>
          </div>
          <div>
            <p class="t-mb-1">位置移动 :</p>
            <a-button-group>
              <a-button type="primary" :disabled="!changePermission">
                校机位置
              </a-button>
              <a-button type="primary" :disabled="!changePermission">
                对机位置
              </a-button>
            </a-button-group>
          </div>
        </div>
      </div>
    </div>
    <a-modal v-model:visible="visible" type="password" :mask-closable="false" title="输入密码" @cancel="handleCancel"
             :on-before-ok="passwordComparison" @ok="comparisonSuccess" @open="gainFocus">
      <a-input ref="passwordInput" v-model="password"/>
    </a-modal>
  </div>
</template>

<style scoped>

</style>