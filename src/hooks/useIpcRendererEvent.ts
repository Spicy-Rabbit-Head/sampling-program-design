import {useIpcRendererOn} from "@vueuse/electron";
import {useGlobalStore} from "@/store";

export function useIpcRendererEvent() {
    const {
        topBarWindowState,
    } = useGlobalStore();

    // 双击最大化及最大化按钮事件
    useIpcRendererOn('main-max-windows', () => {
        topBarWindowState[1] = true
        topBarWindowState[2] = false
    })
    // 双击最小化及最小化按钮事件
    useIpcRendererOn('main-min-windows', () => {
        topBarWindowState[1] = false
        topBarWindowState[2] = true
    })
}