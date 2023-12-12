import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import AutoImport from 'unplugin-auto-import/vite'
// import Components from 'unplugin-vue-components/vite'
// 假如要加载一些 commonjs 模块，需要引入这个插件，很多地图的sdk都是 commonjs，假如引用报错需要引入它并添加到 `plugins` 里
// import commonjs from "@rollup/plugin-commonjs";
import { UnifiedViteWeappTailwindcssPlugin as uvtw } from 'weapp-tailwindcss/vite'
import { WeappTailwindcssDisabled } from './platform'
import { plugins as postcssPlugins } from './postcss.config.cjs'
// https://vitejs.dev/config/
export default defineConfig({
  // uvtw 一定要放在 uni 后面
  plugins: [
    uni(),
    uvtw({
      disabled: WeappTailwindcssDisabled
    }),
    AutoImport({
      imports: [
        'vue',
        'uni-app',
        'pinia',
        '@vueuse/core',
        // {
        //   'xe-utils': [['*', 'xe']]
        // },
        {
          dayjs: [['default', 'dayjs']]
        },
        {
          lodash: [['*','lo']]
        },
        {
          rxjs: [['*', 'rx']]
        },
        {
          'wot-design-uni': [['*', 'wot']]
        }
      ],
      dirs: ['./src/utils/**/*', './src/config/**/*'],
      dts: './src/auto-imports.d.ts',
      eslintrc: {
        enabled: true
      }
    })
    // uni-app vite 中不起作用，不知道为啥
    // Components({
    //   dts: './src/components.d.ts'
    // })
  ],
  // 内联 postcss 注册 tailwindcss
  css: {
    postcss: {
      plugins: postcssPlugins
    }
  },

  server: {
    host: '0.0.0.0',
    port: 3333, // 端口号
    open: false, // 是否自动打开浏览器
    hmr: true,
    // cors: true,

    proxy: {
      '/devSto': {
        target: 'http://192.168.30.15:30610/sto',
        // target: 'http://192.168.150.250:30600',
        rewrite: (path) => path.replace(/^\/devSto/, ''),
        changeOrigin: true
      },
      '/dev': {
        target: 'http://192.168.30.15:30600',
        // target: 'http://192.168.150.250:30600',
        rewrite: (path) => path.replace(/^\/dev/, ''),
        changeOrigin: true
      },

      '/mjSto': {
        target: 'http://192.168.30.11:30610/sto',
        rewrite: (path) => path.replace(/^\/mjSto/, ''),
        changeOrigin: true
      },

      '/mj': {
        target: 'http://192.168.30.11:30600',
        rewrite: (path) => path.replace(/^\/mj/, ''),
        changeOrigin: true
      },
      '/uat': {
        target: 'https://7k20s48526.zicp.fun',
        rewrite: (path) => path.replace(/^\/uat/, ''),
        changeOrigin: true
      },
      // '/prod': {
      //   target: 'http://workorder.btosolarman.com:30600',
      //   rewrite: (path) => path.replace(/^\/prod/, ''),
      //   changeOrigin: true
      // },
      '/sit': {
        target: 'http://192.168.150.250:30600',
        rewrite: (path) => path.replace(/^\/sit/, ''),
        changeOrigin: true
      }
    }
  }
})
