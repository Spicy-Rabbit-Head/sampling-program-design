import {app, BrowserWindow, ipcMain} from 'electron';


app.whenReady().then(() => {
    const win = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
        title: 'Vite Electron App',
    })
    if (process.env.VITE_DEV_SERVER_URL) {
        win.webContents.openDevTools();
        win.loadURL(process.env.VITE_DEV_SERVER_URL).then()
    } else {
        win.loadFile('dist/index.html').then()
    }

    // 接收渲染进程的事件
    ipcMain.on('message', (_, arg) => {
        console.log(arg)
    })

    // 发送事件到渲染进程
    setTimeout(() => {
        win.webContents.send('reply', '你好，渲染进程！')
    },3000)

});