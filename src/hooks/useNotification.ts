import {Notification} from '@arco-design/web-vue';

function errNotification(content: string) {
    Notification.error({
        title: '异常',
        content: content,
        duration: 3000,
    });
}


export function useNotification() {
    return {
        errNotification
    }
}