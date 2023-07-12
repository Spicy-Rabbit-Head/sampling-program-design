import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import electron from "vite-plugin-electron";
import Icons from 'unplugin-icons/vite';
import IconResolver from 'unplugin-icons/resolver'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import {join} from 'path'
import {ArcoResolver, NaiveUiResolver} from "unplugin-vue-components/resolvers";

export default defineConfig({
    plugins: [
        vue(),
        electron({
            entry: 'electron/main.ts',
        }),
        AutoImport({
            resolvers: [
                ArcoResolver(),
            ],
            dts: 'src/type/auto-imports.d.ts',
        }),
        Components({
            resolvers: [
                NaiveUiResolver(),
                ArcoResolver({
                    sideEffect: true
                }),
                IconResolver({
                    prefix: 'icon',
                    enabledCollections: ['ant-design'],
                })],
            dts: 'src/type/components.d.ts',
        }),
        Icons({
            compiler: 'vue3'
        })
    ],
    build: {
        // css代码分割
        cssCodeSplit: true,
        // 源地图
        sourcemap: false,
        // 内联动态导入的最大文件大小
        assetsInlineLimit: 4096,
        // 打包策略
        rollupOptions: {
            // 输出
            output: {
                // 手动指定
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        // 根据包名分割
                        return id.toString().split('node_modules/')[1].split('/')[0].toString()
                    }
                },
            },
            input: {
                index: join(__dirname, 'index.html'),
                worker: join(__dirname, 'electron/worker/worker.html'),
            }
        }
    },
    resolve: {
        alias: {
            '@': join(__dirname, 'src'),
        }
    },
})
