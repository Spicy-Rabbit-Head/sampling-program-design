<script setup lang="ts">
import {Layout as VexLayout} from "vexip-ui";
import 'vexip-ui/es/css/layout'
import {ref} from "vue";
import {WindowFunction} from "@/type/interface.ts";
import {useIpcRenderer} from "@vueuse/electron";
import IconAntDesignMinusOutlined from "~icons/ant-design/minus-outlined"
import IconAntDesignBlockOutlined from "~icons/ant-design/block-outlined"
import IconAntDesignBorderOutlined from "~icons/ant-design/border-outlined"
import IconAntDesignCloseOutlined from "~icons/ant-design/close-outlined"

const ipcRenderer = useIpcRenderer()

const windowFunction: WindowFunction[] = [
  {
    icon: IconAntDesignMinusOutlined,
    state: true
  },
  {
    icon: IconAntDesignBlockOutlined,
    state: false
  },
  {
    icon: IconAntDesignBorderOutlined,
    state: true
  },
  {
    icon: IconAntDesignCloseOutlined,
    state: true
  },
]

const height = ref(30)

function topBarFunction(i: number) {
  switch (i) {
    case 0:
      ipcRenderer.send('window-min')
      break
    case 1:
      ipcRenderer.send('window-restore')
      windowFunction[1].state = false
      windowFunction[2].state = true
      break
    case 2:
      ipcRenderer.send('window-max')
      windowFunction[1].state = true
      windowFunction[2].state = false
      break
    case 3:
      ipcRenderer.send('window-close')
      break
  }
}

</script>
<template>
  <vex-layout no-aside :style="{'--vxp-layout-header-height': `${height}px`}">
    <template #header-main>
      <div style="-webkit-app-region: drag" class="t-bg-amber-400 t-w-screen">
        Vexip
      </div>
    </template>
    <template #header-user>
      <div class="t-flex t-justify-center t-items-center t-absolute t-right-1">
        <span v-for="(item,index) in windowFunction" @click.stop="topBarFunction(index)" class="hover:t-text-sky-500" :key="index">
          <component v-if="item.state" :is="item.icon" class="t-mx-1"/>
        </span>
      </div>
    </template>
    <template #main>
      <slot/>
    </template>
  </vex-layout>
</template>

<style scoped>

</style>