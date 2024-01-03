import { defineStore } from "pinia";
import { ConfigStoreInterface, GlobalStoreInterface } from "@/type/interface.ts";
import { useIpcSendEvent } from "@/hooks/useIpcSendEvent.ts";
import { useProofreadingMachine } from "@/hooks/useProofreadingMachine.ts";
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
      this.outputDisplay[2].value = data1.Rr
      this.outputDisplay[3].value = data2.label
      this.outputDisplay[4].value = data2.value
      this.outputDisplay[5].value = data2.Rr
      standardProductUpdate(this.outputDisplay)
    },
    // 计算补偿值
    calculatedComplement(data: any, index: number): string | null {
      let value =
        parseFloat((parseFloat(this.outputDisplay[1].value) - parseFloat(data)).toFixed(2))
      if (this.judgeComplementRange(value)) {
        updateDataBase(2, index, true, value.toString())
      } else {
        updateDataBase(2, index, false, value.toString())
        return null
      }
      return value.toString();
    },
    // 判断补偿值是否在范围内
    judgeComplementRange(number: number): boolean {
      return Math.abs(number) <= useConfigStore().compensationDeviationUpperLimit;
    },
    // 判断RR值是否在范围内
    judgeRRRange(number: any, before: boolean = true): boolean {
      let value;
      if (before) {
        value = parseFloat((parseFloat(this.outputDisplay[2].value) - parseFloat(number)).toFixed(2))
      } else {
        value = parseFloat((parseFloat(this.outputDisplay[5].value) - parseFloat(number)).toFixed(2))
      }
      return Math.abs(value) <= useConfigStore().rrDeviationUpperLimit;
    },
    // 计算差值判断
    calculateDifference(data: Array<string>, index: number) {
      let value =
        parseFloat((parseFloat(this.outputDisplay[4].value) - parseFloat(data[0])).toFixed(2))
      let type = Math.abs(value) <= useConfigStore().verificationDeviationUpperLimit;
      if (type) {
        updateDataBase(3, index, true, data[0])
      } else {
        updateDataBase(3, index, false, data[0])
        return null
      }
      if (this.judgeRRRange(data[1], false)) {
        updateDataBase(4, index, true, data[1])
      } else {
        updateDataBase(4, index, false, data[1])
        return null
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
      // RR偏差上限
      rrDeviationUpperLimit: 0,
    }
  }
})