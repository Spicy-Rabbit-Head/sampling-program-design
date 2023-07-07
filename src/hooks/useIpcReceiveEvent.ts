import {useGlobalStore} from "@/store";
import {useIpcRenderer} from "@vueuse/electron";

const {on} = useIpcRenderer()

export function useIpcReceiveEvent() {
    const globalStore = useGlobalStore();
    // 数据初始化
    on('main-receive-init', (_, data: any) => {
        globalStore.filePath = data.filePath
        globalStore.currentPort = data.currentPort
        globalStore.currentCalibrationMode = data.currentCalibrationMode
        globalStore.communicationMode = data.communicationMode
    })

    // 读取250BINI配置
    on('main-receive-read-ini', (_, data: any) => {
        globalStore.calibrationMode.length = 0
        globalStore.calibrationMode = data
    })

    // 读取250BINI配置错误
    on('main-receive-read-ini-error', (_, data: any) => {
        console.log(data)
    })

    // 双击最大化及最大化按钮事件
    on('main-receive-max-windows', () => {
        globalStore.topBarWindowState[1] = true
        globalStore.topBarWindowState[2] = false
    })

    // 双击最小化及最小化按钮事件
    on('main-receive-min-windows', () => {
        globalStore.topBarWindowState[1] = false
        globalStore.topBarWindowState[2] = true
    })

    // 串口列表更新
    on('main-receive-port-list-update', (_, portList: Array<string>) => {
        globalStore.portSelection.length = 0
        portList.forEach((value) => {
            globalStore.portSelection.push({
                label: value,
                value: value
            })
        })
    })

    // 选择文件
    on('main-receive-select-file', (_, path: string) => {
        globalStore.filePath = path
    })

    // 取消选择文件
    on('main-receive-cancel-select-file', () => {
        console.log('取消选择文件')
    })
}