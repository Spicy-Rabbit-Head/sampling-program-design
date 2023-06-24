import {computed, ref} from "vue";
import {use} from "echarts/core";
import {CanvasRenderer} from "echarts/renderers";
import {BarChart} from "echarts/charts";
import {
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    GridComponent
} from "echarts/components";

use([
    CanvasRenderer,
    BarChart,
    GridComponent,
    TitleComponent,
    TooltipComponent,
    LegendComponent
]);

const data = ref([[0, 0]])

function addData() {
    let s = Math.floor((Math.random() * (3 - -3) + -3) * 10) / 10;
    let index = data.value.findIndex(item => item[0] === s)
    console.log(s)
    if (index && index !== -1 || index === 0) {
        console.log(666)
        data.value[index][1] += 1
    } else {
        data.value.push([Number(s), 1])
    }
}

setInterval(() => {
    addData()
}, 1000)

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
            }
        ]
    };
})

export function useEcharts() {
    return {
        option
    }
}

