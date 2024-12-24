import { type Plugin } from 'vite'

export type ReStaticToObsOption = {
  /**
   * 'development' | 'production'
   * @default 'development'
   */
  mode?: string
  obsUrl: string
}

/**
 * 重命名代码中的静态资源路径
 * @param option
 * @returns
 */
export function reStaticToObs(option?: ReStaticToObsOption): any {
  const { obsUrl } = option || {}
  return <Plugin>{
    name: 're-static-to-obs',
    transform(code) {
      code = code.replace(
        /import (.*) from ('|"){0,1}@{0,1}\/static\//g,
        ($0, $1, $2) => `const ${$1} = ${$2}${obsUrl}/static/`
      )

      code = code
        .replace(/src="@{0,1}\/static\//g, `src="${obsUrl}/static/`)
        .replace(/:src="(.*)'(@{0,1}\/static\/)/g, ($0, $1, $2) =>
          $0.replace(new RegExp($2, 'g'), `${obsUrl}/static/`)
        )

      code = code.replace(/url\(('|"){0,1}@{0,1}\/static\//g, `url($1${obsUrl}/static/`)

      code = code.replace(/('|")\/static\//g, `$1${obsUrl}/static/`)
      code = code.replace(/('|")(\.\.\/){1,}static\//g, `$1${obsUrl}/static/`)

      return code
    },
  }
}
