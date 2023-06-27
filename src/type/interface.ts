import {FunctionalComponent, SVGAttributes} from 'vue'
import {StepsProps} from "naive-ui";

// 窗口操作
export type TopBarWindow = FunctionalComponent<SVGAttributes>

// 菜单
export type MenuOptions = {
    label: string,
    key: string,
    class: string
}

// 状态概述
export type StatusOverview = {
    label: string,
    bgColor: string,
}

// 日志
export type Log = {
    time: string,
    content: string,
}

// 步骤
export type Step = {
    current: number
    currentStatus: StepsProps['status']
    name: string
    content: {
        name: string
        content: string
    }[]
}
