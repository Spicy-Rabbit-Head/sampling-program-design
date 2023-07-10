import {reactive, ref} from "vue";
import {Log, Step} from "@/type/interface.ts";

// 校对机开启状态
const calibrationStatus = ref<boolean>(false);

// 标品编号
const standardNumber = ref<string>('2500')

// 自动校对机开始
function calibrationStarts() {
    calibrationStatus.value = true
}

// 自动校对机停止
function automaticCalibrationStop() {
    calibrationStatus.value = false
}

// 日志数据
const logs = reactive<Array<Log>>([
    {
        time: '2021-08-12 12:00:00',
        content: '校对机开启'
    }
])

// 标品状态
const standardProducts = reactive([
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
])

// 校机步骤
const phase = ['短路', '负载', '开路', '对机']

// 对机步骤
const checkTheMachine = ['计算补偿值', '补偿值写入', '验证']

// 校对机步骤数据
const steps: Step[] = reactive<Array<Step>>([])

// 初始化校对机步骤数据
for (let i = 0; i < phase.length; i++) {
    steps.push({
        current: 0,
        currentStatus: 'process',
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

// 输出展示项
const outputDisplay = [
    {
        label: '对机标品编号 :',
        value: 'N/A',
    },
    {
        label: '对机标品值 :',
        value: 'N/A',
    },
    {
        label: '验证标品编号 :',
        value: 'N/A',
    },
    {
        label: '验证标品值 :',
        value: 'N/A',
    }
];

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

    return {
        calibrationStatus,
        calibrationStarts,
        automaticCalibrationStop,
        standardNumber,
        logs,
        standardProducts,
        steps,
        outputDisplay,
        columns,
        dataBase,
        changeColor,
        contextmenuChangeColor,
        updateStandardStatus,
    }
}