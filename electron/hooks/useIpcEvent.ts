import {BrowserWindow, ipcMain, dialog} from "electron";
import {useMeasurement} from "./useMeasurement";

const {
    ServiceInit,
    ServiceStop,
    PortListUpdate,
} = useMeasurement();

// 事件监听
export function useIpcEvent(main: BrowserWindow) {
// 最小化
    ipcMain.on('window-min', function () {
        main.minimize();
    })

    // 恢复窗口
    ipcMain.on('window-restore', function () {
        main.restore()
    })

    // 最大化
    ipcMain.on('window-max', function () {
        main.maximize()
    })

    // 关闭窗口
    ipcMain.on('window-close', function () {
        // 关闭服务
        ServiceStop()
        main.close()
    })

    // dll初始化
    ipcMain.on('main-send-dll-init', () => {
        // 初始化并启动250B
        ServiceInit()
    })

    // 获取串口列表
    ipcMain.on('main-send-get-port-list', (event) => {
        let portList = PortListUpdate();
        if (portList instanceof Error) {
            event.reply('main-port-list-error', portList)
        } else {
            event.reply('main-port-list-update', portList)
        }
    })

    // 打开文件对话框
    ipcMain.handle('main-send-open-file-dialog', () => {
        dialog.showOpenDialog(main, {
            title: '选择QCC文件',
            filters: [
                {name: 'QCC文件', extensions: ['qcc']},
            ],
            properties: ['openFile', 'multiSelections']
        }).then(result => {
            if (result.canceled) {
                return '取消选择文件'
            }
            return result.filePaths
        }).catch(err => {
            console.log(err)
        })
    })
}
