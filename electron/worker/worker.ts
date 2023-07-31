// const {func} = require('electron-edge-js');
// const {useIpcRenderer} = require("@vueuse/electron")
// const {join, resolve} = require('path');
const {func} = require('electron-edge-js');
const {join, resolve} = require('path');
import {useIpcRenderer} from "@vueuse/electron";


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

// 获取串口列表
const GetSerialPortList = func({
    assemblyFile: url,
    typeName: "Measurement.Entrance",
    methodName: "GetSerialPortList",
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

// 丝杆动作
const ScrewAction = func({
    assemblyFile: url,
    typeName: "Measurement.Entrance",
    methodName: "ScrewAction",
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

// 获取丝杆位置
const GetScrewState = func({
    assemblyFile: url,
    typeName: "Measurement.Entrance",
    methodName: "GetScrewState",
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

// 服务初始化启动
function ServiceInit(port: string) {
    Init(port, (error: any, result: any) => {
        if (error) {
            console.log(error)
            return
        }
        console.log(result);
    })
    OpenMeasuringProgram(null, (error: any, result: any) => {
        if (error) throw error;
        console.log(result);
    })
}

// 服务停止
function ServiceStop() {
    CloseMeasuringProgram(null, (error: any, result: any) => {
        if (error) {
            console.log(error)
            return
        }
        console.log(result);
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

// 丝杆动作
function ScrewActionExecution(action: number) {
    let i = false;
    ScrewAction(action, (error: any, result: any) => {
        if (error) return
        i = result
    })
    console.log('丝杆动作' + i)
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

// 写入补偿值
function WriteStandardProductExecution(data: Array<string>) {
    let str = data.join('_')
    let b: boolean;
    WriteStandardProduct(str, (error: any, result: any) => {
        if (error) {
            b = false
            return
        }
        b = result
    })
    return b;
}

function ScrewState(i: number) {
    let state: any;
    for (let j = 0; j < 10; j++) {
        GetScrewState(i, (error: any, result: any) => {
            if (error) {
                console.log(error)
                return
            }
            if (result) {
                state = result;
                return
            }
        })
    }
    return state;
}

// 判断是否开始量测
function MeasureStart() {
    let state: boolean = false;
    let status: boolean = true;
    while (status) {
        ReadMeasureStart(null, (error: any, result: any) => {
            console.log(result)
            if (error) {
                console.log(error)
                status = false;
            }
            if (result) {
                state = result;
                status = false;
            }
        })
    }
    return state;
}

// 输出量测结束信号
function MeasureEnd() {
    let status: boolean = false;
    WriteMeasureEnd(null, (error: any, result: any) => {
        if (error) {
            console.log(error)
            return
        }
        status = result;
    })
    return status;
}

// 校对机模式
function ProofreadingMode() {

}

const {on} = useIpcRenderer();

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
    } else {
        // 工作进程标品数据查询成功
        event.sender.send('worker-send-standard-query-success', dataList)
    }
})

// 工作进程校准执行
on("worker-receive-calibration-start", async (event: any, step: any, fixture: any) => {
    if (MeasureStart() != true) {
        console.log('无法执行')
        return
    }
    for (let i = 0; i < 4; i++) {
        let n = CalibrationExecution(step, i, fixture);
        if (n) {
            event.sender.send('worker-send-calibration-progress-success', i)
        } else {
            event.sender.send('worker-send-calibration-progress-error', i)
            return
        }
    }
    if (MeasureEnd()) {
        event.sender.send('worker-send-step-success', step)
    }
})

// 工作进程验证执行
on("worker-receive-validation-start", (event: any) => {
    if (MeasureStart() != true) {
        console.log('无法执行')
        return
    }
    if (WriteStandardProductExecution(['0', '0', '0', '0'])) {
        event.sender.send('worker-send-docking-data', TestOneGroupExecution())
        MeasureEnd();
        return
    }
    // TODO 写入补偿值失败
    ScrewActionExecution(0)
})

// 工作进程丝杆动作
on("worker-receive-screw-action", (_: any, action: any) => {
    ScrewActionExecution(action)
})

// 工作进程写入补偿值
on("worker-receive-write-compensation", (event: any, data: any) => {
    if (WriteStandardProductExecution(data)) {
        event.sender.send('worker-send-write-compensation-success')
        return
    }
    event.sender.send('worker-send-write-compensation-error')
})

// 工作进验证补偿
on("worker-receive-verification-compensation", (event: any) => {
    if (MeasureStart() != true) {
        console.log('无法执行')
        return
    }
    event.sender.send('worker-send-verification-result', TestOneGroupExecution())
    MeasureEnd();
})

// 工作进程测试上下限
on("worker-receive-update-limit", (event: any) => {
    let limit: any;
    GetTestLimit(null, (error: any, result: any) => {
        if (error) {
            console.log(error)
            limit = null
            return
        }
        limit = result
    })
    event.sender.send('worker-send-brake-limit', limit)
})

// 工作进程更改文件
on("worker-receive-change-file", (event: any, path: any) => {
    ServiceStop()
    let b: boolean;
    OpenMeasuringProgram(null, (error: any, result: any) => {
        if (error) throw error;
        b = result;
    })
    if (!b) return;
    ChangeFile(path, (error: any, result: any) => {
        if (error) {
            console.log(error)
            return
        }
        b = result
    })
    if (!b) return;
    event.sender.send('worker-send-change-file-success')
})

// 设定模式
on("worker-receive-mode", (event: any, mode: any) => {
    OpenProofreadingMode(mode, (error: any, result: any) => {
        if (error) {
            console.log(error)
            return
        }
        console.log(result)
    })
})



