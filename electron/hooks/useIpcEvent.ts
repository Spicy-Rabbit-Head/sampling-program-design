import {BrowserWindow, ipcMain, dialog} from "electron";
import {useMeasurement} from "./useMeasurement";

const Store = require('electron-store');

const LocalStoreInterface = {
    filePath: {
        type: 'string',
        format: 'uri',
    },
}

const {
    ServiceInit,
    ServiceStop,
    PortListUpdate,
} = useMeasurement();

// 事件监听
export function useIpcEvent(main: BrowserWindow) {
    // 本地配置储存
    const localStore = new Store({LocalStoreInterface});
    console.log(localStore.store)

    // 最小化
    ipcMain.on('main-send-window-min', function () {
        main.minimize();
    })

    // 恢复窗口
    ipcMain.on('main-send-window-restore', function () {
        main.restore()
    })

    // 最大化
    ipcMain.on('main-send-window-max', function () {
        main.maximize()
    })

    // 关闭窗口
    ipcMain.on('main-send-window-close', function () {
        // 关闭服务
        ServiceStop()
        main.close()
    })

    // 初始化
    ipcMain.on('main-send-init', function () {

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
            event.reply('main-receive-port-list-error', portList)
        } else {
            event.reply('main-receive-port-list-update', portList)
        }
    })

    // 打开文件对话框
    ipcMain.on('main-send-open-file-dialog', (event) => {
        dialog.showOpenDialog(main, {
            title: '选择QCC文件',
            filters: [
                {name: 'QCC文件', extensions: ['qcc']},
            ],
            properties: ['openFile']
        }).then(r => {
            if (r.canceled) {
                event.reply('main-receive-cancel-select-file')
            } else {
                event.reply('main-receive-select-file', r.filePaths[0])
                localStore.set('filePath', r.filePaths[0])
            }
        }).then(e => {
            console.log(e)
        })
    })
}
