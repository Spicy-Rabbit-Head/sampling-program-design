// 引入js
import {createRouter, createWebHistory, Router, RouteRecordRaw} from 'vue-router'

const Home = () => import('@/view/home/HomePage.vue')
const Verifier = () => import('@/view/verifier/ProofreadingMachineModule.vue')
const test2 = () => import('@/view/test/test2.vue')
const ConfigurationPage = () => import('@/view/configuration/ConfigurationPage.vue')

// 定义路由
const routes = [
    // 根目录重定向
    {
        path: '/',
        name: 'RootPath',
        redirect: '/home',
    },
    {
        path: '/home',
        name: 'Home',
        component: Home,
    },
    {
        path: '/verifier',
        name: 'Verifier',
        component: Verifier,
    },
    {
        path: '/test2',
        name: 'test2',
        component: test2,
    },
    {
        path: '/configuration',
        name: 'ConfigurationPage',
        component: ConfigurationPage,
    },
    // 匹配所有路径,如果没有匹配到,则重定向到404页面
    {
        path: '/:pathMatch(.*)*',
        redirect: '/null-exception'
    }
]

// 创建路由实例并定义路由配置
const router: Router = createRouter({
    history: createWebHistory("/"),
    routes: <RouteRecordRaw[]>routes,
})

// 前置全局守卫
router.beforeEach((to, from, next) => {
    console.log("路由跳转开始")
    console.log(from.path)
    console.log(to.matched)
    next()
})
// 后置全局守卫
router.afterEach((to) => {

    console.log(to.path)
    console.log("路由跳转结束")
})
// 路由跳转错误
router.onError((error) => {
    console.log("路由跳转错误:")
    console.log(error)
    router.replace({name: 'NullException'}).then()
})


// 导出
export default router