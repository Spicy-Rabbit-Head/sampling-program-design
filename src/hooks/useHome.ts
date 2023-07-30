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
    }
}