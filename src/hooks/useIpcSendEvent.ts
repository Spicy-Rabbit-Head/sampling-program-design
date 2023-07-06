import {useIpcRenderer} from "@vueuse/electron";

const {send} = useIpcRenderer()

export function useIpcSendEvent() {
    // 开启文件选择对话框-读取QCC文件
    function ReadNumberFile() {
        send('main-send-open-file-dialog');
    }

    return {
        ReadNumberFile,
    }
}