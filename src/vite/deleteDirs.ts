import type { Plugin } from 'vite'
import { deleteDir } from './delete-utils'

interface DeleteDirsOption {
  /**
   * 是否启用
   * @default true
   */
  enable?: boolean
  dirs: string[]
  exclude?: string[]
}

export function deleteDirs(option: DeleteDirsOption): any {
  const { dirs, exclude = [], enable = true } = option
  return <Plugin>{
    name: 'delete-dirs',
    closeBundle() {
      if (!enable)
        return

      setTimeout(() => {
        dirs.forEach(dir => deleteDir(dir, exclude))
      }, 2000)
    },
  }
}
