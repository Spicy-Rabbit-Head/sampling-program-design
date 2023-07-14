import {reactive, ref} from "vue";
import {Log, StandardProductsInterface, Step} from "@/type/interface.ts";
import dayjs from 'dayjs'

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

// 对机表格数据
const dataBase = reactive([
    [
        {
            key: 'title1',
            value: '修改前测量',
            style: ''
        },
        {
            key: 'beforePost1',
            value: '0.1',
            style: ''
        },
        {
            key: 'beforePost2',
            value: '0.2',
            style: ''
        },
        {
            key: 'beforePost3',
            value: '0.4',
            style: ''
        },
        {
            key: 'beforePost4',
            value: '0.2',
            style: ''
        }
    ],
    [
        {
            key: 'title1',
            value: '补正值',
            style: ''
        },
        {
            key: 'editPost1',
            value: '0.21',
            style: ''
        },
        {
            key: 'editPost2',
            value: '0.25',
            style: ''
        },
        {
            key: 'editPost3',
            value: '0.42',
            style: ''
        },
        {
            key: 'editPost4',
            value: '0.12',
            style: ''
        }
    ],
    [
        {
            key: 'title1',
            value: '修改后测量',
            style: ''
        },
        {
            key: 'afterPost1',
            value: '0.15',
            style: ''
        },
        {
            key: 'afterPost2',
            value: '0.22',
            style: ''
        },
        {
            key: 'afterPost3',
            value: '0.44',
            style: ''
        },
        {
            key: 'afterPost4',
            value: '0.112',
            style: ''
        }
    ]
]);

// 日志输出
function logOutput(content: string) {
    if (logs.length == 500) {
        logs.splice(0, 300)
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

export function useProofreadingMachine() {
    // 修改颜色
    function changeColor(i1: number, i2: number) {
        if (i2) {
            dataBase[i1][i2].style = 't-bg-red-500'
        }
    }

    // 右键菜单修改颜色
    function contextmenuChangeColor(i1: number, i2: number) {
        if (i2) {
            dataBase[i1][i2].style = 't-bg-green-500'
        }
    }

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
        logOutput(`阶段 ${step.value} 校准 ${item} 失败`)
    }

    // 校准步骤更新
    function stepsUpdate(i: number) {
        step.value = i
    }

    // 校准完成
    function calibrationSuccess() {
        logOutput('校准完成')
    }

    return {
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
        dataBase,
        changeColor,
        contextmenuChangeColor,
        updateStandardStatus,
        calibrationShortCircuitSuccess,
        calibrationLoadSuccess,
        calibrationOpenCircuitSuccess,
        calibrationFail,
        initSteps,
        calibrationSuccess,
        stepsUpdate,
    }
}