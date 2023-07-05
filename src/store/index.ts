import {defineStore} from "pinia";
import {GlobalStoreInterface} from "@/type/interface.ts";
// 当前文件正则
const regex: RegExp = /\\([^\\.]+)\./;

export const useGlobalStore = defineStore('GlobalStore', {
    state: (): GlobalStoreInterface => {
        return {
            // 窗口功能状态
            topBarWindowState: [
                true,
                false,
                true,
                true
            ],
            filePath: '',
        }
    },
    getters: {
        // 当前文件名
        currentFileName: (state) => {
            let str = state.filePath.match(regex);
            return str ? str[1] : ''
        }
    },
    actions: {}
})