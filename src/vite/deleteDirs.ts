import type { Plugin } from 'vite'
import { deleteDir } from './delete-utils'

interface DeleteDirsOption {
  /**
   * 是否启用
   * @default true
   */
  enabled?: boolean
  dirs: string[]
  exclude?: string[]
}

export function deleteDirs(option: DeleteDirsOption): any {
  const { dirs, exclude = [], enabled = true } = option
  return <Plugin>{
    name: 'delete-dirs',
    closeBundle() {
      if (!enabled)
        return

      setTimeout(() => {
        dirs.forEach(dir => deleteDir(dir, exclude))
      }, 2000)
    },
  }
}
