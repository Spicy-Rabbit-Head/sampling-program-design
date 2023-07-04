import {defineStore} from "pinia";
import {GlobalStoreInterface} from "@/type/interface.ts";


export const useGlobalStore = defineStore('GlobalStore', {
    state: (): GlobalStoreInterface => {
        return {
            // 窗口功能状态
            topBarWindowState: [
                true,
                false,
                true,
                true
            ]
        }
    },
    actions: {}
})