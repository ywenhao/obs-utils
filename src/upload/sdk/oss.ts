import type { OssUploadConfig } from '../types'
import OSS from 'ali-oss'
import { consola } from 'consola'

function checkConfig(config: OssUploadConfig) {
  if (
    !config.region
    || !config.bucket
    || !config.accessKeyId
    || !config.accessKeySecret
  ) {
    consola.error(new Error('upload.config.ts 没有正确配置'))
    process.exit(1)
  }
}

function createClient(config: OssUploadConfig) {
  return new OSS({
    region: config.region,
    bucket: config.bucket,
    accessKeyId: config.accessKeyId,
    accessKeySecret: config.accessKeySecret,
    authorizationV4: true,
  })
}

export const oss = { checkConfig, createClient }
