// const edge = require('electron-edge-js');
//
// const url = "D:\\.work_documents\\Syncdisk\\ProjectCode\\C#\\Measurement\\obj\\x86\\Debug\\Measurement.dll"
//
//
// // 服务方法
// // DLL初始化
// const Init = edge.func({
//     assemblyFile: url,
//     typeName: "Measurement.Sa250B",
//     methodName: "Init",
// })
//
// // 启动250B
// const OpenMeasuringProgram = edge.func({
//     assemblyFile: url,
//     typeName: "Measurement.Sa250B",
//     methodName: "OpenMeasuringProgram",
// })
//
// // 关闭250B
// const CloseMeasuringProgram = edge.func({
//     assemblyFile: url,
//     typeName: "Measurement.Sa250B",
//     methodName: "CloseMeasuringProgram",
// })
//
// // 获取串口列表
// const GetSerialPortList = edge.func({
//     assemblyFile: url,
//     typeName: "Measurement.Sa250B",
//     methodName: "GetSerialPortList",
// })
//
// // 标品数据查询
// const GetStandardProductData = edge.func({
//     assemblyFile: url,
//     typeName: "Measurement.Sa250B",
//     methodName: "GetStandardProductData",
// })
//
// // 校机
// const Proofreading = edge.func({
//     assemblyFile: url,
//     typeName: "Measurement.Sa250B",
//     methodName: "Proofreading",
// })
//
// export function useMeasurement() {
//     // 服务初始化启动
//     function ServiceInit() {
//         Init(null, (error, result) => {
//             if (error) {
//                 console.log(error)
//                 return
//             }
//             console.log(result);
//         })
//         OpenMeasuringProgram(null, (error, result) => {
//             if (error) throw error;
//             console.log(result);
//         })
//     }
//
//     // 服务停止
//     function ServiceStop() {
//         CloseMeasuringProgram(null, (error, result) => {
//             if (error) {
//                 console.log(error)
//                 return
//             }
//             console.log(result);
//         })
//     }
//
//     // 串口列表更新
//     function PortListUpdate(): Array<string> | Error {
//         let portList: Array<string> | Error = [];
//         GetSerialPortList(null, (error: any, result: Array<string>) => {
//             if (error) {
//                 portList = new Error(error)
//                 return
//             }
//             portList = result
//         })
//         return portList;
//     }
//
//     // 标品数据查询
//     function StandardProductQuery(path: string, pn: string, location: string, password: string) {
//         let portList: Array<string> = [];
//         let data = {
//             path: path,
//             pn: pn,
//             location: location,
//             password: password
//         }
//         GetStandardProductData(data, (error, result) => {
//             if (error) {
//                 portList = null
//                 return
//             }
//             portList = result
//         })
//         return portList;
//     }
//
//     // 校准执行
//     async function CalibrationExecution(step: number, index: number, fixture: string) {
//         let data = {
//             steps: step,
//             portIndex: index,
//             fixture: fixture,
//         }
//         let status: boolean = true;
//         Proofreading(data, (error, result) => {
//             console.log(error)
//             console.log(result)
//             if (error) {
//                 console.log(error)
//                 status = false;
//                 return
//             }
//             status = true;
//             console.log(result);
//         })
//         return status;
//     }
//
//     return {
//         ServiceInit,
//         ServiceStop,
//         PortListUpdate,
//         StandardProductQuery,
//         CalibrationExecution,
//     }
// }