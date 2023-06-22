<script setup lang="ts">
import TopBarMode from "@/view/layout/TopBarMode.vue";


</script>

<template>
  <div class="t-w-screen t-h-screen t-font-noto t-font-semibold t-tracking-wide">
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
  </div>
</template>

<style scoped>
</style>
