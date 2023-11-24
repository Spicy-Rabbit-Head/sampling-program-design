import {computed, ComputedRef, reactive, ref} from "vue";
import {Step} from "@/type/interface.ts";
import {TableColumnData} from "@arco-design/web-vue";

const trialSettingSwitch = ref(false)
const column = reactive<Array<number>>([])
const computedColumn = computed(() => {
    return column.slice(startColumn.value - 8, column.length)
})
const startColumn = ref<number>(8);
const stopColumn = ref<number>(8);

function scopeOfJudgment(index: any) {
    stopColumn.value = index;
}

const item = ref(false)

const steps = reactive<Step>({content: []});

function initStep() {
    column.length = 0
    for (let i = 8; i <= 32; i++) {
        column.push(i)
    }
    console.log(column)
    steps.name = '试调'
    steps.current = 0
    steps.currentStatus = 'process'
    steps.content = [
        {
            name: '等待量测文本',
            content: '等待中'
        },
        {
            name: '计算刹车点',
            content: '等待中'
        },
        {
            name: '展示结果',
            content: '等待中'
        }
    ]
}

initStep()

const columns: ComputedRef<Array<TableColumnData>> = computed(() => {
    const columns: Array<TableColumnData> = [
        {
            title: '行编号',
            dataIndex: 'lineNumber',
            fixed: 'left',
            align: 'center',
            width: 100
        },
    ];
    for (let i = startColumn.value; i <= stopColumn.value; i++) {
        columns.push({
            title: `第${i}列测试`,
            dataIndex: `column${i}`,
            align: 'center',
            width: 150
        })
        columns.push({
            title: `第${i}列刹车点`,
            dataIndex: `column${i}`,
            align: 'center',
            width: 150
        })
    }
    columns.push({
        title: '刹车点状态',
        dataIndex: 'decisionState',
        fixed: 'right',
        align: 'center',

        width: 200
    })
    initData()
    return columns
})

const data = reactive<any>([]);

function initData() {
    data.length = 0
    for (let i = 0; i < 24; i++) {
        data.push({
            lineNumber: i + 1,
            decisionState: '未计算'
        })
    }
}

export function useTrialSetting() {
    return {
        trialSettingSwitch,
        steps,
        columns,
        data,
        scopeOfJudgment,
        computedColumn,
        item,
        startColumn,
        column,
        stopColumn,
    }
}