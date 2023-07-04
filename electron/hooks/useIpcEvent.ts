import {BrowserWindow, ipcMain} from "electron";
import {useMeasurement} from "./useMeasurement";

const {
    ServiceInit,
    ServiceStop,
    PortListUpdate,
} = useMeasurement();

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
        // 关闭服务
        ServiceStop()
        win.close()
    })

    // dll初始化
    ipcMain.on('dll-init', () => {
        // 初始化并启动250B
        ServiceInit()
        return true
    })

    // 获取串口列表
    ipcMain.on('get-port-list', () => {
        PortListUpdate()
        return true
    })
}
