<script setup lang="ts">
import TopBarMode from "@/view/layout/TopBarMode.vue";
import {zhCN, dateZhCN} from "naive-ui";
import {onMounted} from "vue";
import {useRouter} from "vue-router";
import {storeToRefs} from "pinia";
import {useGlobalStore} from "@/store";
import {useIpcSendEvent} from "@/hooks/useIpcSendEvent.ts";

const router = useRouter()
const {beforeClosingDialogue} = storeToRefs(useGlobalStore())
const {closeWindow} = useIpcSendEvent();
onMounted(() => {
  router.replace({name: 'RootPath'})
})

</script>

<template>
  <div class="t-w-screen t-h-screen t-font-noto t-font-semibold t-tracking-wide">
    <n-config-provider :locale="zhCN" :date-locale="dateZhCN">
      <n-notification-provider :container-style="{marginTop:'40px'}" :max="3" placement="top">
        <top-bar-mode>
          <router-view v-slot="{ Component }">
            <transition enter-from-class="slide-fade-enter-from"
                        leave-to-class="slide-fade-leave-to">
              <keep-alive>
                <component class="child-view" :is="Component"/>
              </keep-alive>
            </transition>
          </router-view>
        </top-bar-mode>
      </n-notification-provider>
    </n-config-provider>
    <a-modal v-model:visible="beforeClosingDialogue" @ok="closeWindow">
      <template #title>
        关闭前确认
      </template>
      <div>
        <p class="t-text-2xl">确定要关闭吗？</p>
      </div>
    </a-modal>
  </div>
</template>

<style scoped>
</style>
