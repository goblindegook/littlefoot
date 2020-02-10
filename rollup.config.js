import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'
import { terser } from 'rollup-plugin-terser'
import { uglify } from 'rollup-plugin-uglify'
import pkg from './package.json'

const production = !process.env.ROLLUP_WATCH

export default [
  {
    input: 'src/index.ts',
    plugins: [
      resolve({ mainFields: ['main'] }),
      commonjs({
        namedExports: {
          tslib: ['__assign'],
          'delegated-events': ['off', 'on']
        }
      }),
      typescript(),
      production && uglify()
    ],
    context: 'window',
    output: {
      name: 'littlefoot',
      file: pkg.browser,
      format: 'umd',
      exports: 'named'
    }
  },
  {
    input: 'src/index.ts',
    external: Object.keys(pkg.dependencies),
    plugins: [typescript(), production && terser()],
    context: 'window',
    output: [
      {
        file: pkg.main,
        format: 'cjs',
        exports: 'named'
      },
      {
        file: pkg.module,
        format: 'es',
        exports: 'named'
      }
    ]
  }
]
