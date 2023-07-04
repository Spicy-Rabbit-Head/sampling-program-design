import {createApp} from 'vue'
import './style/tailwind.css'
import './style/style.css'
import {createPinia} from "pinia";
import router from "@/router";
import App from './App.vue'

const pinia = createPinia()
const app = createApp(App)
// 使用pinia
app.use(pinia)
// 使用路由
app.use(router)
import {useIpcRendererEvent} from "@/hooks/useIpcRendererEvent.ts";
useIpcRendererEvent()

app.mount('#app')
