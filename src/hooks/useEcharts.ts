import {computed, reactive} from "vue";
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
const data: Array<Array<Array<number>>> = reactive([])

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

// 添加随机数据
// function addData() {
//     let s = Math.floor((Math.random() * (3 - -3) + -3) * 10) / 10;
//     let index = data.value.findIndex(item => item[0] === s)
//     console.log(s)
//     if (index && index !== -1 || index === 0) {
//         data.value[index][1] += 1
//     } else {
//         data.value.push([Number(s), 1])
//     }
// }

// setInterval(() => {
//     addData()
// }, 1000)

// echarts配置
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

export function useEcharts() {
    return {
        data,
        resetData,
        replaceData,
        globalOptions
    }
}

