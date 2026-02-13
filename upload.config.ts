// import { defineConfig } from './src/upload/oss'

// export default defineConfig({
//   obsUrl: 'https://obs.cn-north-4.myhuaweicloud.com',
//   obsUserName: 'admin',
//   obsAccessKeyId: 'admin',
//   obsSecretAccessKey: 'admin',
//   entry: {
//     './dist': 'dist',
//   },
// })

import { defineConfig } from './src/upload/oss'

export default defineConfig({
  region: 'https://obs.cn-north-4.myhuaweicloud.com',
  bucket: 'admin',
  accessKeyId: 'admin',
  accessKeySecret: 'admin',
  entry: {
    './dist': 'dist',
  },
})
