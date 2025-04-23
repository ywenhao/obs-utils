import { defineConfig } from './src/upload'

export default defineConfig({
  obsUrl: 'https://obs.cn-north-4.myhuaweicloud.com',
  obsUserName: 'admin',
  obsAccessKeyId: 'admin',
  obsSecretAccessKey: 'admin',
  entry: {
    './dist': 'dist',
  },
})
