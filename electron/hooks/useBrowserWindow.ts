import {BrowserWindow} from "electron";
import {posix} from "path"

// 窗口建造
export function useBrowserWindow() {
    // 创建主窗口
    function buildMainWindow() {
        const main = new BrowserWindow({
            width: 1300,
            height: 800,
            // 最小窗口大小
            minWidth: 1260,
            minHeight: 800,
            frame: false,
            // 隐藏默认菜单栏
            autoHideMenuBar: true,
            // 图标
            icon: 'dist/img/favicon.ico',
            // 首选项
            webPreferences: {
                // 是否启用node集成
                nodeIntegration: true,
                // 关闭安全警告
                contextIsolation: false,
                // 辅助节点集成
                nodeIntegrationInWorker: true,
            },
            // 标题
            title: '抽测程式',
        });
        // 环境判断加载页面
        if (process.env.VITE_DEV_SERVER_URL) {
            // 打开开发者工具
            main.webContents.toggleDevTools();
            main.loadURL(process.env.VITE_DEV_SERVER_URL).then()
        } else {
            main.loadFile('dist/index.html').then();
        }
        return main
    }

    // 建造工作进程
    function workerWindow() {
        const worker = new BrowserWindow({
            show: false,
            webPreferences: {
                // 是否启用node集成
                nodeIntegration: true,
                // 关闭安全警告
                contextIsolation: false,
                // 辅助节点集成
                nodeIntegrationInWorker: true,
            },
            title: '服务进程',
        })
        if (process.env.VITE_DEV_SERVER_URL) {
            worker.webContents.toggleDevTools();
            worker.loadURL(posix.join(process.env.VITE_DEV_SERVER_URL, 'electron/worker', 'worker.html')).then()
        } else {
            worker.loadFile('dist/electron/worker/worker.html').then();
        }
        return worker;
    }

    // 建造sqlite进程
    function sqliteWindow() {
        const sqlite = new BrowserWindow({
            show: false,
            webPreferences: {
                // 是否启用node集成
                nodeIntegration: true,
                // 关闭安全警告
                contextIsolation: false,
                // 辅助节点集成
                nodeIntegrationInWorker: true,
            },
            title: 'sqlite进程',
        })
        if (process.env.VITE_DEV_SERVER_URL) {
            sqlite.webContents.toggleDevTools();
            sqlite.loadURL(posix.join(process.env.VITE_DEV_SERVER_URL, 'electron/sqlite', 'sqlite.html')).then()
        } else {
            sqlite.loadFile('dist/electron/sqlite/sqlite.html').then();
        }
        return sqlite;
    }

    return {
        buildMainWindow,
        workerWindow,
        sqliteWindow
    }
}