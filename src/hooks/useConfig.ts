import {reactive} from "vue";
import {SelectOption} from "naive-ui";

// 车间选项
const workshopOptions = reactive<Array<SelectOption>>([])

export function useConfig() {
    // 更新车间选项
    function addWorkshopOptions(value: Array<SelectOption>) {
        workshopOptions.length = 0
        workshopOptions.push(...value)
    }

    return {
        workshopOptions,
        addWorkshopOptions,
    }
}