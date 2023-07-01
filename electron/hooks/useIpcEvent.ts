import {BrowserWindow, ipcMain} from "electron";
import {useMeasurement} from "./useMeasurement";

const {open, close,get,set} = useMeasurement();

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
        close()
        win.close()
    })
    // 打开250B
    ipcMain.on('open-service', function () {
        open()
        return true
    })

    ipcMain.on('get-text', function () {
        get()
    })

    ipcMain.on('set-text', function () {
        set()
    })
}
