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
    data?: Array<Array<string>>
}

// 窗口缓存
export type WindowCache = {
    main: BrowserWindow | null
}

// 步骤
export type Step = {
    current?: number
    currentStatus?: StepsProps['status']
    name?: string
    content?: {
        name: string
        content: string
    }[]
}

// 全局共享
export type GlobalStoreInterface = {
    topBarWindowState: Array<boolean>,
    filePath: string,
    currentAddress: string,
    currentCalibrationMode: string,
    calibrationMode: Array<SelectOption>
    proofreadingOperationMode: number,
    outputDisplay: Array<OutputDisplayInterface>,
    beforeClosingDialogue: boolean,
    spotTestBit: {
        start: number,
        end: number
    },
    spotTestColumn: {
        start: number,
        end: number
    },
    spotTestMode: string,
    complement: Array<string>,
}

// 配置文件
export type ConfigStoreInterface = {
    iniConfiguration: string,
    standardProductPath: string,
    standardProductPassword: string,
    currentWorkshop: string,
    compensationDeviationUpperLimit: number,
    verificationDeviationUpperLimit: number,
}

// 标品状态
export type StandardProductsInterface = {
    label: string,
    value: string,
}

// 输出展示
export  type OutputDisplayInterface = {
    label: string,
    value: string,
}

// 表格数据
export type DataBaseInterface = {
    key: string,
    value: string,
    style: string,
}

// 位置
export type PositionInterface = {
    value: number,
    label: string,
}