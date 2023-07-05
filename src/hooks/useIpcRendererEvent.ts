import {useIpcRenderer} from "@vueuse/electron";
import {useGlobalStore} from "@/store";

const {on, invoke} = useIpcRenderer()

// 读取料号文件
function ReadNumberFile() {
    let filePath = invoke('main-send-open-file-dialog');
    console.log(filePath)
}


export function useIpcRendererEvent() {
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
    on('main-select-file', (_, path: string) => {
        if (path.length == 1) {
            globalStore.filePath = path[0]
        } else {
            console.log('请勿选择多个文件')
        }
    })

    // 取消选择文件
    on('main-cancel-select-file', () => {
        console.log('取消选择文件')
    })


    return {
        ReadNumberFile,
    }
}