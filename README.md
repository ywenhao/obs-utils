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

  return defineConfig({
    plugins: [
      reStaticToObs({
        obsUrl,
        // obsUrl: 'https://bmjs.oss-cn-hangzhou.aliyuncs.com',
      }),
      // ...其他插件
      // deleteDirs({
      //  dirs: ['static', 'assets'],
      // }),
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
需要安装 `tsx` 插件

```json
// package.json
{
  "scripts": {
    "obs-upload": "obs-upload dist/build/h5 h5",
    "obs-upload:assets": "obs-upload dist/build/h5/assets h5/assets",
    "obs-upload:static": "obs-upload dist/build/h5/static h5/static"
  }
}
```

# .env 文件 示例

```env
# obs 地址
VITE_OBS_URL="https://obs.cn-north-4.myhuaweicloud.com"

VITE_OBS_USER_NAME="xxx"
VITE_OBS_ACCESS_KEY_ID="xxx"
VITE_OBS_SECRET_ACCESS_KEY="xxx"
```
