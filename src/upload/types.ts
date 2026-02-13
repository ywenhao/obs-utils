interface EntryConfig {
  /**
   * { 本地要上传的文件路径 : obs 上的文件路径 }
   * { [sourcePath: string]: targetPath: string }
   */
  entry: Record<string, string>
}

/**
 * 阿里云oss
 */
export interface OssUploadConfig extends EntryConfig {
  region: string
  bucket: string
  accessKeyId: string
  accessKeySecret: string
}

/**
 * 华为obs
 */
export interface ObsUploadConfig extends EntryConfig {
  url: string
  userName: string
  accessKeyId: string
  secretAccessKey: string
}

/**
 * 七牛云
 */
export interface QiniuUploadConfig extends EntryConfig {
  accessKeyId: string
  accessKeySecret: string
  bucket: string
}
