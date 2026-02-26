import fs from 'node:fs'
import path from 'node:path'
import c from 'ansis'
import { consola } from 'consola'
// eslint-disable-next-line ts/ban-ts-comment
// @ts-ignore
import fg from 'fast-glob'
import { obs } from './sdk/obs'
import { oss } from './sdk/oss'
import { qiniu } from './sdk/qiniu'
import { configLoader } from './utils/config'
import { promisePool } from './utils/promisePool'

const sdkMap = { obs, oss, qiniu }

let sdk: typeof obs | typeof oss | typeof qiniu

export async function createConfig() {
  const loader = await configLoader.load()
  const config = loader.config as any

  sdk = sdkMap[config.__type as keyof typeof sdkMap]
  sdk.checkConfig(config)

  const client = sdk.createClient(config)

  return { client, config }
}

function getPathsByArgv() {
  const argv = process.argv.slice(2)
  if (argv.length) {
    if (argv.length !== 2) {
      consola.error(new Error('命令参数不正确'))
      process.exit(1)
    }
    return { [argv[0]]: argv[1] }
  }
}

export async function main() {
  const { client, config } = await createConfig()
  const paths = getPathsByArgv()
  const entry = paths || config.entry

  for (const sourcePath in entry) {
    start(sourcePath, entry[sourcePath])
  }

  // 定义一个异步函数用于上传文件
  async function upload(filePath: string, sourcePath: string, targetPath: string) {
    // const filename = filePath.split('/').pop()
    const fileKey = `${targetPath}${filePath.split(sourcePath)[1]}`

    // 上传文件
    await sdk.upload({
      client,
      config,
      fileKey,
      filePath,
      sourcePath,
      targetPath,
    })
  }

  // 设置最大并发池大小
  const MAX_POOL_SIZE = 10

  async function start(sourcePath: string, targetPath: string) {
    // 使用fast-glob库获取指定路径下的文件列表
    consola.log(c.greenBright`开始上传 ${sourcePath} 到 ${targetPath}`)
    const glob = await fg(`${sourcePath}/**/*`, { absolute: true })

    // 过滤出文件列表，只保留存在的文件
    const list = glob.filter(v => fs.existsSync(v) && fs.statSync(v).isFile())

    sourcePath = path.resolve(sourcePath).replaceAll('\\', '/')

    try {
      await promisePool(list.map(item => () => upload(item, sourcePath, targetPath)), MAX_POOL_SIZE)
      consola.log(c.greenBright`${sourcePath} 到 ${targetPath} 上传完成`)
    }
    catch {
      process.exit(1)
    }
  }
}

// 开始执行文件上传
main()
