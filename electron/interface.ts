export type Data = {
    testData: Array<string>
}

export const LocalStoreInterface = {
    // 当前QCC文件路径
    filePath: {
        type: 'string',
    },
    // 当前校准模式
    currentCalibrationMode: {
        type: 'string',
    },
    // 250B配置文件路径
    iniConfiguration: {
        type: 'string',
    },
    // 标品数据路径
    standardProductPath: {
        type: 'string',
    },
    // 标品数据密码
    standardProductPassword: {
        type: 'string',
    },
    // 权限密码
    permissionPassword: {
        type: 'string',
    },
    // 当前车间
    currentWorkshop: {
        type: 'string',
    },
    // 当前地址
    location: {
        type: 'string',
    },
    // 校对机运行模式
    proofreadingOperationMode: {
        type: 'integer',
    },
}