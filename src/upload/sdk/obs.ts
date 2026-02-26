import type { ObsUploadConfig } from '../types'
import { consola } from 'consola'
// eslint-disable-next-line ts/ban-ts-comment
// @ts-ignore
import ObsClient from 'esdk-obs-nodejs'

function checkConfig(config: ObsUploadConfig) {
  if (
    !config.url
    || !config.userName
    || !config.accessKeyId
    || !config.secretAccessKey
  ) {
    consola.error(new Error('upload.config.ts 没有正确配置'))
    process.exit(1)
  }
}

function createClient(config: ObsUploadConfig) {
  return new ObsClient({
    access_key_id: config.accessKeyId,
    secret_access_key: config.secretAccessKey,
    server: config.url,
  })
}

async function upload({
  client,
  config,
  fileKey,
  filePath,
  // sourcePath,
  // targetPath,
}: {
  client: any
  config: ObsUploadConfig
  fileKey: string
  filePath: string
  sourcePath: string
  targetPath: string
}) {
  try {
    // 设置OBS上传参数
    const params = {
      Bucket: config.userName,
      Key: fileKey,
      SourceFile: filePath,
      ACL: client.enums.AclPublicRead,
    }

    const result = await client.putObject(params)
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
    throw new Error('上传失败')
  }
  catch (error) {
    // 捕获上传过程中发生的异常
    consola.error(
      'An Exception was found, which means the client encountered an internal problem when attempting to communicate with OBS, for example, the client was unable to access the network.',
    )
    consola.error(error)
    throw new Error('上传失败')
  }
}

export const obs = { checkConfig, createClient, upload }
