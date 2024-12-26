import type { Plugin } from 'vite'
import { deleteDir } from './delete-utils'

interface DeleteDirsOption {
  dirs: string[]
  exclude?: string[]
}

export function deleteDirs(option: DeleteDirsOption): any {
  const { dirs, exclude = [] } = option
  return <Plugin>{
    name: 'delete-dirs',
    closeBundle() {
      setTimeout(() => {
        dirs.forEach(dir => deleteDir(dir, exclude))
      }, 2000)
    },
  }
}
