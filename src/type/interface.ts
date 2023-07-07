import {FunctionalComponent, SVGAttributes} from 'vue'
import {StepsProps, SelectOption} from "naive-ui";
import type {BrowserWindow} from "electron";

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

// 主体表格
export type tab = {
    path: string,
    class: string,
}

// 窗口缓存
export type WindowCache = {
    main: BrowserWindow | null
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

// 全局共享
export type GlobalStoreInterface = {
    topBarWindowState: Array<boolean>,
    filePath: string,
    currentPort: string,
    currentAddress: string,
    portSelection: Array<SelectOption>
    currentCalibrationMode: string,
    calibrationMode: Array<SelectOption>
    communicationMode: string,
}

// 配置文件
export type ConfigStoreInterface = {
    iniConfiguration: string,
    standardProductPath: string,
    standardProductPassword: string,
    permissionPassword: string,
}