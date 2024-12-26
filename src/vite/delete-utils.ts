import fs from 'node:fs'
import fsP from 'node:fs/promises'
import fg from 'fast-glob'

export async function deleteEmptyDir(dir: string) {
  let glob = await fg(`${dir}/**/*`, { onlyDirectories: true })
  glob = glob.reverse()

  const dirs = glob.filter(d => fs.existsSync(d) && fs.statSync(d).isDirectory())
  const files = glob.filter(d => !dirs.includes(d) && fs.existsSync(d) && fs.statSync(d).isFile())

  files.forEach(f => fsP.rm(f))
  dirs.forEach((d) => {
    fs.readdirSync(d).length ? deleteEmptyDir(d) : fsP.rmdir(d)
  })
}

export async function deleteDir(mainDir: string, exclude: string[] = []) {
  const ignore = exclude.map(e => `${mainDir}/${e}`)

  let glob = await fg(`dist/*/*/${mainDir}/**/*`)
  glob = glob.filter(g => !ignore.some(i => g.includes(i)))

  glob.forEach(g => fsP.rm(g))

  deleteEmptyDir(`dist/*/*/${mainDir}`)
}
