import {BrowserWindow} from "electron";


// 窗口事件监听
export function useIpcViewportEvent(main: BrowserWindow) {
    // 主窗口最大化
    main.on('maximize', () => {
        main.webContents.send('render-receive-max-windows')
    })

    // 主窗口最小化
    main.on('unmaximize', () => {
        main.webContents.send('render-receive-min-windows')
    })

    // 主窗口关闭
    main.on('close', () => {
        console.log('关闭窗口')
    })
}