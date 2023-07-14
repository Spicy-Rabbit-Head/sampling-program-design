const edge = require('electron-edge-js');
const {useIpcRenderer} = require("@vueuse/electron")
const {join, resolve} = require('path')

let environment;
if (process.env.VITE_DEV_SERVER_URL) {
    environment = join(resolve() + '/public/dll/Measurement.dll')
} else {
    environment = join(__dirname + '../../../../../Measurement.dll')
}
const url = environment

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

// 丝杆动作
const ScrewAction = edge.func({
    assemblyFile: url,
    typeName: "Measurement.Sa250B",
    methodName: "ScrewAction",
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
    ScrewAction(action, (error, result) => {
        if (error) return
        i = result
    })
    console.log(i)
}

const {on} = useIpcRenderer();

// 工作进程服务停止
on("worker-receive-stop-service", (event) => {
    ServiceStop()
    event.sender.send('worker-send-close')
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
on("worker-receive-calibration-start", (event, step, fixture) => {
    if (step != 2) {
        ScrewActionExecution(0)
    }
    for (let i = 0; i < 4; i++) {
        let n = CalibrationExecution(step, i, fixture);
        if (n) {
            event.sender.send('worker-send-calibration-progress-success', i)
        } else {
            ScrewActionExecution(0)
            event.sender.send('worker-send-calibration-progress-error', i)
            return
        }
    }
    if (step != 2) {
        ScrewActionExecution(0)
        if (step != 1) {
            ScrewActionExecution(1)
        }
    }
    event.sender.send('worker-send-step-success', step)
})

// 工作进程验证执行
on("worker-receive-validation-start", (event) => {

})

// 工作进程丝杆动作
on("worker-receive-screw-action", (event, action) => {
    ScrewActionExecution(action)
})

