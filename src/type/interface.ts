import {FunctionalComponent, SVGAttributes} from 'vue'

// 窗口操作
export type WindowFunction = {
    icon: FunctionalComponent<SVGAttributes>,
    state: boolean,
}