import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import electron from "vite-plugin-electron";
import Icons from 'unplugin-icons/vite';
import IconResolver from 'unplugin-icons/resolver'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import {join} from 'path'
import {NaiveUiResolver} from "unplugin-vue-components/resolvers";

export default defineConfig({
    plugins: [
        vue(),
        electron({
            entry: 'electron/main.ts',
        }),
        AutoImport({
            resolvers: [],
            dts: 'src/type/auto-imports.d.ts',
        }),
        Components({
            resolvers: [
                NaiveUiResolver(),
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
    resolve: {
        alias: {
            '@': join(__dirname, 'src'),
        }
    },
})
