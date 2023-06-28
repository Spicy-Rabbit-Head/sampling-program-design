import {reactive, ref} from "vue";
import {Log} from "@/type/interface.ts";

// 校对机开启状态
const calibrationStatus = ref<boolean>(false);
const standardNumber = ref<string>('2500')

// 校对机开启状态反转
function stateReversal() {
    if (calibrationStatus.value) {
        calibrationStatus.value = false
        return
    }
    calibrationStatus.value = true
}

// 当前通讯方式
const communicationMode = ref<string>('ethernet')
// 通讯方式
const modes = [
    {
        label: "串口",
        value: "serialPort"
    },
    {
        label: '以太网',
        value: 'ethernet'
    },
]
// 通讯端口选择
const portSelection = ref([])
// 校准模式
const calibrationMode = ref([
    {
        label: "2",
        value: '1',
    },
])
// 日志数据
const logs = reactive<Array<Log>>([
    {
        time: '2021-08-12 12:00:00',
        content: '校对机开启'
    }
])

const data = [{
    label: '对机编号 :',
    value: '2500',
}];
const standardProducts = [
    {
        label: '23',
        value: '2.1',
    },
    {
        label: '24',
        value: '2.2',
    },
    {
        label: '25',
        value: '2.3',
    }
]

export function useProofreadingMachine() {
    return {
        calibrationStatus,
        stateReversal,
        standardNumber,
        communicationMode,
        modes,
        portSelection,
        calibrationMode,
        logs,
        data,
        standardProducts
    }
}