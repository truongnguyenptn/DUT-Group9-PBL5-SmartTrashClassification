import path from 'path';
import fs from 'fs';
import { loadEnv } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';
import lessToJS from 'less-vars-to-js';
import viteAntdDayjs from 'vite-plugin-antd-dayjs';
import react from '@vitejs/plugin-react-swc';
import svgr from 'vite-plugin-svgr';
import pages from 'vite-plugin-pages';
import { sentryVitePlugin } from '@sentry/vite-plugin';
import { defineConfig } from 'vitest/config';

const themeVariables = lessToJS(
  fs.readFileSync(
    path.resolve(__dirname, './src/configs/theme/index.less'),
    'utf8',
  ),
);

function htmlPlugin(env: Record<string, string | undefined>) {
  return {
    name: 'html-transform',
    transformIndexHtml: {
      enforce: 'pre',
      transform: (html: string) => {
        return html.replace(/<%=(.*?)%>/g, (match, p1) => env[p1] ?? match);
      },
    },
  };
}

export default ({ mode }: { mode: string }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };
  return defineConfig({
    server: {
      port: 3000,
    },
    plugins: [
      htmlPlugin(process.env),
      svgr(),
      react(),
      pages({
        routeStyle: 'next',
        dirs: 'src/pages',
        importMode: 'async',
      }),
      viteAntdDayjs(),
      sentryVitePlugin({
        url: process.env.VITE_SENTRY_URL,
        authToken: process.env.VITE_SENTRY_AUTH_TOKEN,
        org: process.env.VITE_SENTRY_ORG,
        project: process.env.VITE_SENTRY_PROJECT,
        deploy: {
          env: 'staging',
        },
        include: './build',
      }),
    ],
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
          modifyVars: themeVariables,
        },
      },
    },
    resolve: {
      alias: [
        {
          find: /^#/,
          replacement: path.resolve(__dirname, 'src'),
        },
        { find: /^~antd/, replacement: 'antd' },
      ],
    },

    optimizeDeps: {
      include: ['@ant-design/icons'],
    },

    build: {
      sourcemap: true,
      outDir: 'build',
      rollupOptions: {
        plugins: [visualizer()],
      },
    },
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: ['./vitest.setup.ts'],
      deps: {
        inline: ['@enouvo/react-uikit'],
      },
      css: true,
    },
  });
};
