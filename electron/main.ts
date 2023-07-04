import {app} from 'electron';
import {useBrowserWindow} from "./hooks/useBrowserWindow";
import {useIpcEvent} from "./hooks/useIpcEvent";
import {useIpcViewportEvent} from "./hooks/useIpcViewportEvent";

const {buildMainWindow} = useBrowserWindow();
// 主进程入口
app.whenReady().then(() => {
    // 窗口建造
    const main = buildMainWindow();
    // 事件监听
    useIpcEvent(main)
    useIpcViewportEvent(main)
});

app.on('window-all-closed', () => {
    console.log('window-all-closed')
    app.quit();
});