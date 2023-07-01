const edge = require('electron-edge-js');

const url = "D:\\.work_documents\\Syncdisk\\ProjectCode\\C#\\Measurement\\obj\\x86\\Debug\\Measurement.dll"


const OpenMeasuringProgram = edge.func({
    assemblyFile: url,
    typeName: "Measurement.Sa250B",
    methodName: "OpenMeasuringProgram",
})

const CloseMeasuringProgram = edge.func({
    assemblyFile: url,
    typeName: "Measurement.Sa250B",
    methodName: "CloseMeasuringProgram",
})

const Get = edge.func({
    assemblyFile: url,
    typeName: "Measurement.Sa250B",
    methodName: "GetText",
})

const Set = edge.func({
    assemblyFile: url,
    typeName: "Measurement.Sa250B",
    methodName: "SetText",
})


function open() {
    OpenMeasuringProgram(null, (error: any, value: any) => {
        if (error) throw error;
        console.log(error, value)
    })
}

function close() {
    CloseMeasuringProgram(null, (error: any, value: any) => {
        if (error) throw error;
        console.log(error, value)
    })
}

function get() {
    Get(null, (error: any, value: any) => {
        if (error) throw error;
        console.log(value)
    })
}

function set() {
    Set("233", (error: any, value: any) => {
        if (error) throw error;
        console.log(value)
    })
}

export function useMeasurement() {
    return {
        open,
        close,
        get,
        set
    }
}