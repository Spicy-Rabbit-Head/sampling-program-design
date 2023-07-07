import {useIpcRenderer} from "@vueuse/electron";

const {send} = useIpcRenderer()

export function useIpcSendEvent() {
    // 开启文件选择对话框-读取QCC文件
    function ReadNumberFile() {
        send('main-send-open-qcc-dialog');
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

    // 250BINI配置更新
    function IniConfigurationUpdate() {
        send('main-send-open-ini-dialog');
    }

    // 读取可修改配置
    function ReadModifiableConfigurations() {
        send('main-send-read-configuration');
    }

    // 标品路径更新
    function StandardProductPathUpdate() {
        send('main-send-open-standard-dialog');
    }

    // 标品数据密码更新
    function standardProductPasswordUpdate(value: string) {
        send('main-send-set-store', 'standardProductPassword', value);
    }

    // 标品数据查询
    function standardProductQuery(value: string) {
        send('main-send-standard-access-query', value);
    }

    return {
        ReadNumberFile,
        ReadPortList,
        PortUpdate,
        CalibrationModeUpdate,
        ReadIniConfiguration,
        CommunicationModeUpdate,
        ReadModifiableConfigurations,
        StandardProductPathUpdate,
        standardProductPasswordUpdate,
        IniConfigurationUpdate,
        standardProductQuery,
    }
}