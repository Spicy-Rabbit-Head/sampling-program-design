import {MenuOptions, TopBarWindow} from "@/type/interface.ts";
import IconAntDesignMinusOutlined from "~icons/ant-design/minus-outlined"
import IconAntDesignBlockOutlined from "~icons/ant-design/block-outlined"
import IconAntDesignBorderOutlined from "~icons/ant-design/border-outlined"
import IconAntDesignCloseOutlined from "~icons/ant-design/close-outlined"
import {reactive, ref} from "vue";
import {useIpcRenderer} from "@vueuse/electron";
import router from "@/router";

const ipcRenderer = useIpcRenderer()
// 窗口功能Icon
const topBarWindow: TopBarWindow[] = [
    IconAntDesignMinusOutlined,
    IconAntDesignBlockOutlined,
    IconAntDesignBorderOutlined,
    IconAntDesignCloseOutlined,
]
// 窗口功能状态
const topBarWindowState: Array<boolean> = reactive([
    true,
    false,
    true,
    true
])
// 菜单
const menuOptions = ref<Array<MenuOptions>>([
    {
        label: '首页',
        key: 'Home',
        class: 't-text-emerald-500'
    },
    {
        label: '校对机',
        key: 'Verifier',
        class: ''
    },
    {
        label: '刹车点',
        key: 'test2',
        class: ''
    },
])

export function useTopBar() {
    // 窗口功能切换
    function topBarFunction(i: number) {
        switch (i) {
            case 0:
                ipcRenderer.send('window-min')
                break
            case 1:
                ipcRenderer.send('window-restore')
                topBarWindowState[1] = false
                topBarWindowState[2] = true
                break
            case 2:
                ipcRenderer.send('window-max')
                topBarWindowState[1] = true
                topBarWindowState[2] = false
                break
            case 3:
                ipcRenderer.send('window-close')
                break
        }
    }

    // 菜单切换
    function tagsToggle(key: string) {
        router.replace({name: key}).then(
            () => {
                menuOptions.value.forEach(item => {
                    if (item.key === key) {
                        item.class = 't-text-emerald-500'
                    } else {
                        item.class = ''
                    }
                })
            }
        )
    }

    return {
        topBarWindow,
        topBarWindowState,
        topBarFunction,
        menuOptions,
        tagsToggle
    }
}