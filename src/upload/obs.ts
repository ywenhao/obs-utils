import type { ObsUploadConfig } from './types'
import fs from 'node:fs'
import c from 'ansis'
import { consola } from 'consola'
// eslint-disable-next-line ts/ban-ts-comment
// @ts-ignore
import ObsClient from 'esdk-obs-nodejs'
import fg from 'fast-glob'
import { configLoader } from './config'
// const ObsClient = require('esdk-obs-nodejs')

export async function createObs() {
  const loader = await configLoader.load()
  const config = loader.config as ObsUploadConfig

  if (
    !config.obsUrl
    || !config.obsUserName
    || !config.obsAccessKeyId
    || !config.obsSecretAccessKey
    || !config.entry
    || Object.keys(config.entry).length === 0
    || Object.values(config.entry).some(v => !v)
  ) {
    consola.error(new Error('obs-upload.config.ts 没有正确配置'))
    process.exit(1)
  }

  const obsClient = new ObsClient({
    access_key_id: config.obsAccessKeyId,
    secret_access_key: config.obsSecretAccessKey,
    server: config.obsUrl,
  })

  return { obsClient, config }
}

function getPathsByArgv() {
  const argv = process.argv.slice(2)
  if (argv.length) {
    if (argv.length !== 2) {
      consola.error(new Error('命令参数不正确'))
      process.exit(1)
    }
    return { [argv[0]]: argv[1] }
  }
}

export async function uploadObs() {
  const { obsClient, config } = await createObs()
  const paths = getPathsByArgv()
  const entry = paths || config.entry

  for (const sourcePath in entry) {
    start(sourcePath, entry[sourcePath])
  }

  // 定义一个异步函数用于上传文件
  async function upload(filePath: string, sourcePath: string, targetPath: string) {
    // const filename = filePath.split('/').pop()
    const fileKey = `${targetPath}${filePath.split(sourcePath)[1]}`

    try {
      // 设置OBS上传参数
      const params = {
        Bucket: config.obsUserName,
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
          params.Bucket,
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
        'An ObsError was found, which means your request sent to OBS was rejected with an error response.',
      )
      consola.error('Status: %d', result.CommonMsg.Status)
      consola.error('Code: %s', result.CommonMsg.Code)
      consola.error('Message: %s', result.CommonMsg.Message)
      consola.error('RequestId: %s', result.CommonMsg.RequestId)
    }
    catch (error) {
      // 捕获上传过程中发生的异常
      consola.error(
        'An Exception was found, which means the client encountered an internal problem when attempting to communicate with OBS, for example, the client was unable to access the network.',
      )
      consola.error(error)
    }
  }

  // 设置最大并发池大小
  const MAX_POOL_SIZE = 10

  async function start(sourcePath: string, targetPath: string) {
    // 使用fast-glob库获取指定路径下的文件列表
    consola.log(c.greenBright`开始上传 ${sourcePath} 到 ${targetPath}`)
    const glob = await fg(`${sourcePath}/**/*`, { absolute: true })
    // 过滤出文件列表，只保留存在的文件
    const list = glob.filter(v => fs.existsSync(v) && fs.statSync(v).isFile())

    // 并发处理文件上传
    // 循环处理文件列表，每批处理MAX_POOL_SIZE个文件
    for (let i = 0; i < list.length; i += MAX_POOL_SIZE) {
      // 使用Promise.all并发处理文件上传
      await Promise.all(list.slice(i, i + MAX_POOL_SIZE)
        .map(item => upload(item, sourcePath, targetPath)))
    }
    consola.log(c.greenBright`${sourcePath} 到 ${targetPath} 上传完成`)
  }
}

// 开始执行文件上传
uploadObs()
