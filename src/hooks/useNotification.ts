import { createDiscreteApi, } from 'naive-ui';

const {notification} = createDiscreteApi(
    ['notification']
)

function errNotification(content: string) {
    notification.error({
        title: '异常',
        content: content,
        duration: 3000,
    });
}

function successNotification(content: string) {
    notification.success({
        title: '成功',
        content: content,
        duration: 3000,
    });
}


export function useNotification() {
    return {
        errNotification,
        successNotification
    }
}