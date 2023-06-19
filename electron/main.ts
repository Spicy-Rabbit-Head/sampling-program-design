import {app} from 'electron';
import {useBrowserWindow} from "./hooks/useBrowserWindow";
import {useIpcEvent} from "./hooks/useIpcEvent";

const {buildMainWindow} = useBrowserWindow();
// 主进程入口
app.whenReady().then(() => {
    // 窗口建造
    const mainWin = buildMainWindow();
    // 事件监听
    useIpcEvent(mainWin)
});

app.on('window-all-closed', () => {
    console.log('window-all-closed')
    app.quit();
});