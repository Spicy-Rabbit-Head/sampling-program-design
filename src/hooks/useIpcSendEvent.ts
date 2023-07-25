import {useIpcRenderer} from "@vueuse/electron";
import {useProofreadingMachine} from "@/hooks/useProofreadingMachine.ts";

const {send} = useIpcRenderer();
const {calibrationStarts, initSteps, initDataBase} = useProofreadingMachine();

export function useIpcSendEvent() {
    // 渲染进程初始化
    function renderThreadInitialization() {
        send('render-send-init');
    }

    // 渲染进程发起DLL初始化
    function dllInitialization() {
        send('render-send-dll-init');
    }

    // 开启文件选择对话框-读取QCC文件
    function readNumberFile() {
        send('render-send-open-qcc-dialog');
    }

    // 窗口功能
    function topBarFunction(i: number) {
        switch (i) {
            case 0:
                send('render-send-window-min')
                break
            case 1:
                send('render-send-window-restore')
                break
            case 2:
                send('render-send-window-max')
                break
            case 3:
                send('render-send-window-close')
                break
        }
    }

    // 确认关闭窗口
    function closeWindow() {
        send('render-send-close-server')
    }

    // 校准模式更新
    function calibrationModeUpdate(value: string) {
        send('render-send-set-store', 'currentCalibrationMode', value);
    }

    // 校准运行模式更新
    function proofreadingOperationModeUpdate(value: number) {
        console.log(value)
        send('render-send-set-store', 'proofreadingOperationMode', value);
    }

    // 读取250BINI配置
    function readIniConfiguration() {
        send('render-send-read-ini');
    }

    // 250BINI配置更新
    function iniConfigurationUpdate() {
        send('render-send-open-ini-dialog');
    }

    // 读取可修改配置
    function readModifiableConfigurations() {
        send('render-send-read-configuration');
    }

    // 标品路径更新
    function standardProductPathUpdate() {
        send('render-send-open-standard-dialog');
    }

    // 标品数据密码更新
    function standardProductPasswordUpdate(value: string) {
        send('render-send-set-store', 'standardProductPassword', value);
    }

    // 校对机标品数据
    function standardProductUpdate(value: any) {
        send('render-send-set-store', 'outputDisplay', JSON.stringify(value));
    }

    // 标品数据查询
    function standardProductQuery(file: string) {
        send('render-send-standard-query', file);
    }

    // 车间列表查询
    function workshopListQuery() {
        send('render-send-workshop-list-query');
    }

    // 当前车间选项更新
    function workshopListUpdate(value: any, data: any) {
        send('render-send-set-store', 'currentWorkshop', value);
        send('render-send-set-store', 'location', data.location);
    }

    // 自动校准开始
    function automaticCalibrationStarts() {
        calibrationStarts();
        initSteps();
        initDataBase();
        send('render-send-calibration-short-circuit-start');
    }

    // 丝杆动作
    function screwAction(i: number) {
        send('render-send-screw-action', i);
    }

    // 缓存数据保存
    function cacheDataSave(s: string) {
        send('render-send-cache-data-save', s);
    }

    // 缓存数据读取
    function cacheDataRead() {
        send('render-send-cache-data-read');
    }

    return {
        renderThreadInitialization,
        dllInitialization,
        readNumberFile,
        topBarFunction,
        calibrationModeUpdate,
        readIniConfiguration,
        readModifiableConfigurations,
        standardProductPathUpdate,
        standardProductPasswordUpdate,
        iniConfigurationUpdate,
        standardProductQuery,
        workshopListQuery,
        standardProductUpdate,
        workshopListUpdate,
        automaticCalibrationStarts,
        screwAction,
        proofreadingOperationModeUpdate,
        cacheDataSave,
        cacheDataRead,
        closeWindow,
    }
}