import {computed, reactive, ref} from "vue";
import {use} from "echarts/core";
import {CanvasRenderer} from "echarts/renderers";
import {BarChart} from "echarts/charts";
import {
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    GridComponent,
    MarkLineComponent
} from "echarts/components";

use([
    CanvasRenderer,
    BarChart,
    GridComponent,
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    MarkLineComponent
]);

// 随机数据
// const data = ref([[[0, 0], [1, 1]], [[0, 0], [1, 1]]])
const data: Array<Array<Array<number>>> = reactive([[[0, 1]], [[1, 3]], [[-1, 2]]])
// 查看的行号
const lineNumber = ref<number>(0);

// 重置数据
function resetData() {
    data.length = 0
    for (let i = 0; i < 24; i++) {
        data.push([[]])
    }
}

// 替代数据
function replaceData(value: any) {
    console.log(value)
    data.length = 0;
    data.push(...value)
}

// 全局echarts配置
const globalOptions = computed(() => {
    return {
        tooltip: {
            trigger: "axis",
            axisPointer: {
                type: "shadow"
            }
        },
        xAxis: [
            {
                type: "value",
                min: -10,
                max: 10,
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
                data: data[0],
                markLine: {
                    symbol: 'none',
                    data: [
                        {
                            lineStyle: {
                                type: "dashed",
                                color: "rgb(236,39,89)"
                            },
                            xAxis: -5
                        },
                        {
                            lineStyle: {
                                type: "dashed",
                                color: "rgb(236,39,89)"
                            },
                            xAxis: 5
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
        tooltip: {
            trigger: "axis",
            axisPointer: {
                type: "shadow"
            }
        },
        xAxis: [
            {
                type: "value",
                min: -10,
                max: 10,
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
                            xAxis: -5
                        },
                        {
                            lineStyle: {
                                type: "dashed",
                                color: "rgb(236,39,89)"
                            },
                            xAxis: 5
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
        resetData,
        replaceData,
        globalOptions,
        subitemOptions,
    }
}

