import {FunctionalComponent, SVGAttributes} from 'vue'

// 窗口操作
export type TopBarWindow = FunctionalComponent<SVGAttributes>

// 菜单
export type MenuOptions = {
    label: string,
    key: string,
    class: string
}