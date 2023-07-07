import {BrowserWindow, ipcMain, dialog} from "electron";
import {useMeasurement} from "./useMeasurement";
import {SelectOption} from "naive-ui";

const Store = require('electron-store');
const ini = require('ini');
const fs = require('fs');

const LocalStoreInterface = {
    // 当前QCC文件路径
    filePath: {
        type: 'string',
    },
    // 当前串口
    currentPort: {
        type: 'string',
    },
    // 当前校准模式
    currentCalibrationMode: {
        type: 'string',
    },
    // 250B配置文件路径
    iniConfiguration: {
        type: 'string',
    },
    // 当前通讯模式
    communicationMode: {
        type: 'string',
    }
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

    // 数据初始化
    ipcMain.on('main-send-init', function (event) {
        event.reply('main-receive-init', localStore.store)
    })

    // Store储存
    ipcMain.on('main-send-set-store', function (_, key, value) {
        localStore.set(key, value)
    })

    // Store读取


    // 250B配置文件读取
    ipcMain.on('main-send-read-ini', function (event) {
        try {
            let iniRead = ini.parse(fs.readFileSync(localStore.get('iniConfiguration'), 'utf16le'));
            let calibrationList: Array<SelectOption> = [];
            for (let key in iniRead.NETWORKS) {
                if (key === 'Number Of Fixtures To Display') continue;
                calibrationList.push({
                    label: iniRead.NETWORKS[key],
                    value: iniRead.NETWORKS[key]
                })
            }
            event.reply('main-receive-read-ini', calibrationList)
        } catch (e) {
            event.reply('main-receive-read-ini-error', e)
        }
    })

    // dll初始化
    ipcMain.on('main-send-dll-init', function () {
        // 初始化并启动250B
        ServiceInit()
    })

    // 获取串口列表
    ipcMain.on('main-send-get-port-list', function (event) {
        let portList = PortListUpdate();
        if (portList instanceof Error) {
            event.reply('main-receive-port-list-error', portList)
        } else {
            event.reply('main-receive-port-list-update', portList)
        }
    })

    // 打开文件对话框
    ipcMain.on('main-send-open-file-dialog', function (event) {
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
        }).catch(err => {
            console.log(err)
        })
    })
}
