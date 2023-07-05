import {useIpcRendererOn} from "@vueuse/electron";
import {useGlobalStore} from "@/store";

export function useIpcRendererEvent() {
    const globalStore = useGlobalStore();

    // 双击最大化及最大化按钮事件
    useIpcRendererOn('main-max-windows', () => {
        globalStore.topBarWindowState[1] = true
        globalStore.topBarWindowState[2] = false
    })
    // 双击最小化及最小化按钮事件
    useIpcRendererOn('main-min-windows', () => {
        globalStore.topBarWindowState[1] = false
        globalStore.topBarWindowState[2] = true
    })

    // 选择文件
    useIpcRendererOn('main-select-file', (_, path: string) => {
        if (path.length == 1) {
            globalStore.filePath = path[0]
        } else {
            console.log('请勿选择多个文件')
        }
    })
}