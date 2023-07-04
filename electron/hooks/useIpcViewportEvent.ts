import {BrowserWindow} from "electron";


// 窗口事件监听
export function useIpcViewportEvent(main: BrowserWindow) {
    // 主窗口最大化
    main.on('maximize', () => {
        main.webContents.send('main-max-windows')
    })

    // 主窗口最小化
    main.on('unmaximize', () => {
        main.webContents.send('main-min-windows')
    })
}