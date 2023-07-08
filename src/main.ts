import {createApp} from 'vue'
import './style/tailwind.css'
import './style/style.css'
import {createPinia} from "pinia";
import router from "@/router";
import App from './App.vue'
import {Notification} from '@arco-design/web-vue';

const pinia = createPinia()
const app = createApp(App)
// 使用pinia
app.use(pinia)
// 使用路由
app.use(router)
Notification._context = app._context;
import {useIpcReceiveEvent} from "@/hooks/useIpcReceiveEvent.ts";

useIpcReceiveEvent()

app.mount('#app')
