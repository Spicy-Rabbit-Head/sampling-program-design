import { useConfigStore, useGlobalStore } from "@/store";
import { useIpcRenderer } from "@vueuse/electron";
import { useProofreadingMachine } from "@/hooks/useProofreadingMachine.ts";
import { useConfig } from "@/hooks/useConfig.ts";
import { useEcharts } from "@/hooks/useEcharts.ts";
import { useHome } from "@/hooks/useHome.ts";
import { useNotification } from "@/hooks/useNotification";
import { useTrialSetting } from "@/hooks/useTrialSetting.ts";

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
    logs,
    stateWordUpdate,
  } = useProofreadingMachine();
  const {addWorkshopOptions, updateManualData} = useConfig();
  const {updateLimitData} = useEcharts();
  const {updateView, writeStartBit, mainTable, initTableData, stopSwitch, origin} = useHome();
  const {successNotification, errNotification} = useNotification();
  const {trialSettingSwitch} = useTrialSetting();
  // 数据初始化
  on('render-receive-init', (_, {
    currentCalibrationMode,
    filePath,
    outputDisplay,
    proofreadingOperationMode,
    spotTestMode,
    spotTestBit,
    spotTestColumn,
    iniConfiguration,
    standardProductPath,
    standardProductPassword,
    currentWorkshop,
    compensationDeviationUpperLimit,
    verificationDeviationUpperLimit,
    rrDeviationUpperLimit
  }: any) => {
    globalStore.filePath = filePath
    globalStore.currentCalibrationMode = currentCalibrationMode
    globalStore.proofreadingOperationMode = proofreadingOperationMode
    if (outputDisplay == undefined) {
      globalStore.outputDisplay.push(
        {label: "对机标品编号 :", value: "N/A"},
        {label: "对机FL :", value: "N/A"},
        {label: "对机RR :", value: "N/A"},
        {label: "验证标品编号 :", value: "N/A"},
        {label: "验证FL :", value: "N/A"},
        {label: "验证RR :", value: "N/A"},
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
    configStore.iniConfiguration = iniConfiguration
    configStore.standardProductPath = standardProductPath
    configStore.standardProductPassword = standardProductPassword
    configStore.currentWorkshop = currentWorkshop
    configStore.compensationDeviationUpperLimit = compensationDeviationUpperLimit
    configStore.verificationDeviationUpperLimit = verificationDeviationUpperLimit
    configStore.rrDeviationUpperLimit = rrDeviationUpperLimit
  })

  // 读取可修改配置
  on('render-receive-read-configuration', (_, data: any) => {
    configStore.iniConfiguration = data.iniConfiguration
    configStore.standardProductPath = data.standardProductPath
    configStore.standardProductPassword = data.standardProductPassword
    configStore.currentWorkshop = data.currentWorkshop
    configStore.compensationDeviationUpperLimit = data.compensationDeviationUpperLimit
    configStore.verificationDeviationUpperLimit = data.verificationDeviationUpperLimit
    configStore.rrDeviationUpperLimit = data.rrDeviationUpperLimit
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
    event.sender.send('render-send-save-measure', JSON.stringify(mainTable))
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
  on('render-receive-docking-data', (event, data, index) => {
    stepsUpdate(3)
    if (data == null || data.length == 0) {
      checkTheMachineFail(0)
      automaticCalibrationStop()
      return
    }
    if (Number(data[0]) > 10000) {
      updateDataBase(0, index, false, data[0])
      checkTheMachineFail(0)
      automaticCalibrationStop()
      return
    } else {
      updateDataBase(0, index, true, data[0])
    }
    if (globalStore.judgeRRRange(data[1])) {
      updateDataBase(1, index, true, data[1])
    } else {
      updateDataBase(1, index, false, data[1])
      checkTheMachineFail(0)
      automaticCalibrationStop()
      return
    }
    // 计算补正值
    let amend = globalStore.calculatedComplement(data, index)
    if (amend == null) {
      checkTheMachineFail(0)
      automaticCalibrationStop()
      return
    } else {
      globalStore.complement.push(amend);
      if (index == 4) {
        checkTheMachineSuccess(0)
        stateWordUpdate('校对机步骤成功')
        event.sender.send('render-send-write-compensation', globalStore.complement.join('_'))
        globalStore.complement.length = 0
        return;
      }
      event.sender.send('worker-send-verify-judgment', false)
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
  on('render-receive-reverification-result', (event, data, index) => {
    if (data == null || data.length == 0) {
      checkTheMachineFail(2)
      automaticCalibrationStop()
      return
    }

    if (globalStore.calculateDifference(data, index) == null) {
      checkTheMachineFail(2)
      automaticCalibrationStop()
      return
    } else {
      if (index == 4) {
        checkTheMachineSuccess(2)
        automaticCalibrationStop()
        return
      }
      event.sender.send('worker-send-reverification-judgment', false)
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

  // 读取量测数据
  on('render-receive-read-measure', (_, data) => {
    initTableData(JSON.parse(data));
  })

  // 量测数据
  on('render-receive-measure-data', (_, data) => {
    updateView(data)
  })

  // 起始位置
  on('render-receive-start-position', (_, data) => {
    writeStartBit(data);
  })

  // 手动量测数据
  on('render-receive-manual-measure-data', (_, data) => {
    updateManualData(data);
  })

  // PLC连接状态
  on('render-receive-plc-status', (_, data) => {
    if (data == true) {
      successNotification('PLC连接正常')
    } else {
      errNotification('PLC连接异常')
    }
  })

  // 消息通知
  on('render-receive-notification-error', (_, data) => {
    errNotification(data)
  })

  // 消息通知
  on('render-receive-notification-success', (_, data) => {
    successNotification(data)
  })

  // 试调开始成功
  on('render-receive-proofreading-start-success', () => {
    trialSettingSwitch.value = true
  })

  // 试调开始失败
  on('render-receive-proofreading-start-error', () => {
    trialSettingSwitch.value = false
  })

  // 试调数据
  on('render-receive-proofreading-data', (_, data) => {
    console.log(data)
  })

  // 试调停止
  on('render-receive-proofreading-stop', () => {
    trialSettingSwitch.value = false
  })

  // 原点恢复
  on('render-receive-check-origin', () => {
    stopSwitch()
    origin.value = true
  })

  // // 读取数据表
  // on('render-receive-read-data-table', (_, data) => {
  //     replaceData(JSON.parse(data))
  // })
}
