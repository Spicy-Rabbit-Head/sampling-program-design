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
            // 抽测位
            spotTestBit: {
                start: 0,
                end: 768
            },
            // 抽测列
            spotTestColumn: {
                start: 0,
                end: 31
            },
            // 抽测模式
            spotTestMode: '',
            // 补偿值
            complement: []
        }
    },
    getters: {
        // 当前文件名
        currentFileName: (state) => {
            let str = state.filePath.match(regex);
            return str ? str[1] : ''
        },
        // 当前抽测位展示
        currentModeComputing: ((state) => {
            if (state.spotTestMode == '位模式') {
                return `当前模式: 位模式; 起始位: ${state.spotTestBit.start}; 结束位: ${state.spotTestBit.end}`
            }
            return `当前模式: 列模式; 起始列: ${state.spotTestColumn.start + 1}; 结束列: ${state.spotTestColumn.end + 1}`
        })
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
        calculatedComplement(data: string, index: number): string | null {
            let value =
                parseFloat((parseFloat(this.outputDisplay[1].value) - parseFloat(data)).toFixed(2))
            if (this.judgeComplementRange(value)) {
                updateDataBase(1, index, false, value.toString())
                return null
            } else {
                updateDataBase(1, index, true, value.toString())
            }
            return value.toString();
        },
        // 判断补偿值是否在范围内
        judgeComplementRange(number: number): boolean {
            // 计算目标值的上限和下限
            let upperLimit = parseFloat(this.outputDisplay[1].value) + useConfigStore().compensationDeviationUpperLimit;
            let lowerLimit = parseFloat(this.outputDisplay[1].value) - useConfigStore().compensationDeviationUpperLimit;

            // 判断 number 是否在范围内
            return number >= lowerLimit && number <= upperLimit;
        },
        // 计算差值判断
        calculateDifference(data: string, index: number) {
            // 计算两个数之间的差值（取绝对值）
            let difference = Math.abs(Number(this.outputDisplay[2].value) - Number(data));
            if (difference >= useConfigStore().verificationDeviationUpperLimit) {
                updateDataBase(2, index, false, data)
                return null
            } else {
                updateDataBase(2, index, true, data)
            }
            return true
        },
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
            // 当前车间
            currentWorkshop: '',
            // 补偿偏差上限
            compensationDeviationUpperLimit: 0,
            // 验证偏差上限
            verificationDeviationUpperLimit: 0,
        }
    }
})