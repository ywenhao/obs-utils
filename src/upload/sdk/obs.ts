import type { UploadConfig } from '../types'
import { consola } from 'consola'
// eslint-disable-next-line ts/ban-ts-comment
// @ts-ignore
import ObsClient from 'esdk-obs-nodejs'

function checkConfig(config: UploadConfig) {
  if (config.obs) {
    if (
      !config.obs.url
      || !config.obs.userName
      || !config.obs.accessKeyId
      || !config.obs.secretAccessKey
    ) {
      consola.error(new Error('upload.config.ts 没有正确配置'))
      process.exit(1)
    }
  }
}

function createClient(config: NonNullable<UploadConfig['obs']>) {
  return new ObsClient({
    access_key_id: config.accessKeyId,
    secret_access_key: config.secretAccessKey,
    server: config.url,
  })
}

export const obs = { checkConfig, createClient }
