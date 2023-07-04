import {BrowserWindow} from "electron";

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
            icon: 'public/img/favicon.png',
            // 首选项
            webPreferences: {
                // 是否启用node集成
                nodeIntegration: true,
                // 关闭安全警告
                contextIsolation: false,
            },
            // 标题
            title: 'Vite Electron App',
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

    return {
        buildMainWindow
    }
}