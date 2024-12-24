# 这是一个 obs 上传相关的库

# 环境

vite + uniapp

# deleteStatic

打包后删除产物中 static 文件夹

在 vite.config.ts 配置

```ts
export default async ({ mode }: ConfigEnv) => {

  const env = loadEnv(mode, process.cwd())
  const { VITE_BASE_URL } = env
  const staticUrl = env.VITE_OBS_URL.replace('//obs', `//${env.VITE_OBS_USER_NAME}.obs`) + '/h5'

  return defineConfig({
    plugins: [
      // obsStatic({ obsUrl: staticUrl }),
      // ...其他插件
      //deleteStatic(['tabBar'])
    ],
    base: mode === 'development' ? './' : staticUrl,
  })
});

```

# obsStatic 如上

替换文件中的 static url 为 obs 地址

# upload-assets

# upload-static

上传到华为云 obs
需要安装 `tsx` 插件

```json
// package.json
{
  "scripts": {
    "upload:obs": "pnpm run upload:obs-assets && pnpm run upload:obs-static",
    "upload:obs-static": "tsx ./node_modules/@bmjs/obs-upload/src/upload-static",
    "upload:obs-assets": "tsx ./node_modules/@bmjs/obs-upload/src/upload-assets"
  }
}
```

# .env 文件 示例

# obs 地址

```env
VITE_OBS_URL="https://obs.cn-north-4.myhuaweicloud.com"

VITE_OBS_USER_NAME="xxx"
VITE_OBS_ACCESS_KEY_ID="xxx"
VITE_OBS_SECRET_ACCESS_KEY="xxx"
```
