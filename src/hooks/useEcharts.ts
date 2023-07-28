import {computed, reactive, ref} from "vue";
import {use} from "echarts/core";
import {CanvasRenderer} from "echarts/renderers";
import {BarChart} from "echarts/charts";
import {GridComponent, LegendComponent, MarkLineComponent, TitleComponent, TooltipComponent} from "echarts/components";

use([
    CanvasRenderer,
    BarChart,
    GridComponent,
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    MarkLineComponent
]);

// 数据
const data: Array<Array<Array<number>>> = reactive([]);
// 测试上下限
const testLimit = reactive([5, -5])
// 平整后的数据
const flattenedData = computed(() => {
    const list: Array<Array<number>> = [];
    data.forEach((item) => {
        list.push(...item);
    })
    return list;
})

// 查看的行号
const lineNumber = ref<number>(0);

// 重置数据
function resetData() {
    data.length = 0
    for (let i = 0; i < 24; i++) {
        data.push([[]])
    }
}

resetData()

// 替代数据
function replaceData(value: any) {
    console.log(value)
    data.length = 0;
    data.push(...value)
}

// 限制数据更新
function updateLimitData(list: Array<any>) {
    testLimit.length = 0
    testLimit.push(...list)
}

// 全局echarts配置
const globalOptions = computed(() => {
    return {
        title: {
            text: '全局数据'
        },
        tooltip: {
            trigger: "axis",
            axisPointer: {
                type: "shadow"
            }
        },
        xAxis: [
            {
                type: "value",
                max: testLimit[0] + 5,
                min: testLimit[1] - 5,
            }
        ],
        yAxis: [
            {
                type: "value",
            },
        ],
        series: [
            {
                type: "bar",
                barWidth: 6,
                data: flattenedData.value,
                markLine: {
                    symbol: 'none',
                    data: [
                        {
                            lineStyle: {
                                type: "dashed",
                                color: "rgb(236,39,89)"
                            },
                            xAxis: testLimit[0]
                        },
                        {
                            lineStyle: {
                                type: "dashed",
                                color: "rgb(236,39,89)"
                            },
                            xAxis: testLimit[1]
                        }
                    ]
                }
            }
        ]
    };
})

// 分项echarts配置
const subitemOptions = computed(() => {
    return {
        title: {
            text: `第${lineNumber.value + 1}行数据`,
        },
        tooltip: {
            trigger: "axis",
            axisPointer: {
                type: "shadow"
            }
        },
        xAxis: [
            {
                type: "value",
                max: testLimit[0] + 5,
                min: testLimit[1] - 5,
            }
        ],
        yAxis: [
            {
                type: "value",
            },
        ],
        series: [
            {
                type: "bar",
                barWidth: 6,
                data: data[lineNumber.value],
                markLine: {
                    symbol: 'none',
                    data: [
                        {
                            lineStyle: {
                                type: "dashed",
                                color: "rgb(236,39,89)"
                            },
                            xAxis: testLimit[0]
                        },
                        {
                            lineStyle: {
                                type: "dashed",
                                color: "rgb(236,39,89)"
                            },
                            xAxis: testLimit[1]
                        }
                    ]
                }
            }
        ]
    };
})

export function useEcharts() {
    return {
        lineNumber,
        data,
        replaceData,
        updateLimitData,
        globalOptions,
        subitemOptions,
    }
}

