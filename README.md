# 这是一个 obs 工具相关的库

# 环境

vite + uniapp

# deleteDirs

打包后删除产物中 static 文件夹

在 vite.config.ts 配置

```ts
import { deleteDirs, reStaticToObs } from '@bmjs/obs-utils/vite'

export default async ({ mode }: ConfigEnv) => {

  const env = loadEnv(mode, process.cwd())
  const { VITE_BASE_URL } = env
  const obsUrl = env.VITE_OBS_URL.replace('//obs', `//${env.VITE_OBS_USER_NAME}.obs`) + '/h5'

  const isMP_WEIXIN = process.env.UNI_PLATFORM === 'mp-weixin'

  return defineConfig({
    plugins: [
      reStaticToObs({
        obsUrl,
        enable: true,
        // obsUrl: 'https://bmjs.oss-cn-hangzhou.aliyuncs.com',
      }),
      // deleteDirs({
      //  enable: isMP_WEIXIN,
      //  dirs: ['static', 'assets'],
      //  exclude: ['tabBar']
      // }),
      // ...其他插件
    ],
    // 这里影响assets产物的路径
    base: mode === 'development' ? './' : obsUrl,
  })
});

```

# reStaticToObs 如上

替换文件中的 static url 为 obs 地址

# obs-upload

上传到华为云 obs
`obs-upload [source] [target]`

```json
// package.json
{
  "scripts": {
    "obs-upload": "obs-upload",
  }
}
```

# .env 文件 示例

```ts
// obs-upload.config.ts

import { defineConfig } from '@bmjs/obs-utils/upload'

export default defineConfig({
  obsUrl: 'https://obs.cn-north-4.myhuaweicloud.com',
  obsUserName: 'admin',
  obsAccessKeyId: 'admin',
  obsSecretAccessKey: 'admin',
  // { 本地要上传的文件路径 : obs 上的文件路径 }
  entry: {
    './dist/build/h5': 'h5',
  },
})

```
