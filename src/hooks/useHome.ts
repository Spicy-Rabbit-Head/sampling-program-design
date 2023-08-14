import {computed, reactive, ref} from "vue";
import type {tab} from "@/type/interface.ts";
import {useEcharts} from "@/hooks/useEcharts.ts";
import {useIpcSendEvent} from "@/hooks/useIpcSendEvent.ts";

// 主体表格
const mainTable = reactive<Array<Array<tab>>>([]);
const {updateData} = useEcharts();
const {startAlarm, closeAlarm} = useIpcSendEvent();

// 初始化主体表格
for (let w = 0; w < 11; w++) {
    mainTable.push([]);
    initTable(w);
}

function initTable(w: number) {
    for (let i = 1; i <= 24; i++) {
        for (let j = 1; j <= 32; j++) {
            mainTable[w].push({path: `${i}-${j}`, class: ""});
        }
    }
}

// 实时数据
const realTimeValue = reactive<Array<Array<string>>>([]);
// 当前列
const currentColumn = ref<number>(0);
// 当前行
const currentRow = ref<number>(0);
// 当前盘号
const currentPan = ref<number>(0);
// 报警触发上限
const alarmTriggerUpperLimit = ref<number>(0);
// 报警显示
const visible = ref<boolean>(false);
// 料盘选项
const
    options = [
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
        mainTable[currentPan.value][i].class = "t-bg-red-500";
    }

    // 选中通过
    function selectPass(i: number) {
        mainTable[currentPan.value][i].class = "t-bg-green-600";
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
        if (currentColumn.value == 8) {
            mainTable[0].length = 0;
            alarmTriggerUpperLimit.value = 0;
            initTable(0);
        }
        // 更新视图
        updateRealTimeValue(data[data.length - 1])
        for (let i = 0; i < data.length; i++) {
            computeStatus(data[i], i)
        }
    }

    // 计算状态
    function computeStatus(data: any, index: number) {
        for (let i = 0; i < data.length; i++) {
            let result = 'pass';
            if (data[i][0] === 'FL') {
                if (data[i][2] != 'pass')
                    result = Number(data[i][1]) > 0 ? 'F+' : 'F-';
                updateTableItem(result, index, data)
                updateData(currentRow.value + index, Number(data[i][1]));
            }
        }
    }

    // 更新表格项
    function updateTableItem(result: string, index: number, data: any) {
        let style = 't-bg-green-600';
        switch (result) {
            case 'pass':
                style = "t-bg-green-600";
                break;
            case 'F+':
                alarmTriggerUpperLimit.value++;
                style = "t-bg-red-500";
                break;
            case 'F-':
                alarmTriggerUpperLimit.value++;
                style = "t-bg-blue-500";
                break;
        }
        let position = (currentRow.value + index) * 32 + currentColumn.value;
        mainTable[currentPan.value][position].class = style;
        mainTable[0][position].class = style;
        mainTable[currentPan.value][position].data = data;
        mainTable[0][position].data = data;
        if (alarmTriggerUpperLimit.value > 10) {
            startAlarm();
            visible.value = true;
        }
    }

    // 更新实时数据
    function updateRealTimeValue(data: any) {
        realTimeValue.length = 0
        realTimeValue.push(...data)
    }

    // 写入起始位置
    function writeStartBit(data: any) {
        currentColumn.value = data[0]
        currentRow.value = data[1]
        currentPan.value = data[2]
    }

    // 初始化数据
    function initTableData(data: any) {
        try {
            if (data == null) return;
            if (data.length == 0) return;
            mainTable.length = 0
            mainTable.push(...data)
        } catch {
            console.log('初始化数据失败')
        }
    }

    // 清除报警
    function stopAlarm() {
        alarmTriggerUpperLimit.value = 0;
        closeAlarm();
        console.log(alarmTriggerUpperLimit.value)
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
        writeStartBit,
        initTableData,
        visible,
        stopAlarm,
    }
}