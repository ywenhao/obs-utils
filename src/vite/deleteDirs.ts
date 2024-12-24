import { deleteDir } from './delete-utils'
import { Plugin } from 'vite'

type DeleteDirsOption = {
  dirs: string[]
  exclude?: string[]
}

export function deleteDirs(option: DeleteDirsOption): any {
  const { dirs, exclude = [] } = option
  return <Plugin>{
    name: 'delete-dirs',
    closeBundle() {
      setTimeout(() => {
        dirs.forEach((dir) => deleteDir(dir, exclude))
      }, 2000)
    },
  }
}
