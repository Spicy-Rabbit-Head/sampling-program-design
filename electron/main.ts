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
    // 事件监听
    useIpcEvent(main, worker)
    useIpcViewportEvent(main)
});

app.on('window-all-closed', () => {
    console.log('window-all-closed')
    app.quit();
});