import {BrowserWindow, ipcMain} from "electron";
import {CloseMeasuringProgram, GetSerialPortList, OpenMeasuringProgram, ServiceDllInit} from "./useMeasurement";

// 事件监听
export function useIpcEvent(win: BrowserWindow) {
    // 最小化
    ipcMain.on('window-min', function () {
        win.minimize();
    })

    // 恢复窗口
    ipcMain.on('window-restore', function () {
        win.restore()
    })

    // 最大化
    ipcMain.on('window-max', function () {
        win.maximize()
    })

    // 关闭窗口
    ipcMain.on('window-close', function () {
        // 关闭250B
        CloseMeasuringProgram(null, (error, value) => {
            if (error) throw error;
            console.log(value);
        })
        win.close()
    })

    // dll初始化
    ipcMain.on('dll-init', () => {
        ServiceDllInit(null, (error, result) => {
            if (error) throw error;
            console.log(result);
        })
        // 打开250B
        OpenMeasuringProgram(null, (error, result) => {
            if (error) throw error;
            console.log(result);
        })
        return true
    })

    // 获取串口列表
    ipcMain.handle('get-port-list', () => {
        const list = GetSerialPortList(null, (error, result) => {
            if (error) throw error;
            console.log(typeof result);
            console.log(result)
            return result
        })
        console.log(list);
        return list
    })
}
