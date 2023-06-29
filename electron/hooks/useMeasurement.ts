const edge = require('electron-edge-js');
const path = require('path');

const ConnectToServer = edge.func({
    assemblyFile: "D:\\.work_documents\\Syncdisk\\ProjectCode\\Web\\sampling-program-design\\public\\dll\\W250BOLE.dll",
    typeName: "W250BOLE.SA250B",
    methodName: "Open",
})
ConnectToServer(null,(error, value) => {
    if (error) throw error;
    console.log(error, value)
})


export function useMeasurement() {

    return {
        path
    }
}