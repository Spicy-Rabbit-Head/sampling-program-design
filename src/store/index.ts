import {defineStore} from "pinia";
import {ConfigStoreInterface, GlobalStoreInterface} from "@/type/interface.ts";
import {useIpcSendEvent} from "@/hooks/useIpcSendEvent.ts";
import {useProofreadingMachine} from "@/hooks/useProofreadingMachine.ts";
// 当前文件正则
const regex: RegExp = /\\([^\\.]+)\./;

const {standardProductUpdate} = useIpcSendEvent();
const {updateDataBase} = useProofreadingMachine();
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
            // 当前地址
            currentAddress: '150.110.60.6',
            // 当前校准模式
            currentCalibrationMode: '',
            // 校准模式
            calibrationMode: [],
            // 校对机运行模式
            proofreadingOperationMode: 0,
            // 校对机数据
            outputDisplay: [],
            // 关闭前对话框
            beforeClosingDialogue: false,
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
        // 计算补偿值
        calculatedComplement(data: Array<string>): Array<string> | null {
            let list: Array<string> | null = []
            for (let i = 0; i < 4; i++) {
                let value = (parseFloat(this.outputDisplay[1].value) - parseFloat(data[i])).toFixed(2)
                if (value.length > 2) {
                    updateDataBase(1, i + 1, false, value)
                    return null
                } else {
                    updateDataBase(1, i + 1, true, value)
                }
                list.push(value)
            }
            return list
        },
        // 计算差值判断
        calculateDifference(data: Array<string>) {
            for (let i = 0; i < 4; i++) {
                // 计算两个数之间的差值（取绝对值）
                let difference = Math.abs(Number(this.outputDisplay[2].value) - Number(data[i]));
                if (difference >= 1) {
                    updateDataBase(2, i + 1, false, data[i])
                    return null
                } else {
                    updateDataBase(2, i + 1, true, data[i])
                }
            }
            return true
        }
    },
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