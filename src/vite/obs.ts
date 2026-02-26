import type { ObsUploadConfig } from '../upload/types'

export function defineConfig(options: ObsUploadConfig): ObsUploadConfig {
  return { ...options, __type: 'obs' } as ObsUploadConfig
}
