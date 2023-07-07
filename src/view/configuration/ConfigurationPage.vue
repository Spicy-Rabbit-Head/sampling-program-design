<script setup lang="ts">
import IconAntDesignControlOutlined from "~icons/ant-design/control-outlined"
import IconAntDesignDeleteRowOutlined from "~icons/ant-design/delete-row-outlined"
import {onMounted, ref} from "vue";
import {useConfigStore} from "@/store";
import {useIpcSendEvent} from "@/hooks/useIpcSendEvent.ts";

const changePermission = ref<boolean>(false)
const {
  ReadModifiableConfigurations,
  StandardProductPathUpdate,
  standardProductPasswordUpdate,
  IniConfigurationUpdate,
} = useIpcSendEvent();

const configStore = useConfigStore();
onMounted(() => {
  ReadModifiableConfigurations()
})
// 密码输入框是否显示
const visible = ref(false)
// 密码
const password = ref("")

// 取消按钮
function HandleCancel() {
  visible.value = false
  password.value = ""
}

// 密码比对
function PasswordComparison() {
  if (password.value === configStore.permissionPassword) {
    changePermission.value = true
    password.value = ""
    return true
  } else {
    changePermission.value = false
    return false
  }
}

// 退出权限
function ExitPermission() {
  changePermission.value = false
}

</script>

<template>
  <div class="t-h-full t-w-full t-flex t-flex-col">
    <div class="t-h-14 t-flex-none t-border t-rounded-md t-m-2 t-px-2 t-flex t-items-center t-gap-2">
      <n-button secondary strong :disabled="changePermission" @click.stop="visible = true">
        <IconAntDesignControlOutlined/>
        获取权限
      </n-button>
      <n-button secondary strong :disabled="!changePermission" @click.stop="ExitPermission">
        <IconAntDesignDeleteRowOutlined/>
        退出权限
      </n-button>
    </div>
    <div class="t-grid t-grid-cols-2 t-gap-2 t-flex-auto t-px-2">
      <div class="t-flex t-flex-col t-gap-2 t-text-center">
        <n-input-group>
          <n-input-group-label class="t-bg-gray-100 t-w-1/5">250B配置地址 :</n-input-group-label>
          <n-input readonly placeholder="N/A" class="t-font-mono" v-model:value="configStore.iniConfiguration"/>
          <n-button type="warning" @click.stop="IniConfigurationUpdate" :disabled="!changePermission">
            修改
          </n-button>
        </n-input-group>
        <n-input-group>
          <n-input-group-label class="t-bg-gray-100 t-w-1/5">标品数据地址 :</n-input-group-label>
          <n-input readonly placeholder="N/A" class="t-font-mono" v-model:value="configStore.standardProductPath"/>
          <n-button type="warning" @click.stop="StandardProductPathUpdate" :disabled="!changePermission">
            修改
          </n-button>
        </n-input-group>
        <n-input-group>
          <n-input-group-label class="t-bg-gray-100 t-w-1/5">标品数据密码 :</n-input-group-label>
          <n-input placeholder="N/A" type="password" class="t-font-mono" show-password-on="mousedown"
                   v-model:value="configStore.standardProductPassword"
                   @blur="standardProductPasswordUpdate(configStore.standardProductPassword)"
                   :disabled="!changePermission"/>
        </n-input-group>
      </div>
      <div class="t-bg-red-400">
        {{ visible }}
      </div>
    </div>
    <a-modal v-model:visible="visible" type="password" :mask-closable="false" title="输入密码" @cancel="HandleCancel"
             :on-before-ok="PasswordComparison">
      <a-input v-model="password"/>
    </a-modal>
  </div>
</template>

<style scoped>

</style>