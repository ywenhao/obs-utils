import type { OssUploadConfig } from '../upload/types'

export function defineConfig(options: OssUploadConfig): OssUploadConfig {
  return { ...options, __type: 'oss' } as OssUploadConfig
}
