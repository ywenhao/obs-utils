import type { UploadConfig } from '../types'
import { consola } from 'consola'
import { createConfigLoader } from 'unconfig'
import { obs } from '../sdk/obs'
import { oss } from '../sdk/oss'

export const configLoader = createConfigLoader({
  sources: [
    {
      files: 'upload.config',
      extensions: ['ts', 'mts'],
    },
  ],
  merge: false,
})

export function checkConfig(config: UploadConfig) {
  oss.checkConfig(config)
  obs.checkConfig(config)

  if (
    !config.entry
    || Object.keys(config.entry).length === 0
    || Object.values(config.entry).some(v => !v)
  ) {
    consola.error(new Error('upload.config.ts 没有正确配置'))
    process.exit(1)
  }
}
