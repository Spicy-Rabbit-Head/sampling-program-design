import {useConfigStore, useGlobalStore} from "@/store";
import {useIpcRenderer} from "@vueuse/electron";
import {useProofreadingMachine} from "@/hooks/useProofreadingMachine.ts";
import {useConfig} from "@/hooks/useConfig.ts";
import {useEcharts} from "@/hooks/useEcharts.ts";
import {useHome} from "@/hooks/useHome.ts";

const {on} = useIpcRenderer()

export function useIpcReceiveEvent() {
    const globalStore = useGlobalStore();
    const configStore = useConfigStore();
    const {
        init,
        step,
        updateStandardStatus,
        calibrationShortCircuitSuccess,
        calibrationLoadSuccess,
        calibrationOpenCircuitSuccess,
        calibrationFail,
        stepsUpdate,
        calibrationSuccess,
        automaticCalibrationStop,
        checkTheMachineFail,
        checkTheMachineSuccess,
        updateDataBase,
        initLogs,
        logs
    } = useProofreadingMachine();
    const {addWorkshopOptions} = useConfig();
    const {updateLimitData} = useEcharts();
    const {updateView} = useHome();

    // 数据初始化
    on('render-receive-init', (_, {
        currentCalibrationMode,
        filePath,
        outputDisplay,
        proofreadingOperationMode,
        spotTestMode,
        spotTestBit,
        spotTestColumn
    }: any) => {
        globalStore.filePath = filePath
        globalStore.currentCalibrationMode = currentCalibrationMode
        globalStore.proofreadingOperationMode = proofreadingOperationMode
        if (outputDisplay == undefined) {
            globalStore.outputDisplay.push(
                {label: "对机标品编号 :", value: "N/A"},
                {label: "对机标:", value: "N/A"},
                {label: "验证标品编号 :", value: "N/A"},
                {label: "验验标品值 :", value: "N/A"}
            )
        } else {
            globalStore.outputDisplay = JSON.parse(outputDisplay)
        }
        if (spotTestMode != undefined) {
            globalStore.spotTestMode = spotTestMode
        }
        if (spotTestBit != undefined) {
            globalStore.spotTestBit = JSON.parse(spotTestBit)
        }
        if (spotTestColumn != undefined) {
            globalStore.spotTestColumn = JSON.parse(spotTestColumn)
        }
        // resetData()
        // if (dataTable == undefined || filePath == undefined) {
        //
        // } else {
        //     event.sender.send('render-send-read-data-table', dataTable)
        // }
    })

    // 读取可修改配置
    on('render-receive-read-configuration', (_, data: any) => {
        configStore.iniConfiguration = data.iniConfiguration
        configStore.standardProductPath = data.standardProductPath
        configStore.standardProductPassword = data.standardProductPassword
        configStore.currentWorkshop = data.currentWorkshop
    })

    // 读取缓存配置
    on('render-receive-read-store', (_, data: any) => {
        init(JSON.parse(data))
    })

    // 显示关闭前确认对话框
    on('render-receive-show-close-confirm-dialog', () => {
        globalStore.beforeClosingDialogue = true
    })

    // 关闭前数据保存
    on('render-receive-save-data', (event) => {
        event.sender.send('render-send-save-log', JSON.stringify(logs))
    })

    // 读取250BINI配置
    on('render-receive-read-ini', (_, data: any) => {
        globalStore.calibrationMode.length = 0
        globalStore.calibrationMode = data
    })

    // 读取250BINI配置错误
    on('render-receive-read-ini-error', (_, data: any) => {
        console.log(data)
    })

    // 双击最大化及最大化按钮事件
    on('render-receive-max-windows', () => {
        globalStore.topBarWindowState[1] = true
        globalStore.topBarWindowState[2] = false
    })

    // 双击最小化及最小化按钮事件
    on('render-receive-min-windows', () => {
        globalStore.topBarWindowState[1] = false
        globalStore.topBarWindowState[2] = true
    })

    // 选择文件-QCC
    on('render-receive-qcc-select-file', (event, path: string) => {
        globalStore.filePath = path
        event.sender.send('render-send-standard-query', globalStore.currentFileName)
        // event.sender.send('render-send-found-data-table', true, globalStore.currentFileName)
    })

    // 选择文件-INI
    on('render-receive-ini-select-file', (_, path: string) => {
        configStore.iniConfiguration = path
    })

    // 选择文件-标品
    on('render-receive-standard-select-file', (_, path: string) => {
        configStore.standardProductPath = path
    })

    // 取消选择文件
    on('render-receive-cancel-select-file', () => {
        console.log('取消选择文件')
    })

    // 标品查询成功
    on('render-receive-standard-query-success', (_, data: any) => {
        updateStandardStatus(data)
    })

    // 标品查询失败
    on('render-receive-standard-query-error', () => {
        let data = [{label: 'N/A', value: '无'}]
        updateStandardStatus(data);
    })

    // 车间列表更新
    on('render-receive-workshop-list-update', (_, workshopList) => {
        addWorkshopOptions(workshopList)
    })

    // 校准阶段失败
    on('render-receive-calibration-progress-error', (_, result) => {
        calibrationFail(result);
    })

    // 校准阶段成功
    on('render-receive-calibration-progress-success', (_, result) => {
        switch (step.value) {
            case 0:
                calibrationShortCircuitSuccess(result);
                break;
            case 1:
                calibrationLoadSuccess(result);
                break;
            case 2:
                calibrationOpenCircuitSuccess(result);
                break;
        }
    })

    // 校准步骤更新
    on('render-receive-step-update', (_, step) => {
        stepsUpdate(step)
    })

    // 校准步骤完成
    on('render-receive-calibration-step-success', () => {
        calibrationSuccess()
    })

    // 对机数据
    on('render-receive-docking-data', (event, data) => {
        stepsUpdate(3)
        if (data == null) {
            checkTheMachineFail(0)
            automaticCalibrationStop()
            return
        }
        for (let i = 0; i < data.length; i++) {
            if (Number(data[i]) > 10000) {
                updateDataBase(0, i + 1, false, data[i])
                checkTheMachineFail(0)
                automaticCalibrationStop()
                return
            } else {
                updateDataBase(0, i + 1, true, data[i])
            }
        }
        // 计算补正值
        let amend = globalStore.calculatedComplement(data)
        if (amend == null) {
            checkTheMachineFail(0)
            automaticCalibrationStop()
            return
        } else {
            checkTheMachineSuccess(0)
            event.sender.send('render-send-write-compensation', amend)
        }
    })

    // 写入补正值成功
    on('render-receive-write-compensation-success', (event) => {
        checkTheMachineSuccess(1)
        event.sender.send('render-send-verification-compensation')
    })

    // 写入补正值失败
    on('render-receive-write-compensation-error', () => {
        checkTheMachineFail(1)
        automaticCalibrationStop()
    })

    // 验证结果
    on('render-receive-reverification-result', (_, data) => {
        if (data == null) {
            checkTheMachineFail(2)
            automaticCalibrationStop()
            return
        }
        if (globalStore.calculateDifference(data) == null) {
            checkTheMachineFail(2)
            automaticCalibrationStop()
            return
        } else {
            checkTheMachineSuccess(2)
            automaticCalibrationStop()
        }
    })

    // 读取测试上下限
    on('render-receive-brake-limit', (_, data) => {
        updateLimitData(data)
    })

    // 读取日志
    on('render-receive-read-log', (_, data) => {
        initLogs(JSON.parse(data))
    })

    // 量测数据
    on('render-receive-measure-data', (_, data) => {
        updateView(data)
    })

    // 起始位置
    on('render-receive-start-position', (_, data) => {
        globalStore.writeStartBit(data);
    })

    // // 读取数据表
    // on('render-receive-read-data-table', (_, data) => {
    //     replaceData(JSON.parse(data))
    // })
}