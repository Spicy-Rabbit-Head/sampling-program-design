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
    function readNumberFile(path: string) {
        executeSave(path);
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

    // 自动校准停止
    function automaticCalibrationStops() {
        send('render-send-calibration-short-circuit-stop');
    }

    // 刷新实例
    function refreshInstance(number: string) {
        send('render-send-refresh-instance', number);
    }

    // 测试头动作
    function testHeadAction(i: number) {
        send('render-send-test-head-action', i);
    }

    // 手动位置
    function manualPosition(i: number) {
        send('render-send-manual-position', i);
    }

    // 缓存数据保存
    function cacheDataSave(s: string) {
        send('render-send-cache-data-save', s);
    }

    // 缓存数据读取
    function cacheDataRead() {
        send('render-send-cache-data-read');
    }

    // 更新测试数据上下限
    function updateTestDataLimit() {
        send('render-send-update-limit');
    }

    // 初始化日志
    function initLog() {
        send('render-send-init-log');
    }

    // 保存抽测数据
    function saveSpotTestData(spotTestMode: any, spotTestBit: any, spotTestColumn: any) {
        send('render-send-set-store', 'spotTestMode', spotTestMode);
        send('render-send-set-store', 'spotTestBit', JSON.stringify(spotTestBit));
        send('render-send-set-store', 'spotTestColumn', JSON.stringify(spotTestColumn));
    }

    // 关闭自动测试
    function closeAutoTest() {
        send('render-send-close-auto-test');
    }

    // 开启自动测试
    function startAutoTest() {
        send('render-send-start-auto-test');
    }

    // 执行保存
    function executeSave(path: string) {
        refreshInstance(path);
        send('render-send-save');
    }

    // 一次量测
    function onceMeasure() {
        send('render-send-measure-one')
    }

    // 清除量测数据
    function clearMeasureData() {
        send('render-send-clear-measure')
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
        testHeadAction,
        proofreadingOperationModeUpdate,
        cacheDataSave,
        cacheDataRead,
        closeWindow,
        updateTestDataLimit,
        initLog,
        saveSpotTestData,
        closeAutoTest,
        startAutoTest,
        automaticCalibrationStops,
        refreshInstance,
        manualPosition,
        onceMeasure,
        clearMeasureData
    }
}