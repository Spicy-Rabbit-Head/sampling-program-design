import {reactive, ref} from "vue";
import {DataBaseInterface, Log, OutputDisplayInterface, StandardProductsInterface, Step} from "@/type/interface.ts";
import dayjs from 'dayjs'
import {useIpcSendEvent} from "@/hooks/useIpcSendEvent.ts";

const {standardProductUpdate, cacheDataSave} = useIpcSendEvent();

// 校对机开启状态
const calibrationStatus = ref<boolean>(false);

// 标品编号
const standardNumber = ref<string>('2500')

// 校机阶段
const step = ref<number>(0)

// 状态词
const stateWord = ref<string>('等待开始')

// 自动校对机开始
function calibrationStarts() {
    calibrationStatus.value = true
}

// 自动校对机停止
function automaticCalibrationStop() {
    calibrationStatus.value = false
    step.value = 0
    // 持久化数据
    let data = {
        steps: steps,
        outputDisplay: outputDisplay,
        dataBase: dataBase
    }
    cacheDataSave(JSON.stringify(data));
}

// 日志数据
const logs = reactive<Array<Log>>([])

// 标品状态
const standardProducts = reactive<Array<StandardProductsInterface>>([
    {label: 'N/A', value: '无'}
])

// 校机步骤
const phase = ['短路', '负载', '开路', '对机']

// 对机步骤
const checkTheMachine = ['计算补偿值', '补偿值写入', '验证']

// 校对机步骤数据
const steps: Step[] = reactive<Array<Step>>([])

// 校对机数据
const outputDisplay = reactive<Array<OutputDisplayInterface>>([])

// 对机表格数据
const dataBase = reactive<Array<Array<DataBaseInterface>>>([])

// 初始化
function init(data: any) {
    steps.length = 0
    outputDisplay.length = 0
    dataBase.length = 0
    steps.push(...data.steps)
    outputDisplay.push(...data.outputDisplay)
    dataBase.push(...data.dataBase)
}

// 初始化校对机步骤数据
function initSteps() {
    steps.length = 0
    for (let i = 0; i < phase.length; i++) {
        steps.push({
            current: 0,
            currentStatus: 'wait',
            name: phase[i],
            content: []
        })
        if (i === 3) {
            checkTheMachine.forEach(item => {
                steps[i].content.push({
                    name: item,
                    content: '等待中'
                })
            })
        } else {
            for (let j = 1; j <= 4; j++) {
                steps[i].content.push({
                    name: `A${j}`,
                    content: '等待中'
                })
            }
        }
    }
}

initSteps()

// 对机表格项
const columns = [
    {
        title: '对机项',
        dataIndex: 'name',
    },
    {
        title: 'Post A-1',
        dataIndex: 'post1',
    },
    {
        title: 'Post A-2',
        dataIndex: 'post2',
    },
    {
        title: 'Post A-3',
        dataIndex: 'post3',
    },
    {
        title: 'Post A-4',
        dataIndex: 'post4',
    },
];

// 日志输出
function logOutput(content: string) {
    if (logs.length == 200) {
        logs.splice(0, 150)
    }
    logs.push({
        time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        content: content
    })
}

// 校准状态更新
function updateCalibrationStatus(index: number, item: number, i: boolean = true) {
    if (i) {
        steps[index].current = item + 1
        steps[index].currentStatus = 'finish'
        steps[index].content[item].content = '成功'
    } else {
        steps[index].current = item + 1
        steps[index].currentStatus = 'error'
        steps[index].content[item].content = '失败'
    }
}

// 校对机数据更新
function outputDisplayUpdate(data1: any, data2: any) {
    outputDisplay[0].value = data1.label
    outputDisplay[1].value = data1.value
    outputDisplay[2].value = data2.label
    outputDisplay[3].value = data2.value
    standardProductUpdate(outputDisplay)
}

// 对机表格数据更新
function updateDataBase(i1: number, i2: number, i3: boolean, value: string) {
    if (i3) {
        dataBase[i1][i2].style = 't-bg-green-500'
        dataBase[i1][i2].value = value
    } else {
        dataBase[i1][i2].style = 't-bg-red-500'
        dataBase[i1][i2].value = value
    }
}

// 计算补偿值
function calculatedComplement(data: Array<string>): Array<string> | null {
    let list: Array<string> | null = []
    for (let i = 0; i < 4; i++) {
        let value = (parseFloat(outputDisplay[1].value) - parseFloat(data[i])).toFixed(2)
        if (value.length > 2) {
            updateDataBase(1, i + 1, false, value)
            return null
        } else {
            updateDataBase(1, i + 1, true, value)
        }
        list.push(value)
    }
    return list
}

// 计算差值判断
function calculateDifference(data: Array<string>) {
    for (let i = 1; i < 5; i++) {
        // 计算两个数之间的差值（取绝对值）
        let difference = Math.abs(Number(dataBase[2][i].value) - Number(data[i - 1]));
        if (difference >= 1) {
            updateDataBase(2, i, false, data[i - 1])
            return null
        } else {
            updateDataBase(2, i, true, data[i - 1])
        }
    }
    return true
}

export function useProofreadingMachine() {
    // 标品状态更新
    function updateStandardStatus(value: any) {
        standardProducts.length = 0
        standardProducts.push(...value)
    }

    // 校准短路阶段成功
    function calibrationShortCircuitSuccess(item: number) {
        updateCalibrationStatus(0, item)
        logOutput(`短路校准 ${item} 成功`)
    }

    // 校准负载阶段成功
    function calibrationLoadSuccess(item: number) {
        updateCalibrationStatus(1, item)
        logOutput(`负载校准 ${item} 成功`)
    }

    // 校准开路阶段成功
    function calibrationOpenCircuitSuccess(item: number) {
        updateCalibrationStatus(2, item)
        logOutput(`负载校准 ${item} 成功`)
    }

    // 校准阶段失败
    function calibrationFail(item: number) {
        updateCalibrationStatus(step.value, item, false)
        logOutput(`阶段 ${phase[step.value]} : 校准 A${item + 1} 失败`)
        automaticCalibrationStop()

    }

    // 校准步骤更新
    function stepsUpdate(i: number) {
        step.value = i
    }

    // 校准完成
    function calibrationSuccess() {
        logOutput('校准完成')
        automaticCalibrationStop()
    }

    // 对机步骤失败
    function checkTheMachineFail(item: number) {
        updateCalibrationStatus(step.value, item, false)
    }

    // 对机步骤成功
    function checkTheMachineSuccess(item: number) {
        updateCalibrationStatus(step.value, item)
    }

    return {
        init,
        stateWord,
        calibrationStatus,
        calibrationStarts,
        automaticCalibrationStop,
        standardNumber,
        logs,
        standardProducts,
        step,
        steps,
        columns,
        updateStandardStatus,
        calibrationShortCircuitSuccess,
        calibrationLoadSuccess,
        calibrationOpenCircuitSuccess,
        calibrationFail,
        initSteps,
        calibrationSuccess,
        stepsUpdate,
        checkTheMachineFail,
        checkTheMachineSuccess,
        outputDisplayUpdate,
        calculatedComplement,
        calculateDifference,
        updateDataBase,
        outputDisplay,
        dataBase,
    }
}