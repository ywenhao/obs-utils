import type { QiNiuUploadConfig } from '../upload/types'

export function defineConfig(options: QiNiuUploadConfig): QiNiuUploadConfig {
  return { ...options, __type: 'qiniu' } as QiNiuUploadConfig
}
