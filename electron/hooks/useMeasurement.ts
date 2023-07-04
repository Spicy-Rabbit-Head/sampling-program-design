import {reactive} from "vue";
import {log} from "echarts/types/src/util/log";

const edge = require('electron-edge-js');

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

// 服务常量
const portList = reactive<Array<string>>([]);

export function useMeasurement() {
    // 服务初始化启动
    function ServiceInit() {
        try {
            Init(null, (error, result) => {
                if (error) throw error;
                console.log(result);
            })
            OpenMeasuringProgram(null, (error, result) => {
                if (error) throw error;
                console.log(result);
            })
        } catch (e) {
            console.log(e);
        }
    }

    // 服务停止
    function ServiceStop() {
        try {
            CloseMeasuringProgram(null, (error, result) => {
                if (error) throw error;
                console.log(result);
            })
        } catch (e) {
            console.log(e);
        }
    }

    // 串口列表更新
    function PortListUpdate() {
        try {
            GetSerialPortList(null, (error: any, result: Array<string>) => {
                if (error) throw error;
                portList.length = 0;
                portList.push(...result);
            })
        } catch (e) {
            console.log(e);
            return false;
        }
        return false;
    }

    return {
        ServiceInit,
        ServiceStop,
        PortListUpdate
    }
}