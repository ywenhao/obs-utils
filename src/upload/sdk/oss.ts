import type { UploadConfig } from '../types'
import OSS from 'ali-oss'
import { consola } from 'consola'

function checkConfig(config: UploadConfig) {
  if (config.oss) {
    if (
      !config.oss.region
      || !config.oss.bucket
      || !config.oss.accessKeyId
      || !config.oss.accessKeySecret
    ) {
      consola.error(new Error('upload.config.ts 没有正确配置'))
      process.exit(1)
    }
  }
}

function createClient(config: NonNullable<UploadConfig['oss']>) {
  return new OSS({
    region: config.region,
    bucket: config.bucket,
    accessKeyId: config.accessKeyId,
    accessKeySecret: config.accessKeySecret,
    authorizationV4: true,
  })
}

export const oss = { checkConfig, createClient }
