import type { QiNiuUploadConfig } from '../types'
import { consola } from 'consola'
import qiniu$ from 'qiniu'

function checkConfig(config: QiNiuUploadConfig) {
  if (
    !config.bucket
    || !config.accessKey
    || !config.secretKey
  ) {
    consola.error(new Error('upload.config.ts 没有正确配置'))
    process.exit(1)
  }
}

function createClient(_config: QiNiuUploadConfig) {
  // return new OSS({
  //   bucket: config.bucket,
  //   accessKeyId: config.accessKeyId,
  //   accessKeySecret: config.accessKeySecret,
  //   authorizationV4: true,
  // })

  return qiniu$
}

async function upload({
  // client,
  config,
  fileKey,
  filePath,
  // sourcePath,
  // targetPath,
}: {
  client: typeof qiniu$
  config: QiNiuUploadConfig
  fileKey: string
  filePath: string
  sourcePath: string
  targetPath: string
}) {
  const bucket = config.bucket
  const accessKey = config.accessKey
  const secretKey = config.secretKey
  const mac = new qiniu$.auth.digest.Mac(accessKey, secretKey)
  const options = {
    scope: bucket,
  }
  const putPolicy = new qiniu$.rs.PutPolicy(options)

  const uploadToken = putPolicy.uploadToken(mac)
  const putExtra = new qiniu$.form_up.PutExtra()

  const config$ = new qiniu$.conf.Config()
  // 区域
  if (config.regionsProvider) {
    config$.regionsProvider = config.regionsProvider
  }
  const formUploader = new qiniu$.form_up.FormUploader(config$)

  try {
    const result = await formUploader.putFile(
      uploadToken,
      fileKey,
      filePath,
      putExtra,
    )
    if (result.resp.statusCode === 200) {
      consola.success(
        'Put object(%s) under the bucket(%s) successful!!',
        fileKey,
        config.bucket,
      )
    }
    else {
    //   consola.error('Status: %d', result.CommonMsg.Status)
    // consola.error('Code: %s', result.CommonMsg.Code)
    // consola.error('Message: %s', result.CommonMsg.Message)
    // consola.error('RequestId: %s', result.CommonMsg.RequestId)
    // throw new Error('上传失败')
    }
  }
  catch (e) {
    consola.error(`upload to qiniu failed, fileKey: ${fileKey}, filePath: ${filePath}`)
    consola.error(e)
    throw new Error('上传失败')
  }
}

export const qiniu = { checkConfig, createClient, upload }
