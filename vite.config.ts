import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import electron from "vite-plugin-electron";
import Icons from 'unplugin-icons/vite';
import IconResolver from 'unplugin-icons/resolver'
import Components from 'unplugin-vue-components/vite'

export default defineConfig({
    plugins: [
        vue(),
        electron({
            entry: 'electron/main.ts',
        }),
        Components({
            resolvers: [
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
})
