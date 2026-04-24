import { resolve } from 'node:path'
import { defineConfig, normalizePath } from 'vite'

const root = normalizePath(resolve(__dirname))

export default defineConfig({
  root: 'site',
  base: '/',
  resolve: {
    alias: [
      { find: /^littlefoot\/(.+)$/, replacement: `${root}/$1` },
      { find: /^littlefoot$/, replacement: `${root}/dist/littlefoot.mjs` },
    ],
  },
  build: {
    outDir: '../docs',
    emptyOutDir: true,
  },
})
