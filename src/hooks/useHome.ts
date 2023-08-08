import {computed, reactive, ref} from "vue";
import type {tab} from "@/type/interface.ts";

// 主体表格
const mainTable = reactive<Array<tab>>([]);

// 初始化主体表格
for (let i = 1; i <= 24; i++) {
    for (let j = 1; j <= 32; j++) {
        mainTable.push({path: `${i}-${j}`, class: ""});
    }
}

const realTimeValue = reactive<Array<Array<string>>>([]);

// 料盘选项
const options = [
    {
        label: '实时',
        value: 0,
    },
]

// 初始化选项列表
for (let i = 1; i <= 2; i++) {
    for (let j = 1; j <= 5; j++) {
        options.push({
            label: `${i}-${j}`,
            value: options.length,
        })
    }
}

// 自动运行
const autoButton = ref<boolean>(false);

// 当前选中的料盘
const optionsValue = ref<number>(0);

// 当前选中的料盘展示
const optionsExhibition = computed<string>(() => {
    return optionsValue ? 'Carrier' + options[optionsValue.value].label : '';
})

export function useHome() {
    // 选中异常
    function select(i: number) {
        mainTable[i].class = "t-bg-red-500";
    }

    // 选中通过
    function selectPass(i: number) {
        mainTable[i].class = "t-bg-green-600";
    }

    // 启动
    function startSwitch() {
        autoButton.value = true
    }

    // 关闭
    function stopSwitch() {
        autoButton.value = false
    }

    // 更新视图
    function updateView(data: any) {
        if (data == null) {
            console.log('数据为空')
            return
        }
        // TODO: 更新视图
        updateRealTimeValue(data[data.length - 1])
        for (let i = 0; i < data.length; i++) {
            console.log(data[i])
        }
    }

    // 更新实时数据
    function updateRealTimeValue(data: any) {
        realTimeValue.length = 0
        realTimeValue.push(...data)
        console.log(realTimeValue[0])
    }

    return {
        mainTable,
        select,
        selectPass,
        autoButton,
        startSwitch,
        options,
        optionsValue,
        optionsExhibition,
        stopSwitch,
        updateView,
        realTimeValue,
    }
}