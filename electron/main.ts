import {app} from 'electron';
import {useBrowserWindow} from "./hooks/useBrowserWindow";
import {useIpcEvent} from "./hooks/useIpcEvent";
import {useIpcViewportEvent} from "./hooks/useIpcViewportEvent";

const {buildMainWindow, workerWindow} = useBrowserWindow();
// 主进程入口
app.whenReady().then(() => {
    // 窗口建造
    const main = buildMainWindow();
    const worker = workerWindow();
    // const sqlite = sqliteWindow();
    // 事件监听
    useIpcEvent(main, worker)
    useIpcViewportEvent(main)
});

app.on('window-all-closed', () => {
    app.quit();
});

// 监听任务栏关闭事件
app.on('before-quit', () => {
    // 在这里执行你想要的操作，例如保存数据或执行清理
    console.log('Application is about to quit');
});