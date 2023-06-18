import {app, BrowserWindow, ipcMain} from 'electron';

// 主进程入口
app.whenReady().then(() => {
    const win = new BrowserWindow({
        // 最小窗口大小
        minWidth: 600,
        minHeight: 400,
        frame: false,
        // 隐藏默认菜单栏
        autoHideMenuBar: true,
        // 图标
        icon: 'public/favicon.png',
        // 首选项
        webPreferences: {
            // 是否启用node集成
            nodeIntegration: true,
            // 关闭安全警告
            contextIsolation: false,
        },
        // 标题
        title: 'Vite Electron App',
    })
    // 环境判断加载页面
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

    // 创建新窗口
    ipcMain.on('open', () => {
        const newWin = new BrowserWindow({
            width: 200,
            height: 200,
        })
        newWin.loadURL(process.env.VITE_DEV_SERVER_URL).then()
    });

    // 发送事件到渲染进程
    setTimeout(() => {
        win.webContents.send('reply', '你好，渲染进程！')
    }, 3000)
});

app.on('window-all-closed', () => {
    console.log('window-all-closed')
    app.quit();
});