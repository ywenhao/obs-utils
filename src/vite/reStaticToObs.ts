import type { Plugin } from 'vite'

export interface ReStaticToObsOption {
  /**
   * 是否启用
   * @default true
   */
  enable?: boolean
  obsUrl: string
}

/**
 * 重命名代码中的静态资源路径
 * @param option
 */
export function reStaticToObs(option?: ReStaticToObsOption): any {
  const { obsUrl, enable = true } = option || {}
  return <Plugin>{
    name: 're-static-to-obs',
    transform(code) {
      if (!enable)
        return code

      code = code.replace(
        /import (.*) from ('|")?@?\/static\//g,
        ($0, $1, $2) => `const ${$1} = ${$2}${obsUrl}/static/`,
      )

      code = code
        .replace(/src="@?\/static\//g, `src="${obsUrl}/static/`)
        .replace(/:src="(.*)'(@?\/static\/)/g, ($0, $1, $2) =>
          $0.replace(new RegExp($2, 'g'), `${obsUrl}/static/`))

      code = code.replace(/url\(('|")?@?\/static\//g, `url($1${obsUrl}/static/`)

      code = code.replace(/('|")\/static\//g, `$1${obsUrl}/static/`)
      code = code.replace(/('|")(\.\.\/)+static\//g, `$1${obsUrl}/static/`)

      return code
    },
  }
}
