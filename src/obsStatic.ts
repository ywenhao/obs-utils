import { type Plugin } from 'vite'

export type ObsStaticOption = {
  /**
   * 'development' | 'production'
   * @default 'development'
   */
  mode?: string
  obsUrl: string
}

export function obsStatic(option?: ObsStaticOption): Plugin {
  const { obsUrl } = option || {}
  return {
    name: 'obs-static',
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
    }
  }
}
