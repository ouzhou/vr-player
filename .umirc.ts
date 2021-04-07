// more config: https://d.umijs.org/config

import { defineConfig } from 'dumi';

export default defineConfig({
  title: 'VrPlayer',
  outputPath: 'docs-dist',
  mode: 'site',
  hash: true,
  // history: { type: 'hash' },
  publicPath: process.env.NODE_ENV === 'production' ? '/vr-player/' : '/',
  base: process.env.NODE_ENV === 'production' ? '/vr-player/' : '/',
  exportStatic: {},
  logo:
    process.env.NODE_ENV === 'production' ? '/vr-player/logo.png' : '/logo.png',
  favicon:
    process.env.NODE_ENV === 'production' ? '/vr-player/logo.png' : '/logo.png',
});
