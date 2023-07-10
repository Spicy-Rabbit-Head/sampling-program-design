const {parentPort} = require('worker_threads')


// 自动运行
function autoRun() {
    const interval = setInterval(() => {
        parentPort.postMessage('autoCalibration')
    }, 2000)
}

autoRun()

