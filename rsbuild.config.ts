import { defineConfig } from '@rsbuild/core';
// import { pluginLess } from '@rsbuild/plugin-less';
import { pluginNodePolyfill } from '@rsbuild/plugin-node-polyfill';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginSvgr } from '@rsbuild/plugin-svgr';
import { RsdoctorRspackPlugin } from '@rsdoctor/rspack-plugin';

const host = process.env.TAURI_DEV_HOST;

const isDev = !!host;
export default defineConfig((env) => ({
  html: {
    template: './index.html',
  },
  source: {
    entry: {
      index: './src/main.tsx',
    },
    // aliasStrategy: 'prefer-alias',
  },
  plugins: [
    pluginSvgr({
      mixedImport: true,
      svgrOptions: {
        exportType: 'named',
      },
    }),
    pluginReact(),
    pluginNodePolyfill(),
  ],
  output: {
    polyfill: !isDev ? 'entry' : 'off',
    // overrideBrowserslist: browserslist,
    minify: isDev ? false : true,
  },
  dev: {
    hmr: !!host,
  },
  server: {
    strictPort: true,
    port: 1420,
    host: host || '0.0.0.0',
    // https: !!process.env.HTTPS,
    // proxy: {
    //   '/api-dev-proxy/': {
    //     target: process.env.API_PROXY_TARGET || 'http://127.0.0.1:5634',
    //     changeOrigin: true,
    //     pathRewrite: { '^/api-dev-proxy': '' },
    //     ws: true,
    //   },
    // },
  },
  tools: {
    rspack(config, { appendPlugins, addRules }) {
      if (process.env.RSDOCTOR) {
        appendPlugins(
          new RsdoctorRspackPlugin({
            // 插件选项
            supports: {
              generateTileGraph: true,
            },
          }),
        );
      }
      config.watchOptions ??= {};
      config.watchOptions.ignored = [
        "node_modules",
        "**/src-tauri/**"
      ]
    }
  }
}));