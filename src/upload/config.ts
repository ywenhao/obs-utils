import { createConfigLoader } from 'unconfig'

export const configLoader = createConfigLoader({
  sources: [
    {
      files: 'obs-upload.config',
      extensions: ['ts', 'mts'],
    },
  ],
  merge: false,
})
