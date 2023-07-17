import {useConfigStore, useGlobalStore} from "@/store";
import {useIpcRenderer} from "@vueuse/electron";
import {useProofreadingMachine} from "@/hooks/useProofreadingMachine.ts";
import {useConfig} from "@/hooks/useConfig.ts";

const {on} = useIpcRenderer()

export function useIpcReceiveEvent() {
    const globalStore = useGlobalStore();
    const configStore = useConfigStore();
    const {
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
    } = useProofreadingMachine();
    const {addWorkshopOptions} = useConfig();

    // 数据初始化
    on('render-receive-init', (_, data: any) => {
        globalStore.filePath = data.filePath
        globalStore.currentPort = data.currentPort
        globalStore.currentCalibrationMode = data.currentCalibrationMode
        globalStore.communicationMode = data.communicationMode
        globalStore.currentAddress = data.currentAddress
        globalStore.proofreadingOperationMode = data.proofreadingOperationMode
        if (data.outputDisplay == undefined) {
            globalStore.outputDisplay = [
                {
                    label: '对机标品编号 :',
                    value: 'N/A',
                },
                {
                    label: '对机标品值 :',
                    value: 'N/A',
                },
                {
                    label: '验证标品编号 :',
                    value: 'N/A',
                },
                {
                    label: '验证标品值 :',
                    value: 'N/A',
                }
            ]
        } else {
            globalStore.outputDisplay = JSON.parse(data.outputDisplay)
        }
        if (data.dataBase == undefined) {
            globalStore.dataBase = [
                [
                    {
                        key: 'title1',
                        value: '修改前测量',
                        style: ''
                    },
                    {
                        key: 'beforePost1',
                        value: 'N/A',
                        style: ''
                    },
                    {
                        key: 'beforePost2',
                        value: 'N/A',
                        style: ''
                    },
                    {
                        key: 'beforePost3',
                        value: 'N/A',
                        style: ''
                    },
                    {
                        key: 'beforePost4',
                        value: 'N/A',
                        style: ''
                    }
                ],
                [
                    {
                        key: 'title1',
                        value: '补正值',
                        style: ''
                    },
                    {
                        key: 'editPost1',
                        value: 'N/A',
                        style: ''
                    },
                    {
                        key: 'editPost2',
                        value: 'N/A',
                        style: ''
                    },
                    {
                        key: 'editPost3',
                        value: 'N/A',
                        style: ''
                    },
                    {
                        key: 'editPost4',
                        value: 'N/A',
                        style: ''
                    }
                ],
                [
                    {
                        key: 'title1',
                        value: '修改后测量',
                        style: ''
                    },
                    {
                        key: 'afterPost1',
                        value: 'N/A',
                        style: ''
                    },
                    {
                        key: 'afterPost2',
                        value: 'N/A',
                        style: ''
                    },
                    {
                        key: 'afterPost3',
                        value: 'N/A',
                        style: ''
                    },
                    {
                        key: 'afterPost4',
                        value: 'N/A',
                        style: ''
                    }
                ]
            ]
        }
    })

    // 读取可修改配置
    on('render-receive-read-configuration', (event, data: any) => {
        configStore.iniConfiguration = data.iniConfiguration
        configStore.standardProductPath = data.standardProductPath
        configStore.standardProductPassword = data.standardProductPassword
        configStore.permissionPassword = data.permissionPassword
        if (data.permissionPassword == undefined) {
            configStore.permissionPassword = '666666'
            event.sender.send('render-send-set-store', 'permissionPassword', '666666')
        }
        configStore.currentWorkshop = data.currentWorkshop
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

    // 串口列表更新
    on('render-receive-port-list-update', (_, portList: Array<string>) => {
        globalStore.portSelection.length = 0
        portList.forEach((value) => {
            globalStore.portSelection.push({
                label: value,
                value: value
            })
        })
    })

    // 串口列表更新失败
    on('render-receive-port-list-error', (_, error: any) => {
        console.log(error)
    })

    // 选择文件-QCC
    on('render-receive-qcc-select-file', (event, path: string) => {
        globalStore.filePath = path
        event.sender.send('render-send-standard-query', globalStore.currentFileName)
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
        for (let i = 0; i < data.length; i++) {
            if (Number(data[i]) > 10000) {
                globalStore.updateDataBase(0, i + 1, false, data[i])
                // checkTheMachineFail(0)
                // automaticCalibrationStop()
                // return
            } else {
                globalStore.updateDataBase(0, i, true, data[i])
            }
        }
        // TODO: 计算补正值
        globalStore.calculatedComplement(data)
    })
}