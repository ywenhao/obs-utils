import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: [
    'src/upload/cli.ts',
    'src/vite/*.ts',
  ],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
})
