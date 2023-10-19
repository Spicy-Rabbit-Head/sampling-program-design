// const {func} = require('electron-edge-js');
// const {useIpcRenderer} = require("@vueuse/electron")
// const {join, resolve} = require('path');
const {func} = require('electron-edge-js');
const {join, resolve} = require('path');
import { useIpcRenderer } from "@vueuse/electron";


let environment: any;
if (process.env.VITE_DEV_SERVER_URL) {
    environment = join(resolve() + '/public/dll/Measurement.dll')
} else {
    environment = join(__dirname + '../../../../../Measurement.dll')
}
const url = environment

// 服务方法
// DLL初始化
const Init = func({
    assemblyFile: url,
    typeName: "Measurement.Entrance",
    methodName: "Init",
})

// 启动250B
const OpenMeasuringProgram = func({
    assemblyFile: url,
    typeName: "Measurement.Entrance",
    methodName: "OpenMeasuringProgram",
})

// 关闭250B
const CloseMeasuringProgram = func({
    assemblyFile: url,
    typeName: "Measurement.Entrance",
    methodName: "CloseMeasuringProgram",
})

// 标品数据查询
const GetStandardProductData = func({
    assemblyFile: url,
    typeName: "Measurement.Entrance",
    methodName: "GetStandardProductData",
})

// 校机
const Proofreading = func({
    assemblyFile: url,
    typeName: "Measurement.Entrance",
    methodName: "Proofreading",
})

// 一组测试
const TestOneGroup = func({
    assemblyFile: url,
    typeName: "Measurement.Entrance",
    methodName: "TestOneGroup",
})

// 写入补偿值
const WriteStandardProduct = func({
    assemblyFile: url,
    typeName: "Measurement.Entrance",
    methodName: "WriteStandardProduct",
})

// 获取测试上下限
const GetTestLimit = func({
    assemblyFile: url,
    typeName: "Measurement.Entrance",
    methodName: "GetTestRestrict",
})

// 改变文件
const ChangeFile = func({
    assemblyFile: url,
    typeName: "Measurement.Entrance",
    methodName: "ChangeFile",
})

// 读取量测开始信号
const ReadMeasureStart = func({
    assemblyFile: url,
    typeName: "Measurement.Entrance",
    methodName: "ReadMeasureStart",
})

// 输出量测接收信号
const WriteMeasureEnd = func({
    assemblyFile: url,
    typeName: "Measurement.Entrance",
    methodName: "WriteMeasureEnd",
})

// 开启校对机模式
const OpenProofreadingMode = func({
    assemblyFile: url,
    typeName: "Measurement.Entrance",
    methodName: "OpenProofreadingMode",
})

// 保存校对机数据
const SaveCalibrationData = func({
    assemblyFile: url,
    typeName: "Measurement.Entrance",
    methodName: "SaveCalibrationData",
})

// 输出开路完成信号
const WriteOpenEnd = func({
    assemblyFile: url,
    typeName: "Measurement.Entrance",
    methodName: "WriteOpenEnd",
})

// 关闭测试
const CloseTest = func({
    assemblyFile: url,
    typeName: "Measurement.Entrance",
    methodName: "CloseTest",
})

// 开启自动量测
const OpenAutoMode = func({
    assemblyFile: url,
    typeName: "Measurement.Entrance",
    methodName: "OpenAutoMode",
})

// 测试一组并返回结果
const TestOneGroupData = func({
    assemblyFile: url,
    typeName: "Measurement.Entrance",
    methodName: "TestOneGroupData",
})

// 错误终止
const ErrorStop = func({
    assemblyFile: url,
    typeName: "Measurement.Entrance",
    methodName: "ErrorStop",
})

// 保存文件
const SaveFile = func({
    assemblyFile: url,
    typeName: "Measurement.Entrance",
    methodName: "SaveFile",
})

// 刷新应用程序
const RefreshApplication = func({
    assemblyFile: url,
    typeName: "Measurement.Entrance",
    methodName: "RefreshApplication",
})

// 测试头动作
const TestHeadPosition = func({
    assemblyFile: url,
    typeName: "Measurement.Entrance",
    methodName: "TestHeadPosition",
})

// 手动位置
const ManualPosition = func({
    assemblyFile: url,
    typeName: "Measurement.Entrance",
    methodName: "ManualPosition",
})

// 一次量测
const SingleTest = func({
    assemblyFile: url,
    typeName: "Measurement.Entrance",
    methodName: "SingleTest",
})

// 当前位置
const CurrentPosition = func({
    assemblyFile: url,
    typeName: "Measurement.Entrance",
    methodName: "CurrentPosition",
})

// 当前列
const CurrentColumn = func({
    assemblyFile: url,
    typeName: "Measurement.Entrance",
    methodName: "CurrentColumn",
})

// 清除
const Clear = func({
    assemblyFile: url,
    typeName: "Measurement.Entrance",
    methodName: "Clear",
})

// 开始报警
const StartAlarm = func({
    assemblyFile: url,
    typeName: "Measurement.Entrance",
    methodName: "StartAlarm",
})

// 停止报警
const StopAlarm = func({
    assemblyFile: url,
    typeName: "Measurement.Entrance",
    methodName: "StopAlarm",
})

// 当前盘号
const QueryDisk = func({
    assemblyFile: url,
    typeName: "Measurement.Entrance",
    methodName: "QueryDisk",
})

// 一次测试并返回结果
const MeasureAndReturn = func({
    assemblyFile: url,
    typeName: "Measurement.Entrance",
    methodName: "MeasureAndReturn",
})

// 验证PLC状态
const VerificationPLCStatus = func({
    assemblyFile: url,
    typeName: "Measurement.Entrance",
    methodName: "VerifyPlcConnection",
})

// 服务初始化启动
function ServiceInit(port: string) {
    Init(port, (error: any, result: any) => {
        if (error) {
            send('worker-send-dll-error', '服务初始化失败')
            return
        }
        if (result == true) {
            send('worker-send-dll-success', '服务初始化成功')
        } else {
            send('worker-send-dll-error', '服务初始化失败')
        }
    })
    OpenMeasuringProgram(null, (error: any, result: any) => {
        if (error) send('worker-send-dll-error', '250B启动异常')
        if (result == true) {
            send('worker-send-dll-success', '250B启动成功')
        } else {
            send('worker-send-dll-error', '250B启动异常')
        }
    })
}

// 服务停止
function ServiceStop() {
    CloseMeasuringProgram(null, (error: any, result: any) => {
        if (error) {
            send('worker-send-dll-error', '250B异常')
            return
        }
        if (result == true) {
            send('worker-send-dll-success', '250B停止成功')
        } else {
            send('worker-send-dll-error', '250B停止异常')
        }
    })
}

// 标品数据查询
function StandardProductQuery(path: string, pn: string, location: string, password: string) {
    let portList = [];
    let data = {
        path: path,
        pn: pn,
        location: location,
        password: password
    }
    GetStandardProductData(data, (error: any, result: any) => {
        if (error) {
            portList = null
            send('worker-send-dll-error', '标品数据查询失败');
            return
        }
        portList = result
    })
    return portList;
}

// 校准执行
function CalibrationExecution(step: number, index: number, fixture: string) {
    let data = {
        steps: step,
        portIndex: index,
        fixture: fixture,
    }
    let status: boolean = true;
    Proofreading(data, (error: any, result: any) => {
        if (error || result == null) {
            status = false;
            return
        }
        status = result
    })
    return status;
}

// 一组测试
function TestOneGroupExecution() {
    let i: any;
    TestOneGroup(null, (error: any, result: any) => {
        if (error) {
            console.log(error)
            return
        }
        i = result;
    })
    return i;
}

// 一次对机测试
function TestOneProofreadingExecution(index: any) {
    let i: any;
    MeasureAndReturn(index, (error: any, result: any) => {
        if (error) {
            send('worker-send-dll-error', '一次对机测试失败');
            return
        }
        i = result;
    })
    return i;
}

// 量测一组
function MeasureOneGroupExecution() {
    let i: any;
    TestOneGroupData(null, (error: any, result: any) => {
        if (error) {
            send('worker-send-dll-error', '量测一组失败');
            return
        }
        i = result;
    })
    return i;
}

// 写入补偿值
function WriteStandardProductExecution(data: Array<string>) {
    let str = data.join('_')
    let b: boolean;
    WriteStandardProduct(str, (error: any, result: any) => {
        if (error) {
            send('worker-send-dll-error', '写入补偿值失败');
            b = false
            return
        }
        b = result
    })
    return b;
}

// 判断是否开始量测
function MeasureStart() {
    let state: boolean = false;
    ReadMeasureStart(null, (error: any, result: any) => {
        if (error) {
            send('worker-send-dll-error', '读取量测开始信号失败');
        }
        if (result) {
            state = result;
        }
    })
    return state;
}


// 输出量测结束信号
function MeasureEnd() {
    let status: boolean = false;
    WriteMeasureEnd(null, (error: any, result: any) => {
        if (error) {
            send('worker-send-dll-error', '输出量测结束信号失败');
            return
        }
        status = result;
    })
    return status;
}

// 执行保存
function ExecutionSave() {
    let state: boolean = false;
    SaveFile(null, (error: any, result: any) => {
        if (error) {
            send('worker-send-dll-error', '保存失败');
        }
        state = result;
    })
    return state;
}

// 刷新实例
function RefreshInstance(number: string) {
    let state: boolean = false;
    RefreshApplication(number, (error: any, result: any) => {
        if (error) {
            send('worker-send-dll-error', '刷新实例失败');
        }
        state = result;
    })
    return state;
}

// 起始位置
function StartPosition() {
    let position: Array<number> = [];
    CurrentColumn(null, (error: any, result: any) => {
        if (error) {
            send('worker-send-dll-error', '当前列获取失败');
        }
        position.push(result)
    })
    CurrentPosition(null, (error: any, result: any) => {
        if (error) {
            send('worker-send-dll-error', '当前位置获取失败');
        }
        position.push(result)
    })
    QueryDisk(null, (error: any, result: any) => {
        if (error) {
            send('worker-send-dll-error', '当前盘号获取失败')
        }
        position.push(result)
    })
    return position;
}

const {on, send} = useIpcRenderer();

// 工作进程服务停止
on("worker-receive-stop-service", (event: any) => {
    ServiceStop()
    event.sender.send('worker-send-close')
})

// 工作进程服务初始化启动
on("worker-receive-dll-init", (_: any, port: any) => {
    ServiceInit(port)
})

// 工作进程标品数据查询
on("worker-receive-standard-query", (event: any, path: any, pn: any, location: any, password: any) => {
    let dataList = StandardProductQuery(path, pn, location, password);
    if (dataList == null) {
        // 工作进程标品数据查询失败
        event.sender.send('worker-send-standard-query-error')
        event.sender.send('worker-send-dll-error', '标品数据查询失败');
    } else {
        // 工作进程标品数据查询成功
        event.sender.send('worker-send-standard-query-success', dataList)
    }
})

// 校准开始信号
on("worker-receive-calibration-start", (event: any) => {
    event.sender.send('worker-send-calibration-judgment', MeasureStart())
})

// 工作进程校准执行
on("worker-receive-calibration-execute", (event: any, step: any, fixture: any) => {
    for (let i = 0; i < 4; i++) {
        let n = CalibrationExecution(step, i, fixture);
        if (n) {
            event.sender.send('worker-send-calibration-progress-success', i)
        } else {
            event.sender.send('worker-send-calibration-progress-error', i)
            return
        }
    }
    if (step == 2) {
        let state: boolean = false;
        SaveCalibrationData(null, (error: any, result: any) => {
            if (error) {
                send('worker-send-dll-error', '保存校对机数据失败');
                return
            }
            state = result;
        })
        WriteOpenEnd(null, (error: any, result: any) => {
            if (error) {
                send('worker-send-dll-error', '输出开路完成信号失败');
                state = false;
                return
            }
            state = result;
        })
        if (state) {
            event.sender.send('worker-send-step-success', step)
            return
        } else {
            event.sender.send('worker-send-step-error', step)
            return
        }
    }
    MeasureEnd();
    event.sender.send('worker-send-step-success', step)
})

// 对机开始信号
on("worker-receive-verify-start", (event: any) => {
    event.sender.send('worker-send-verify-judgment', MeasureStart())
})

// 工作进程对机前执行
on("worker-receive-compensate-execute", (event: any) => {
    if (WriteStandardProductExecution(['0', '0', '0', '0'])) {
        event.sender.send('worker-send-standard-write-success')
    }
    event.sender.send('worker-send-dll-error', '写入补偿值失败');
})

// 工作进程对机执行
on("worker-receive-verify-execute", (event: any, index) => {
    // event.sender.send('worker-send-reverification-result', TestOneGroupExecution())
    event.sender.send('worker-send-docking-data', TestOneProofreadingExecution(index))
    MeasureEnd();
})

// 工作进程写入补偿值
on("worker-receive-write-compensation", (event: any, data: any) => {
    if (WriteStandardProductExecution(data)) {
        event.sender.send('worker-send-write-compensation-success')
        return
    }
    event.sender.send('worker-send-write-compensation-error')
})

// 再次验证开始信号
on("worker-receive-reverification-start", (event: any) => {
    event.sender.send('worker-send-reverification-judgment', MeasureStart())
})

// 工作进验证补偿
on("worker-receive-reverification-execute", (event: any, index) => {
    event.sender.send('worker-send-reverification-result', TestOneProofreadingExecution(index))
    MeasureEnd();
})

// 工作进程测试上下限
on("worker-receive-update-limit", (event: any) => {
    let limit: any;
    GetTestLimit(null, (error: any, result: any) => {
        if (error) {
            event.sender.send('worker-send-dll-error', '测试上下限获取失败');
            return
        }
        limit = result
    })
    if (limit == null) return;
    event.sender.send('worker-send-brake-limit', limit)
})

// 工作进程更改文件
on("worker-receive-change-file", (event: any, path: any) => {
    let b: boolean = false;
    ChangeFile(path, (error: any, result: any) => {
        if (error) {
            event.sender.send('worker-send-dll-error', '更改文件失败');
            return
        }
        b = result
    })
    if (!b) return;
    event.sender.send('worker-send-change-file-success')
})

// 设定模式
on("worker-receive-mode", (event: any, mode: any) => {
    let state: boolean = false;
    OpenProofreadingMode(mode, (error: any, result: any) => {
        if (error) {
            event.sender.send('worker-send-dll-error', '模式设定失败');
            return
        }
        state = result;
    })
    if (state) {
        switch (mode) {
            case 0:
            case 1:
                event.sender.send('worker-send-calibration-judgment', MeasureStart())
                break
            case 2:
                event.sender.send('worker-send-compensate-execute')
                break
        }
    }
})

// 关闭自动测试
on("worker-receive-close-auto-test", (event) => {
    let b: boolean = false;
    CloseTest(null, (error: any, result: any) => {
        if (error) {
            event.sender.send('worker-send-dll-error', '关闭自动测试失败');
            return
        }
        b = result
    })
    console.log(b)
})

// 工作进程自动测试
on("worker-receive-start-auto-test", (event) => {
    let b: boolean = false;
    OpenAutoMode(null, (error: any, result: any) => {
        if (error) {
            event.sender.send('worker-send-dll-error', '开启自动测试失败');
            return
        }
        b = result;
    })
    if (b) {
        event.sender.send('worker-send-measure-start-judgment', MeasureStart())
        return;
    }
})

// 量测开始信号
on("worker-receive-measure-start", (event: any) => {
    event.sender.send('worker-send-measure-start-judgment', MeasureStart())
})

// 量测
on("worker-receive-measure-go", (event: any) => {
    event.sender.send('worker-send-start-position', StartPosition())
    event.sender.send('worker-send-measure-data', MeasureOneGroupExecution())
    MeasureEnd();
})

// 错误终止
on("worker-receive-error-stop", (event) => {
    ErrorStop(null, (error: any, result: any) => {
        if (error) {
            event.sender.send('worker-send-dll-error', '错误终止失败');
            return
        }
        console.log(result)
    })
})

// 刷新实例
on("worker-receive-refresh-instance", (_, number: any) => {
    RefreshInstance(number)
})

// 保存
on("worker-receive-save", () => {
    if (ExecutionSave()) {
        send('worker-send-dll-success', '保存成功');
    } else {
        send('worker-send-dll-error', '保存失败');
    }
})

// 测试头动作
on("worker-receive-test-head-action", (event, action: any) => {
    TestHeadPosition(action, (error: any, result: any) => {
        if (error) {
            event.sender.send('worker-send-dll-error', '测试头动作失败');
            return
        }
        if (result == true) {
            send('worker-send-dll-success', '测试头动作执行');
        } else {
            send('worker-send-dll-error', '测试头动作执行失败');
        }
    })
})

// 手动位置
on("worker-receive-manual-position", (event, position: any) => {
    ManualPosition(position, (error: any, result: any) => {
        if (error) {
            event.sender.send('worker-send-dll-error', '手动位置失败');
            return
        }
        send('worker-send-dll-success', `手动位置 ${position} 执行状态: ${result}`);
    })
})

// 一次量测
on("worker-receive-measure-one", (event) => {
    event.sender.send('render-send-manual-measure-data', MeasureOneGroupExecution())
})

// 清除
on("worker-receive-clear", (event) => {
    Clear(null, (error: any, result: any) => {
        if (error) {
            event.sender.send('worker-send-dll-error', '清除失败');
            return
        }
        if (result == true) {
            event.sender.send('worker-send-dll-success', '清除成功');
        } else {
            event.sender.send('worker-send-dll-error', '清除失败');
        }
    })
})

// 开始报警
on("worker-receive-start-alarm", (event) => {
    StartAlarm(null, (error: any, result: any) => {
        if (error) {
            event.sender.send('worker-send-dll-error', '开始报警失败');
            return
        }
        if (result == true) {
            event.sender.send('worker-send-dll-error', '开始报警');
        } else {
            event.sender.send('worker-send-dll-error', '开始报警异常');
        }
    })
})

// 停止报警
on("worker-receive-stop-alarm", (event) => {
    StopAlarm(null, (error: any, result: any) => {
        if (error) {
            event.sender.send('worker-send-dll-error', '停止报警失败');
            return
        }
        if (result == true) {
            event.sender.send('worker-send-dll-success', '停止报警');
        } else {
            event.sender.send('worker-send-dll-error', '停止报警异常');
        }
    })
})

// 验证PLC状态
on("worker-receive-verification-plc-status", (event) => {
    VerificationPLCStatus(null, (error: any, result: any) => {
        if (error) {
            event.sender.send('worker-send-plc-status', result);
            return
        }
        event.sender.send('worker-send-plc-status', result);
    })
})





