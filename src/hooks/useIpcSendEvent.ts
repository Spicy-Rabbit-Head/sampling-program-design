import {useIpcRenderer} from "@vueuse/electron";

const {send} = useIpcRenderer()

export function useIpcSendEvent() {
    // 开启文件选择对话框-读取QCC文件
    function ReadNumberFile() {
        send('main-send-open-file-dialog');
    }

    // 端口选择更新
    function PortUpdate(value: string) {
        send('main-send-set-store', 'currentPort', value);
    }

    // 校准模式更新
    function CalibrationModeUpdate(value: string) {
        send('main-send-set-store', 'currentCalibrationMode', value);
    }

    // 通讯模式更新
    function CommunicationModeUpdate(value: string) {
        send('main-send-set-store', 'communicationMode', value);
    }

    // 读取串口列表
    function ReadPortList() {
        send('main-send-get-port-list');
    }

    // 读取250BINI配置
    function ReadIniConfiguration() {
        send('main-send-read-ini');
    }

    return {
        ReadNumberFile,
        ReadPortList,
        PortUpdate,
        CalibrationModeUpdate,
        ReadIniConfiguration,
        CommunicationModeUpdate
    }
}