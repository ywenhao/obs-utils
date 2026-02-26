import type { OssUploadConfig } from '../types'
import path from 'node:path'
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

async function upload({
  client,
  config,
  fileKey,
  filePath,
  // sourcePath,
  // targetPath,
}: {
  client: OSS
  config: OssUploadConfig
  fileKey: string
  filePath: string
  sourcePath: string
  targetPath: string
}) {
  // const filename = filePath.split('/').pop()
  // 自定义请求头
  const headers = {
  // 指定Object的存储类型。
    // 'x-oss-storage-class': 'Standard',
    // 指定Object的访问权限。
    // 'x-oss-object-acl': 'private',
    // // 通过文件URL访问文件时，指定以附件形式下载文件，下载后的文件名称定义为example.txt。
    // 'Content-Disposition': `attachment; filename="${filename}"`,
    // // 指定PutObject操作时是否覆盖同名目标Object。此处设置为true，表示禁止覆盖同名Object。
    // 'x-oss-forbid-overwrite': 'false',
  }

  try {
    await client.put(fileKey, path.normalize(filePath), {
      headers,
    })

    consola.success(
      'Put object(%s) under the bucket(%s) successful!!',
      fileKey,
      config.bucket,
    )
  }
  catch (error: any) {
    consola.error(`upload to oss failed, fileKey: ${fileKey}, filePath: ${filePath}`)
    consola.error(error)
    throw new Error('上传失败')
  }
}

export const oss = { checkConfig, createClient, upload }
