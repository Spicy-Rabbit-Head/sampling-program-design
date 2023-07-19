import {computed, ref} from "vue";
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
const data = ref([[0, 0]])

// 添加随机数据
function addData() {
    let s = Math.floor((Math.random() * (3 - -3) + -3) * 10) / 10;
    let index = data.value.findIndex(item => item[0] === s)
    console.log(s)
    if (index && index !== -1 || index === 0) {
        data.value[index][1] += 1
    } else {
        data.value.push([Number(s), 1])
    }
}

setInterval(() => {
    addData()
}, 1000)

// echarts配置
const option = computed(() => {
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
                data: data.value,
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
        option
    }
}

