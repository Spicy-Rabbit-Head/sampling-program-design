<script setup lang="ts">
import {useGlobalStore} from "@/store";
import {useIpcSendEvent} from "@/hooks/useIpcSendEvent.ts";
import {MenuOptions, TopBarWindow} from "@/type/interface.ts";
import IconAntDesignMinusOutlined from "~icons/ant-design/minus-outlined"
import IconAntDesignBlockOutlined from "~icons/ant-design/block-outlined"
import IconAntDesignBorderOutlined from "~icons/ant-design/border-outlined"
import IconAntDesignCloseOutlined from "~icons/ant-design/close-outlined"
import {reactive} from "vue";
import {useRouter} from "vue-router";

const router = useRouter()

const {topBarWindowState} = useGlobalStore()

const {topBarFunction} = useIpcSendEvent();

// 窗口功能Icon
const topBarWindow: TopBarWindow[] = [
  IconAntDesignMinusOutlined,
  IconAntDesignBlockOutlined,
  IconAntDesignBorderOutlined,
  IconAntDesignCloseOutlined,
]
// 菜单
const menuOptions = reactive<Array<MenuOptions>>([
  {
    label: '首页',
    key: 'Home',
    class: 't-text-emerald-500'
  },
  {
    label: '校对机',
    key: 'Verifier',
    class: ''
  },
  {
    label: '测试图',
    key: 'Display',
    class: ''
  },
  {
    label: '刹车点',
    key: 'TestTuning',
    class: ''
  },
  {
    label: '配置页',
    key: 'ConfigurationPage',
    class: ''
  },
])

// 菜单切换
function tagsToggle(key: string) {
  router.replace({name: key}).then(
      () => {
        menuOptions.forEach(item => {
          if (item.key === key) {
            item.class = 't-text-emerald-500'
          } else {
            item.class = ''
          }
        })
      }
  )
}

</script>
<template>
  <div class="t-flex t-flex-col t-h-screen">
    <div class="t-h-10 t-flex-none t-flex t-items-center t-w-screen t-bg-gray-200">
      <!-- 标题 -->
      <div style="-webkit-app-region: drag" class="t-flex-none t-px-1 t-flex t-items-center t-select-none">
        <img src="/img/favicon.ico" class="t-w-6 t-h-6 t-mr-1" alt=""/>
        <span class="t-subpixel-antialiased t-font-semibold">B03抽测程式</span>
      </div>
      <!-- 路由切换 -->
      <div style="-webkit-app-region: drag" class="t-flex-auto t-h-full t-flex t-items-center t-px-4">
        <span v-for="(item ,index) in menuOptions"
              style="-webkit-app-region: no-drag" :key="index"
              @click.stop="tagsToggle(item.key)"
              :class="item.class"
              class="t-mx-4 hover:t-text-emerald-400 t-cursor-pointer">
          {{ item.label }}
        </span>
      </div>
      <!-- 窗口功能 -->
      <div class="t-flex t-flex-none">
        <span v-for="(item,index) in topBarWindowState" :key="index" class="hover:t-text-sky-500">
          <component v-if="item" class="t-mx-1" :is="topBarWindow[index]" @click.stop="topBarFunction(index)"/>
        </span>
      </div>
    </div>
    <!-- 主体 -->
    <div class="t-h-[600px] t-flex-auto t-w-screen t-relative">
      <slot/>
    </div>
  </div>
</template>

<style scoped>

</style>