export interface ObsUploadConfig {
  obsUrl: string
  obsUserName: string
  obsAccessKeyId: string
  obsSecretAccessKey: string
  /**
   * { 本地要上传的文件路径 : obs 上的文件路径 }
   * { [sourcePath: string]: targetPath: string }
   */
  entry: Record<string, string>
}

export function defineConfig(options: ObsUploadConfig): ObsUploadConfig {
  return options
}
