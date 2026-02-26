import { createConfigLoader } from 'unconfig'

export const configLoader = createConfigLoader({
  sources: [
    {
      files: 'upload.config',
      extensions: ['ts', 'mts'],
    },
  ],
  merge: false,
})
