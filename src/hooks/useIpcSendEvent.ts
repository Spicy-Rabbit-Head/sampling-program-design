import {useIpcRenderer} from "@vueuse/electron";
import {useProofreadingMachine} from "@/hooks/useProofreadingMachine.ts";

const {send} = useIpcRenderer();
const {calibrationStarts} = useProofreadingMachine();

export function useIpcSendEvent() {
    // 渲染线程初始化
    function renderThreadInitialization() {
        send('main-send-init');
    }

    // DLL初始化
    function dllInitialization() {
        send('main-send-dll-init');
    }

    // 开启文件选择对话框-读取QCC文件
    function readNumberFile() {
        send('main-send-open-qcc-dialog');
    }

    // 端口选择更新
    function portUpdate(value: string) {
        send('main-send-set-store', 'currentPort', value);
    }

    // 窗口功能
    function topBarFunction(i: number) {
        switch (i) {
            case 0:
                send('main-send-window-min')
                break
            case 1:
                send('main-send-window-restore')
                break
            case 2:
                send('main-send-window-max')
                break
            case 3:
                send('main-send-window-close')
                break
        }
    }

    // 校准模式更新
    function calibrationModeUpdate(value: string) {
        send('main-send-set-store', 'currentCalibrationMode', value);
    }

    // 通讯模式更新
    function communicationModeUpdate(value: string) {
        send('main-send-set-store', 'communicationMode', value);
    }

    // 读取串口列表
    function readPortList() {
        send('main-send-get-port-list');
    }

    // 读取250BINI配置
    function readIniConfiguration() {
        send('main-send-read-ini');
    }

    // 250BINI配置更新
    function iniConfigurationUpdate() {
        send('main-send-open-ini-dialog');
    }

    // 读取可修改配置
    function readModifiableConfigurations() {
        send('main-send-read-configuration');
    }

    // 标品路径更新
    function standardProductPathUpdate() {
        send('main-send-open-standard-dialog');
    }

    // 标品数据密码更新
    function standardProductPasswordUpdate(value: string) {
        send('main-send-set-store', 'standardProductPassword', value);
    }

    // 标品数据查询
    function standardProductQuery(file: string) {
        send('main-send-standard-access-query', file);
    }

    // 车间列表查询
    function workshopListQuery() {
        send('main-send-workshop-list-query');
    }

    // 当前车间选项更新
    function workshopListUpdate(value: any, data: any) {
        send('main-send-set-store', 'currentWorkshop', value);
        send('main-send-set-store', 'location', data.location);
    }

    // 自动校准开始
    function automaticCalibrationStarts() {
        calibrationStarts();
        send('main-send-auto-calibration-start');
    }

    return {
        renderThreadInitialization,
        dllInitialization,
        readNumberFile,
        readPortList,
        topBarFunction,
        portUpdate,
        calibrationModeUpdate,
        readIniConfiguration,
        communicationModeUpdate,
        readModifiableConfigurations,
        standardProductPathUpdate,
        standardProductPasswordUpdate,
        iniConfigurationUpdate,
        standardProductQuery,
        workshopListQuery,
        workshopListUpdate,
        automaticCalibrationStarts,
    }
}