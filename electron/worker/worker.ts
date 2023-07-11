const edge = require("electron-edge-js");
import {useIpcRenderer} from "@vueuse/electron";

const url = "D:\\.work_documents\\Syncdisk\\ProjectCode\\C#\\Measurement\\obj\\x86\\Debug\\Measurement.dll"

// 服务方法
// DLL初始化
const Init = edge.func({
    assemblyFile: url,
    typeName: "Measurement.Sa250B",
    methodName: "Init",
})

// 启动250B
const OpenMeasuringProgram = edge.func({
    assemblyFile: url,
    typeName: "Measurement.Sa250B",
    methodName: "OpenMeasuringProgram",
})

// 关闭250B
const CloseMeasuringProgram = edge.func({
    assemblyFile: url,
    typeName: "Measurement.Sa250B",
    methodName: "CloseMeasuringProgram",
})

// 获取串口列表
const GetSerialPortList = edge.func({
    assemblyFile: url,
    typeName: "Measurement.Sa250B",
    methodName: "GetSerialPortList",
})

// 设置串口
const SetSerialPort = edge.func({
    assemblyFile: url,
    typeName: "Measurement.Sa250B",
    methodName: "SetSerialPort",
})

// 获取串口
const GetSerialPort = edge.func({
    assemblyFile: url,
    typeName: "Measurement.Sa250B",
    methodName: "GetSerialPort",
})

// 标品数据查询
const GetStandardProductData = edge.func({
    assemblyFile: url,
    typeName: "Measurement.Sa250B",
    methodName: "GetStandardProductData",
})

// 校机
const Proofreading = edge.func({
    assemblyFile: url,
    typeName: "Measurement.Sa250B",
    methodName: "Proofreading",
})


// 服务初始化启动
function ServiceInit(port: string) {
    Init(port, (error, result) => {
        if (error) {
            console.log(error)
            return
        }
        console.log(result);
    })
    OpenMeasuringProgram(null, (error, result) => {
        if (error) throw error;
        console.log(result);
    })
}

// 服务停止
function ServiceStop() {
    CloseMeasuringProgram(null, (error, result) => {
        if (error) {
            console.log(error)
            return
        }
        console.log(result);
    })
}

// 串口列表更新
function PortListUpdate(): Array<string> | Error {
    let portList: Array<string> | Error = [];
    GetSerialPortList(null, (error: any, result: any) => {
        if (error) {
            portList = new Error(error)
            return
        }
        portList = result
    })
    return portList;
}

// 标品数据查询
function StandardProductQuery(path: string, pn: string, location: string, password: string) {
    let portList: Array<string> = [];
    let data = {
        path: path,
        pn: pn,
        location: location,
        password: password
    }
    GetStandardProductData(data, (error, result: any) => {
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
    Proofreading(data, (error, result) => {
        if (error) {
            console.log(error)
            status = false;
            return
        }
        status = true;
        console.log(result);
    })
    return status;
}

const {on} = useIpcRenderer();

// 工作进程服务停止
on("worker-receive-stop-service", () => {
    ServiceStop()
})

// 工作进程服务初始化启动
on("worker-receive-dll-init", (_, port) => {
    ServiceInit(port)
})

// 工作进程串口列表更新
on("worker-receive-get-port-list", (event) => {
    let portList = PortListUpdate();
    if (portList instanceof Error) {
        // 工作进程串口列表更新失败
        event.sender.send('worker-send-port-list-error', portList)
    } else {
        // 工作进程串口列表更新
        event.sender.send('worker-send-port-list-update', portList)
    }
})

// 工作进程串口设置
on("worker-receive-serial-port-update", (_, port) => {
    SetSerialPort(port, (error, result) => {
        if (error) {
            console.log(error)
            return
        }
        console.log(result);
    })
})

// 工作进程标品数据查询
on("worker-receive-standard-query", (event, path, pn, location, password) => {
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
on("worker-receive-auto-calibration-start", (event, step, fixture) => {
    for (let i = 0; i < 4; i++) {
        CalibrationExecution(0, i, fixture);
        GetSerialPort(null, (error, result) => {
            console.log(result)
        })
    }
})

