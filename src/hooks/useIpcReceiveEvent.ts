import {useGlobalStore} from "@/store";
import {useIpcRenderer} from "@vueuse/electron";

const {on} = useIpcRenderer()

export function useIpcReceiveEvent() {
    const globalStore = useGlobalStore();
    // 双击最大化及最大化按钮事件
    on('main-max-windows', () => {
        globalStore.topBarWindowState[1] = true
        globalStore.topBarWindowState[2] = false
    })

    // 双击最小化及最小化按钮事件
    on('main-min-windows', () => {
        globalStore.topBarWindowState[1] = false
        globalStore.topBarWindowState[2] = true
    })

    // 串口列表更新
    on('main-port-list-update', (_, portList: Array<string>) => {
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
        if (path.length == 1) {
            globalStore.filePath = path[0]
        } else {
            console.log('请勿选择多个文件')
        }
    })

    // 取消选择文件
    on('main-receive-cancel-select-file', () => {
        console.log('取消选择文件')
    })
}