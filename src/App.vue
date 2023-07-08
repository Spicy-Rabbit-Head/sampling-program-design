<script setup lang="ts">
import TopBarMode from "@/view/layout/TopBarMode.vue";
import {zhCN, dateZhCN} from "naive-ui";

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
  </div>
</template>

<style scoped>
</style>
