import fg from 'fast-glob'
import fs from 'node:fs'
import consola from 'consola'
import { loadEnv } from 'vite'
// @ts-ignore
import ObsClient from 'esdk-obs-nodejs'
// const ObsClient = require('esdk-obs-nodejs')

export function createObs(): { obsClient: any; env: Record<string, string> } {
  const env = loadEnv('', process.cwd())

  if (
    !env?.VITE_OBS_ACCESS_KEY_ID ||
    !env?.VITE_OBS_SECRET_ACCESS_KEY ||
    !env?.VITE_OBS_URL ||
    !env?.VITE_OBS_USER_NAME
  ) {
    consola.error(new Error('env 没有正确配置'))
    process.exit(1)
  }

  const obsClient = new ObsClient({
    access_key_id: env.VITE_OBS_ACCESS_KEY_ID,
    secret_access_key: env.VITE_OBS_SECRET_ACCESS_KEY,
    server: env.VITE_OBS_URL,
  })

  return { obsClient, env }
}

function getPathsByArgv() {
  const argv = process.argv.slice(2)
  if (argv.length !== 2) {
    consola.error(new Error('请输入正确的参数'))
    process.exit(1)
  }
  return { inPath: argv[0], uploadPrefix: argv[1] }
}

export const uploadObs = async () => {
  const { obsClient, env } = createObs()
  const { inPath, uploadPrefix } = getPathsByArgv()

  // 定义一个异步函数用于上传文件
  async function upload(filePath: string) {
    // const filename = filePath.split('/').pop()
    const fileKey = `${uploadPrefix}${filePath.split(inPath)[1]}`

    try {
      // 设置OBS上传参数
      const params = {
        Bucket: env.VITE_OBS_USER_NAME,
        Key: fileKey,
        SourceFile: filePath,
        ACL: obsClient.enums.AclPublicRead,
      }

      const result = await obsClient.putObject(params)
      // 判断上传结果的状态码是否小于等于300
      if (result.CommonMsg.Status <= 300) {
        // 成功上传文件到OBS
        consola.success(
          'Put object(%s) under the bucket(%s) successful!!',
          params.Key,
          params.Bucket
        )
        // consola.info('RequestId: %s', result.CommonMsg.RequestId)
        // consola.info(
        //   'StorageClass:%s, ETag:%s',
        //   result.InterfaceResult.StorageClass,
        //   result.InterfaceResult.ETag
        // )
        return
      }
      // 上传失败，输出错误信息
      consola.error(
        'An ObsError was found, which means your request sent to OBS was rejected with an error response.'
      )
      consola.error('Status: %d', result.CommonMsg.Status)
      consola.error('Code: %s', result.CommonMsg.Code)
      consola.error('Message: %s', result.CommonMsg.Message)
      consola.error('RequestId: %s', result.CommonMsg.RequestId)
    } catch (error) {
      // 捕获上传过程中发生的异常
      consola.error(
        'An Exception was found, which means the client encountered an internal problem when attempting to communicate with OBS, for example, the client was unable to access the network.'
      )
      consola.error(error)
    }
  }

  // 使用fast-glob库获取指定路径下的文件列表
  const glob = await fg(`${inPath}/**/*`, { absolute: true })
  // 过滤出文件列表，只保留存在的文件
  const list = glob.filter((v) => fs.existsSync(v) && fs.statSync(v).isFile())

  // 并发处理文件上传
  // 设置最大并发池大小
  const MAX_POOL_SIZE = 10
  // 循环处理文件列表，每批处理MAX_POOL_SIZE个文件
  for (let i = 0; i < list.length; i += MAX_POOL_SIZE) {
    // 使用Promise.all并发处理文件上传
    await Promise.all(list.slice(i, i + MAX_POOL_SIZE).map((item) => upload(item)))
  }
}

// 开始执行文件上传
uploadObs()
