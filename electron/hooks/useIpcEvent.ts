import { BrowserWindow, ipcMain, dialog } from "electron";
import { SelectOption } from "naive-ui";

const Store = require('electron-store');
const ini = require('ini');
import fs from 'fs';
import { join } from "path";
import { LocalStoreInterface } from "../interface";
import { ref } from "vue";

// 自动测试状态
const auto = ref<boolean>(false);
// 校准步骤数
const steps = ref<number>(0);
// 对机验证步骤数
const checkTheMachineSteps = ref<number>(0);


// 事件监听
export function useIpcEvent(render: BrowserWindow, worker: BrowserWindow) {
  // 本地配置储存
  const localStore = new Store({LocalStoreInterface});

  // 主窗口最大化
  render.on('maximize', () => {
    render.webContents.send('render-receive-max-windows')
  })

  // 主窗口最小化
  render.on('unmaximize', () => {
    render.webContents.send('render-receive-min-windows')
  })

  // 主窗口关闭
  render.on('close', (e) => {
    e.preventDefault()
    auto.value = false;
    render.webContents.send('render-receive-show-close-confirm-dialog')
    // 进行数据保存
    render.webContents.send('render-receive-save-data')
  })

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

  // 渲染进程通知窗口关闭(保存数据)
  ipcMain.on('render-send-window-close', function (event: any) {
    auto.value = false;
    event.reply('render-receive-show-close-confirm-dialog')
    // 进行数据保存
    event.reply('render-receive-save-data')
  })

  // 渲染进程通知窗口关闭(等待数据保存)
  ipcMain.on('render-send-close-server', function () {
    // 关闭工作进程
    worker.webContents.send('worker-receive-stop-service');
  })

  // 工作进程关闭
  ipcMain.on('worker-send-close', function () {
    render.destroy();
    worker.destroy();
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
      let {NETWORKS} = ini.parse(fs.readFileSync(localStore.get('iniConfiguration'), 'utf16le'));
      let calibrationList: Array<SelectOption> = [];
      for (let key in NETWORKS) {
        if (key === 'Number Of Fixtures To Display') continue;
        calibrationList.push({
          label: NETWORKS[key],
          value: NETWORKS[key]
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
      let pathName = join(__dirname, '../../customConfig.ini');
      if (process.env.VITE_DEV_SERVER_URL) {
        pathName = join(__dirname + '../../public/customConfig.ini')
      }
      let {WORKSHOP} = ini.parse(fs.readFileSync(pathName, 'utf8'));
      let calibrationList: Array<SelectOption> = [];
      for (let key in WORKSHOP) {
        calibrationList.push({
          label: key,
          value: key,
          location: WORKSHOP[key]
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
        // 通知工作进程读取QCC文件
        worker.webContents.send('worker-receive-change-file', r.filePaths[0])
        localStore.set('filePath', r.filePaths[0])
      }
    }).catch(err => {
      event.sender.send('render-receive-notification-error', err);
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
      event.sender.send('render-receive-notification-error', err);
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
      event.sender.send('render-receive-notification-error', err);
    })
  })

  // 渲染进程发起dll初始化
  ipcMain.on('render-send-dll-init', function () {
    worker.webContents.send('worker-receive-dll-init', localStore.get('currentPort'))
  })

  // 渲染进程发起标品 Access 查询
  ipcMain.on('render-send-standard-query', function (_, pn) {
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

  // 渲染进程发起刷新实例
  ipcMain.on('render-send-refresh-instance', function (_, number) {
    worker.webContents.send('worker-receive-refresh-instance', number)
  })

  // 渲染进程自动校准结束
  ipcMain.on('render-send-calibration-short-circuit-stop', function () {
    auto.value = false;
    worker.webContents.send('worker-receive-error-stop')
  })

  // 渲染进程自动校准开始
  ipcMain.on('render-send-calibration-short-circuit-start', function () {
    auto.value = true;
    steps.value = 0;
    checkTheMachineSteps.value = 0;
    worker.webContents.send('worker-receive-mode', localStore.get('proofreadingOperationMode'))
  })

  // 量测进程校准信号判断
  ipcMain.on('worker-send-calibration-judgment', function (event, i) {
    if (auto.value == false) return;
    if (i) {
      // 进行校准
      event.reply('worker-receive-calibration-execute', steps.value, localStore.get('currentCalibrationMode'))
    } else {
      // 等待校准循环
      event.reply('worker-receive-calibration-start')
    }
  })

  // 渲染进程发起关闭自动测试
  ipcMain.on('render-send-close-auto-test', function () {
    auto.value = false;
    worker.webContents.send('worker-receive-close-auto-test')
  })

  // 渲染进程发起自动测试
  ipcMain.on('render-send-start-auto-test', function () {
    auto.value = true;
    worker.webContents.send('worker-receive-start-auto-test')
  })

  // 量测进程量测信号判断
  ipcMain.on('worker-send-measure-start-judgment', function (event, i) {
    if (auto.value == false) return;
    if (i) {
      // 进行量测
      event.reply('worker-receive-measure-go')
    } else {
      // 等待量测循环
      event.reply('worker-receive-measure-start')
    }
  })

  // 量测数据
  ipcMain.on('worker-send-measure-data', function (event, data) {
    event.reply('worker-receive-measure-start');
    console.log('量测数据')
    console.log(data)
    render.webContents.send('render-receive-measure-data', data)
  })

  // 接收工作进程自动校准进度失败
  ipcMain.on('worker-send-calibration-progress-error', function (_, result) {
    render.webContents.send('render-receive-calibration-progress-error', result)
    auto.value = false;
  })

  // 接收工作进程自动校准进度成功
  ipcMain.on('worker-send-calibration-progress-success', function (_, result) {
    render.webContents.send('render-receive-calibration-progress-success', result)
  })

  // 执行补偿
  ipcMain.on('worker-send-compensate-execute', function (event) {
    event.reply('worker-receive-compensate-execute')
  })

  // 量测进程对机信号判断
  ipcMain.on('worker-send-verify-judgment', function (event, i) {
    if (auto.value == false) return;
    if (i) {
      // 进行对机
      worker.webContents.send('worker-receive-verify-execute', checkTheMachineSteps.value)
    } else {
      // 等待对机循环
      worker.webContents.send('worker-receive-verify-start')
    }
  })

  // 工作进程发起阶段完成
  ipcMain.on('worker-send-step-success', function (_, step) {
    if (step === 2) {
      if (localStore.get('proofreadingOperationMode') == 0) {
        worker.webContents.send('worker-receive-verify-start')
        return;
      }
      steps.value = 0;
      render.webContents.send('render-receive-calibration-step-success')
      return
    }
    steps.value = step + 1;
    render.webContents.send('render-receive-step-update', steps.value)
    worker.webContents.send('worker-receive-calibration-start')
  })

  // 渲染进程发起测试头动作
  ipcMain.on('render-send-test-head-action', function (_, action) {
    worker.webContents.send('worker-receive-test-head-action', action)
  })

  // 渲染进程发起手动位置
  ipcMain.on('render-send-manual-position', function (_, position) {
    worker.webContents.send('worker-receive-manual-position', position);
  })

  // 工作进程发起标志写入成功
  ipcMain.on('worker-send-standard-write-success', function () {
    worker.webContents.send('worker-receive-verify-start');
  })

  // 工作进程发起对机数据更新
  ipcMain.on('worker-send-docking-data', function (_, data) {
    checkTheMachineSteps.value += 1;
    render.webContents.send('render-receive-docking-data', data, checkTheMachineSteps.value)
    if (checkTheMachineSteps.value == 4) {
      checkTheMachineSteps.value = 0;
    }
  })

  // 渲染进程发起写入补偿
  ipcMain.on('render-send-write-compensation', function (_, data: any) {
    worker.webContents.send('worker-receive-write-compensation', data)
  })

  // 工作进程发起写入补偿失败
  ipcMain.on('worker-send-write-compensation-error', function (_, error) {
    render.webContents.send('render-receive-write-compensation-error')
  })

  // 工作进程发起写入补偿成功
  ipcMain.on('worker-send-write-compensation-success', function () {
    render.webContents.send('render-receive-write-compensation-success')
  })

  // 工作进程再次验证信号判断
  ipcMain.on('worker-send-reverification-judgment', function (event, i) {
    if (auto.value == false) return;
    if (i) {
      // 进行再次验证
      worker.webContents.send('worker-receive-reverification-execute', checkTheMachineSteps.value)
    } else {
      // 等待再次验证中循环
      worker.webContents.send('worker-receive-reverification-start')
    }
  })

  // 渲染进程发起再次验证补偿
  ipcMain.on('render-send-verification-compensation', function () {
    worker.webContents.send('worker-receive-reverification-start')
  })

  // 工作进程发起验证结果
  ipcMain.on('worker-send-reverification-result', function (_, result) {
    checkTheMachineSteps.value += 1;
    render.webContents.send('render-receive-reverification-result', result, checkTheMachineSteps.value)
    if (checkTheMachineSteps.value == 4) {
      checkTheMachineSteps.value = 0;
    }
  })

  // 渲染进程发起缓存数据保存
  ipcMain.on('render-send-cache-data-save', function (event, data) {
    let path = join(__dirname, '../../cache.json');
    if (process.env.VITE_DEV_SERVER_URL) {
      path = join(__dirname + '../../public/cache.json')
    }
    fs.writeFile(path, data, 'utf8', function (err) {
      if (err) {
        event.sender.send('render-receive-notification-error', err);
      }
    })
  })

  // 渲染进程发起缓存数据读取
  ipcMain.on('render-send-cache-data-read', function (event) {
    let path = join(__dirname, '../../cache.json');
    if (process.env.VITE_DEV_SERVER_URL) {
      path = join(__dirname + '../../public/cache.json')
    }
    fs.readFile(path, 'utf8', function (err, data) {
      if (err) {
        event.sender.send('render-receive-notification-error', err);
      } else {
        event.reply('render-receive-read-store', data)
      }
    })
  })

  // 渲染进程发起测试数据上下限
  ipcMain.on('render-send-update-limit', function () {
    worker.webContents.send('worker-receive-update-limit')
  })

  // 工作进程发起测试数据上下限
  ipcMain.on('worker-send-brake-limit', function (_, data) {
    render.webContents.send('render-receive-brake-limit', data)
  })

  // 更改文件成功
  ipcMain.on('worker-send-change-file-success', function () {
    worker.webContents.send('worker-receive-update-limit')
  })

  // 初始化日志
  ipcMain.on('render-send-init-log', function (event) {
    let path = join(__dirname, '../../log.json');
    if (process.env.VITE_DEV_SERVER_URL) {
      path = join(__dirname + '../../public/log.json')
    }
    fs.readFile(path, 'utf8', function (err, data) {
      if (err) {
        event.reply('render-receive-notification-error', err);
      } else {
        event.reply('render-receive-read-log', data)
      }
    })
  })

  // 保存日志
  ipcMain.on('render-send-save-log', function (event, data) {
    let path = join(__dirname, '../../log.json');
    if (process.env.VITE_DEV_SERVER_URL) {
      path = join(__dirname + '../../public/log.json')
    }
    fs.writeFile(path, data, function (err) {
      if (err) {
        event.reply('render-receive-notification-error', err);
      }
    })
  })

  // 保存
  ipcMain.on('render-send-save', function () {
    worker.webContents.send('worker-receive-save');
  })

  // 一次量测
  ipcMain.on('render-send-measure-one', function () {
    worker.webContents.send('worker-receive-measure-one')
  })

  // 清除量测数据
  ipcMain.on('render-send-clear-measure', function () {
    worker.webContents.send('worker-receive-clear');
  })

  // 起始位置
  ipcMain.on('worker-send-start-position', function (_, data) {
    console.log('位置')
    console.log(data)
    render.webContents.send('render-receive-start-position', data)
  })

  // 保存量测数据
  ipcMain.on('render-send-save-measure', function (event, data) {
    let path = join(__dirname, '../../measure_cache.json');
    if (process.env.VITE_DEV_SERVER_URL) {
      path = join(__dirname + '../../public/measure_cache.json')
    }
    fs.writeFile(path, data, function (err) {
      if (err) {
        event.reply('render-receive-notification-error', err);
      }
    })
  })

  // 初始化量测数据
  ipcMain.on('render-send-init-measure', function (event) {
    let path = join(__dirname, '../../measure_cache.json');
    if (process.env.VITE_DEV_SERVER_URL) {
      path = join(__dirname + '../../public/measure_cache.json')
    }
    fs.readFile(path, 'utf8', function (err, data) {
      if (err) {
        event.reply('render-receive-notification-error', err);
      } else {
        event.reply('render-receive-read-measure', data)
      }
    })
  })

  // 手动量测数据
  ipcMain.on('render-send-manual-measure-data', function (_, data) {
    render.webContents.send('render-receive-manual-measure-data', data)
  })

  // 渲染进程发起报警
  ipcMain.on('render-send-start-alarm', function () {
    worker.webContents.send('worker-receive-start-alarm');
  })

  // 渲染进程发起停止报警
  ipcMain.on('render-send-stop-alarm', function () {
    worker.webContents.send('worker-receive-stop-alarm');
  })

  // 验证PLC状态
  ipcMain.on('render-send-verification-plc-status', function () {
    worker.webContents.send('worker-receive-verification-plc-status')
  })

  // PLC状态
  ipcMain.on('worker-send-plc-status', function (_, data) {
    render.webContents.send('render-receive-plc-status', data)
  })

  // 消息通知
  ipcMain.on('worker-send-dll-success', function (_, data) {
    render.webContents.send('render-receive-notification-success', data)
  })

  // 消息通知
  ipcMain.on('worker-send-dll-error', function (_, data) {
    render.webContents.send('render-receive-notification-error', data)
  })

  // 校对机触发位置
  ipcMain.on('render-send-proofreading-position', function (_, data) {
    worker.webContents.send('worker-receive-proofreading-position-trigger', data)
  })

  // 启动试调
  ipcMain.on('render-send-proofreading-start', function (_, data) {
    worker.webContents.send('worker-receive-proofreading-start', data)
  })

  // 结束试调
  ipcMain.on('render-send-proofreading-stop', function (event) {
    auto.value = false;
    event.reply('render-receive-proofreading-stop')
  })

  // 试调开始成功
  ipcMain.on('worker-send-proofreading-start-success', function () {
    auto.value = true;
    render.webContents.send('render-receive-proofreading-start-success');
    worker.webContents.send('worker-receive-proofreading-loop');
  })

  // 试调开始失败
  ipcMain.on('worker-send-proofreading-start-error', function () {
    render.webContents.send('render-receive-proofreading-start-error');
  })

  // 试调循环
  ipcMain.on('worker-send-proofreading-loop', function (event, i) {
    if (auto.value == false) return;
    if (i) {
      // 进行再次验证
      event.reply('worker-receive-proofreading-execute');
    } else {
      // 等待再次验证中循环
      event.reply('worker-receive-proofreading-loop')
    }
  })

  // 试调数据
  ipcMain.on('worker-send-proofreading-data', function (event, data) {
    event.reply('worker-receive-proofreading-loop');
    render.webContents.send('render-receive-proofreading-data', data);
  })

// // 渲染进程发起数据表读取
// ipcMain.on('render-send-read-data-table', function (event, pathName) {
//     let path = join(__dirname, '../../data', pathName);
//     if (process.env.VITE_DEV_SERVER_URL) {
//         path = join(__dirname + '../../public/data', pathName)
//     }
//     fs.readFile(path, 'utf8', function (err, data) {
//         if (err) {
//             console.log(err)
//         } else {
//             event.reply('render-receive-read-data-table', data)
//         }
//     })
// })

// 渲染进程发起数据表创建
// ipcMain.on('render-send-found-data-table', function (_, i: boolean, data) {
//     let name: string;
//     let database: string = JSON.stringify([[[]]]);
//     if (i) {
//         name = data + '_' + dayjs().format('YYYY_MM_DD_HH_mm_ss') + '.json'
//         localStore.set('dataTable', name)
//     } else {
//         name = localStore.get('dataTable')
//         database = data
//     }
//     let path = join(__dirname, '../../data', name);
//     if (process.env.VITE_DEV_SERVER_URL) {
//         path = join(__dirname + '../../public/data', name);
//     }
//     fs.writeFile(path, database, 'utf8', function (err) {
//         if (err) console.log(err)
//     })
// })
}


