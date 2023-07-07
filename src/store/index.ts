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
            // 当前文件路径
            filePath: '',
            // 当前端口
            currentPort: '',
            // 当前地址
            currentAddress: '',
            // 通讯端口选择
            portSelection: [],
            // 当前校准模式
            currentCalibrationMode: '',
            // 校准模式
            calibrationMode: [],
            // 当前通讯模式
            communicationMode: ''
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