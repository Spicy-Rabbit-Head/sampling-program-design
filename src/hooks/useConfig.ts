import {reactive, ref} from "vue";
import {SelectOption} from "naive-ui";

// 车间选项
const workshopOptions = reactive<Array<SelectOption>>([])
// 权限
const changePermission = ref<boolean>(false)
// 密码输入框是否显示
const visible = ref(false)
// 密码
const password = ref("")

export function useConfig() {
    // 更新车间选项
    function addWorkshopOptions(value: Array<SelectOption>) {
        workshopOptions.length = 0
        workshopOptions.push(...value)
    }

    // 比对成功
    function comparisonSuccess() {
        changePermission.value = true
        visible.value = false
    }

    // 退出权限
    function exitPermission() {
        changePermission.value = false
    }

    // 取消按钮
    function handleCancel() {
        visible.value = false
        password.value = ""
    }

    // 密码比对
    function passwordComparison() {
        if (password.value === "666666") {
            password.value = ""
            return true
        } else {
            return false
        }
    }

    return {
        workshopOptions,
        addWorkshopOptions,
        exitPermission,
        comparisonSuccess,
        changePermission,
        visible,
        handleCancel,
        passwordComparison,
        password
    }
}