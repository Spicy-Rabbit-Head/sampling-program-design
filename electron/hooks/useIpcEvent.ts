import {BrowserWindow, ipcMain} from "electron";

// 事件监听
export function useIpcEvent(win: BrowserWindow) {
    // 最小化
    ipcMain.on('window-min', function () {
        win.minimize();
    })
    // 恢复串口
    ipcMain.on('window-restore', function () {
        win.restore()
    })
    // 最大化
    ipcMain.on('window-max', function () {
        win.maximize()
    })
    // 关闭窗口
    ipcMain.on('window-close', function () {
        win.close()
    })
}
