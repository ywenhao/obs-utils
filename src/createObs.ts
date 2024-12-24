import fg from 'fast-glob'
import fs from 'node:fs'
import { loadEnv } from 'vite'

const ObsClient = require('esdk-obs-nodejs')

const env = loadEnv('', process.cwd())

export const obsClient = new ObsClient({
  access_key_id: env.VITE_OBS_ACCESS_KEY_ID,
  secret_access_key: env.VITE_OBS_SECRET_ACCESS_KEY,
  server: env.VITE_OBS_URL
})

export const uploadObs = async (key?: string) => {
  async function upload(filePath: string) {
    const fileKey = `h5/` + `${key}/` + filePath.split(`/${key}/`)[1]
    try {
      const params = {
        Bucket: env.VITE_OBS_USER_NAME,
        Key: fileKey,
        SourceFile: filePath,
        ACL: obsClient.enums.AclPublicRead
      }

      // 文本上传对象
      const result = await obsClient.putObject(params)
      if (result.CommonMsg.Status <= 300) {
        console.info('Put object(%s) under the bucket(%s) successful!!', params.Key, params.Bucket)
        // console.info('RequestId: %s', result.CommonMsg.RequestId)
        // console.info(
        //   'StorageClass:%s, ETag:%s',
        //   result.InterfaceResult.StorageClass,
        //   result.InterfaceResult.ETag
        // )
        return
      }
      console.info(
        'An ObsError was found, which means your request sent to OBS was rejected with an error response.'
      )
      console.info('Status: %d', result.CommonMsg.Status)
      console.info('Code: %s', result.CommonMsg.Code)
      console.info('Message: %s', result.CommonMsg.Message)
      console.info('RequestId: %s', result.CommonMsg.RequestId)
    } catch (error) {
      console.info(
        'An Exception was found, which means the client encountered an internal problem when attempting to communicate with OBS, for example, the client was unable to access the network.'
      )
      console.info(error)
    }
  }

  const glob = await fg(`dist/*/*/${key}/**/*`, { absolute: true })
  const list = glob.filter((v) => fs.existsSync(v) && fs.statSync(v).isFile())

  // 并发
  const MAX_POOL_SIZE = 5
  for (let i = 0; i < list.length; i += MAX_POOL_SIZE) {
    await Promise.all(list.slice(i, i + MAX_POOL_SIZE).map((item) => upload(item)))
  }
}
