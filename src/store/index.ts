import {defineStore} from "pinia";
import {ConfigStoreInterface, GlobalStoreInterface} from "@/type/interface.ts";
import {useIpcSendEvent} from "@/hooks/useIpcSendEvent.ts";
// 当前文件正则
const regex: RegExp = /\\([^\\.]+)\./;
const {standardProductUpdate} = useIpcSendEvent();

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
            communicationMode: '',
            // 校对机运行模式
            proofreadingOperationMode: 0,
            // 校对机数据
            outputDisplay: [],
            // 对机表格数据
            dataBase: [],
        }
    },
    getters: {
        // 当前文件名
        currentFileName: (state) => {
            let str = state.filePath.match(regex);
            return str ? str[1] : ''
        }
    },
    actions: {
        // 校对机数据更新
        outputDisplayUpdate(data1: any, data2: any) {
            this.outputDisplay[0].value = data1.label
            this.outputDisplay[1].value = data1.value
            this.outputDisplay[2].value = data2.label
            this.outputDisplay[3].value = data2.value
            standardProductUpdate(this.outputDisplay)
        },

        // 对机表格数据更新
        updateDataBase(i1: number, i2: number, i3: boolean, value: string) {
            if (i3) {
                this.dataBase[i1][i2].style = 't-bg-green-500'
                this.dataBase[i1][i2].value = value
            } else {
                this.dataBase[i1][i2].style = 't-bg-red-500'
                this.dataBase[i1][i2].value = value
            }
        },

        // 计算补偿值
        calculatedComplement(data: Array<string>) {
            for (let i = 0; i < 4; i++) {
                let value = (parseFloat(this.outputDisplay[1].value) - parseFloat(data[i])).toFixed(2)
                this.updateDataBase(1, i + 1, true, value)
                console.log(value)
            }
        }
    }
})


export const useConfigStore = defineStore('ConfigStore', {
    state: (): ConfigStoreInterface => {
        return {
            // 250B配置文件路径
            iniConfiguration: '',
            // 标品配置文件路径
            standardProductPath: '',
            // 标品数据密码
            standardProductPassword: '',
            // 权限密码
            permissionPassword: '',
            // 当前车间
            currentWorkshop: '',
        }
    }
})