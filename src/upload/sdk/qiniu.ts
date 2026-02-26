import type { QiNiuUploadConfig } from '../types'
import OSS from 'ali-oss'
import { consola } from 'consola'

function checkConfig(config: QiNiuUploadConfig) {
  if (
    !config.bucket
    || !config.accessKeyId
    || !config.accessKeySecret
  ) {
    consola.error(new Error('upload.config.ts 没有正确配置'))
    process.exit(1)
  }
}

function createClient(config: QiNiuUploadConfig) {
  return new OSS({
    bucket: config.bucket,
    accessKeyId: config.accessKeyId,
    accessKeySecret: config.accessKeySecret,
    authorizationV4: true,
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
  client: OSS
  config: QiNiuUploadConfig
  fileKey: string
  filePath: string
  sourcePath: string
  targetPath: string
}) {
  console.log(`output->`, {
    client,
    config,
    fileKey,
    filePath,
  })
}

export const qiniu = { checkConfig, createClient, upload }
