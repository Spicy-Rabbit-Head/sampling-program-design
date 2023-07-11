import {BrowserWindow, ipcMain, dialog} from "electron";
import {useMeasurement} from "./useMeasurement";
import {SelectOption} from "naive-ui";


const Store = require('electron-store');
import ini from 'ini';
import fs from 'fs';

type LocalStoreInterface = {
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
    },
    // 标品数据路径
    standardProductPath: {
        type: 'string',
    },
    // 标品数据密码
    standardProductPassword: {
        type: 'string',
    },
    // 权限密码
    permissionPassword: {
        type: 'string',
    },
    // 当前车间
    currentWorkshop: {
        type: 'string',
    },
    // 当前地址
    location: {
        type: 'string',
    }
}

const {
    ServiceInit,
    ServiceStop,
    PortListUpdate,
    StandardProductQuery,
} = useMeasurement();


// 事件监听
export function useIpcEvent(main: BrowserWindow) {
    // 本地配置储存
    const localStore = new Store();
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
    ipcMain.on('main-send-get-store', function (event, url, key) {
        event.reply(url, localStore.get(key))
    })

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

    // 车间列表读取
    ipcMain.on('main-send-workshop-list-query', function (event) {
        try {
            let iniRead = ini.parse(fs.readFileSync(__dirname + '../../customConfig.ini', 'utf8'));
            let calibrationList: Array<SelectOption> = [];
            for (let key in iniRead.WORKSHOP) {
                calibrationList.push({
                    label: key,
                    value: key,
                    location: iniRead.WORKSHOP[key]
                })
            }
            event.reply('main-receive-workshop-list-update', calibrationList)
        } catch (e) {
            event.reply('main-receive-read-ini-error', e)
        }
    })

    // 可修改配置读取
    ipcMain.on('main-send-read-configuration', function (event) {
        event.reply('main-receive-read-configuration', localStore.store)
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

    // 打开文件对话框-QCC
    ipcMain.on('main-send-open-qcc-dialog', function (event) {
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
                event.reply('main-receive-qcc-select-file', r.filePaths[0])
                localStore.set('filePath', r.filePaths[0])
            }
        }).catch(err => {
            console.log(err)
        })
    })

    // 打开文件对话框-250B配置文件
    ipcMain.on('main-send-open-ini-dialog', function (event) {
        dialog.showOpenDialog(main, {
            title: '选择250B配置文件',
            filters: [
                {name: 'INI文件', extensions: ['ini']},
            ],
            properties: ['openFile']
        }).then(r => {
            if (r.canceled) {
                event.reply('main-receive-cancel-select-file')
            } else {
                event.reply('main-receive-ini-select-file', r.filePaths[0])
                localStore.set('iniConfiguration', r.filePaths[0])
            }
        }).catch(err => {
            console.log(err)
        })
    })

    // 打开文件对话框-标品
    ipcMain.on('main-send-open-standard-dialog', function (event) {
        dialog.showOpenDialog(main, {
            title: '选择标品数据文件',
            filters: [
                {name: 'Access', extensions: ['mdb']},
            ],
            properties: ['openFile']
        }).then(r => {
            if (r.canceled) {
                event.reply('main-receive-cancel-select-file')
            } else {
                event.reply('main-receive-standard-select-file', r.filePaths[0])
                localStore.set('standardProductPath', r.filePaths[0])
            }
        }).catch(err => {
            console.log(err)
        })
    })

    // 标品 Access 查询
    ipcMain.on('main-send-standard-access-query', function (event, pn) {
        let path = localStore.get('standardProductPath');
        let location = localStore.get('location');
        let password = localStore.get('standardProductPassword');
        let dataList = StandardProductQuery(path as string, pn, location as string, password as string);
        if (dataList == null) {
            event.reply('main-receive-standard-query-error')
        } else {
            event.reply('main-receive-standard-query-success', dataList)
        }
    })

    // 自动校准开始
    ipcMain.on('main-send-auto-calibration-start', function (event) {
        const wind = setInterval(() => {
            event.reply('main-receive-auto-calibration-message', '66666666666')
        }, 2000)
    })
}
