import {BrowserWindow, ipcMain, dialog} from "electron";
import {SelectOption} from "naive-ui";

const Store = require('electron-store');
import ini from 'ini';
import fs from 'fs';
import {join} from "path";

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
    },
    // 校对机运行模式
    proofreadingOperationMode: {
        type: 'integer',
    }
}


// 事件监听
export function useIpcEvent(render: BrowserWindow, worker: BrowserWindow) {
    // 本地配置储存
    const localStore = new Store({LocalStoreInterface});
    console.log(localStore.store)

    // 渲染进程最小化
    ipcMain.on('render-send-window-min', function () {
        render.minimize();
    })

    // 渲染进程恢复窗口
    ipcMain.on('render-send-window-restore', function () {
        render.restore()
    })

    // 渲染进程最大化
    ipcMain.on('render-send-window-max', function () {
        render.maximize()
    })

    // 渲染进程关闭窗口
    ipcMain.on('render-send-window-close', function () {
        // 关闭服务
        worker.webContents.send('worker-receive-stop-service')
        render.close()
    })

    // 工作进程关闭
    ipcMain.on('worker-send-close', function () {
        worker.close();
    })

    // 渲染进程数据初始化
    ipcMain.on('render-send-init', function (event) {
        event.reply('render-receive-init', localStore.store)
    })

    // 渲染进程Store储存
    ipcMain.on('render-send-set-store', function (_, key, value) {
        localStore.set(key, value)
    })

    // 渲染进程Store读取
    ipcMain.on('render-send-get-store', function (event, url, key) {
        event.reply(url, localStore.get(key))
    })

    // 渲染进程250B配置文件读取
    ipcMain.on('render-send-read-ini', function (event) {
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
            // 渲染进程接收250B配置
            event.reply('render-receive-read-ini', calibrationList)
        } catch (e) {
            // 渲染进程接收250B配置错误
            event.reply('render-receive-read-ini-error', e)
        }
    })

    // 渲染车间列表读取
    ipcMain.on('render-send-workshop-list-query', function (event) {
        try {
            // 自定义配置文件读取
            let pathName;
            if (process.env.VITE_DEV_SERVER_URL) {
                pathName = __dirname + '../../public/customConfig.ini'
            } else {
                pathName = join(__dirname, '../../customConfig.ini')
            }
            console.log(pathName)
            let iniRead = ini.parse(fs.readFileSync(pathName, 'utf8'));
            let calibrationList: Array<SelectOption> = [];
            for (let key in iniRead.WORKSHOP) {
                calibrationList.push({
                    label: key,
                    value: key,
                    location: iniRead.WORKSHOP[key]
                })
            }
            // 渲染进程接收车间列表更新
            event.reply('render-receive-workshop-list-update', calibrationList)
        } catch (e) {
            // 渲染进程接收车间列表错误
            event.reply('render-receive-read-ini-error', e)
        }
    })

    // 渲染进程可修改配置读取
    ipcMain.on('render-send-read-configuration', function (event) {
        // 渲染进程接收可修改配置
        event.reply('render-receive-read-configuration', localStore.store)
    })

    // 渲染进程打开文件对话框-QCC
    ipcMain.on('render-send-open-qcc-dialog', function (event) {
        dialog.showOpenDialog(render, {
            title: '选择QCC文件',
            filters: [
                {name: 'QCC文件', extensions: ['qcc']},
            ],
            properties: ['openFile']
        }).then(r => {
            if (r.canceled) {
                // 渲染进程接收取消选择文件
                event.reply('render-receive-cancel-select-file')
            } else {
                // 渲染进程接收QCC文件路径并持久化
                event.reply('render-receive-qcc-select-file', r.filePaths[0])
                localStore.set('filePath', r.filePaths[0])
            }
        }).catch(err => {
            console.log(err)
        })
    })

    // 渲染进程打开文件对话框-250B配置文件
    ipcMain.on('render-send-open-ini-dialog', function (event) {
        dialog.showOpenDialog(render, {
            title: '选择250B配置文件',
            filters: [
                {name: 'INI文件', extensions: ['ini']},
            ],
            properties: ['openFile']
        }).then(r => {
            if (r.canceled) {
                event.reply('render-receive-cancel-select-file')
            } else {
                event.reply('render-receive-ini-select-file', r.filePaths[0])
                localStore.set('iniConfiguration', r.filePaths[0])
            }
        }).catch(err => {
            console.log(err)
        })
    })

    // 渲染进程打开文件对话框-标品
    ipcMain.on('render-send-open-standard-dialog', function (event) {
        dialog.showOpenDialog(render, {
            title: '选择标品数据文件',
            filters: [
                {name: 'Access', extensions: ['mdb']},
            ],
            properties: ['openFile']
        }).then(r => {
            if (r.canceled) {
                event.reply('render-receive-cancel-select-file')
            } else {
                event.reply('render-receive-standard-select-file', r.filePaths[0])
                localStore.set('standardProductPath', r.filePaths[0])
            }
        }).catch(err => {
            console.log(err)
        })
    })

    // 渲染进程发起dll初始化
    ipcMain.on('render-send-dll-init', function () {
        worker.webContents.send('worker-receive-dll-init', localStore.get('currentPort'))
    })

    // 渲染进程获取串口列表
    ipcMain.on('render-send-get-port-list', function () {
        worker.webContents.send('worker-receive-get-port-list')
    })

    // 工作进程获取串口列表失败
    ipcMain.on('worker-send-port-list-error', function (_, error) {
        render.webContents.send('render-receive-port-list-error', error)
    })

    // 工作进程获取串口列表成功
    ipcMain.on('worker-send-port-list-update', function (_, portList) {
        render.webContents.send('render-receive-port-list-update', portList)
    })

    // 渲染进程发起串口端口更新
    ipcMain.on('render-send-serial-port-update', function (_, port) {
        worker.webContents.send('worker-receive-serial-port-update', port)
    })

    // 渲染进程发起标品 Access 查询
    ipcMain.on('render-send-standard-query', function (event, pn) {
        let path = localStore.get('standardProductPath');
        let location = localStore.get('location');
        let password = localStore.get('standardProductPassword');
        worker.webContents.send('worker-receive-standard-query', path, pn, location, password)
    })

    // 工作进程标品 Access 查询失败
    ipcMain.on('worker-send-standard-query-error', function (_, error) {
        render.webContents.send('render-receive-standard-query-error', error)
    })

    // 工作进程标品 Access 查询成功
    ipcMain.on('worker-send-standard-query-success', function (_, dataList) {
        render.webContents.send('render-receive-standard-query-success', dataList)
    })

    // 渲染进程自动校准开始
    ipcMain.on('render-send-calibration-short-circuit-start', function () {
        switch (localStore.get('proofreadingOperationMode')) {
            case 0:
            case 1:
                worker.webContents.send('worker-receive-calibration-start', 0, localStore.get('currentCalibrationMode'))
                break
            case 2:
                worker.webContents.send('worker-receive-validation-start')
        }
    })

    // 接收工作进程自动校准进度失败
    ipcMain.on('worker-send-calibration-progress-error', function (_, result) {
        render.webContents.send('render-receive-calibration-progress-error', result)
    })

    // 接收工作进程自动校准进度成功
    ipcMain.on('worker-send-calibration-progress-success', function (_, result) {
        render.webContents.send('render-receive-calibration-progress-success', result)
    })

    // 工作进程发起阶段完成
    ipcMain.on('worker-send-step-success', function (_, step) {
        if (step === 2) {
            worker.webContents.send('worker-receive-validation-start')
            render.webContents.send('render-receive-calibration-step-success')
            return
        }
        render.webContents.send('render-receive-step-update', step + 1)
        worker.webContents.send('worker-receive-calibration-start', step + 1, localStore.get('currentCalibrationMode'))
    })

    // 渲染进程发起丝杆动作
    ipcMain.on('render-send-screw-action', function (_, action) {
        worker.webContents.send('worker-receive-screw-action', action)
    })

    // 工作进程发起对机数据更新
    ipcMain.on('worker-send-docking-data', function (_, data) {
        render.webContents.send('render-receive-docking-data', data)
    })
}
