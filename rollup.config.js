import { nodeResolve } from '@rollup/plugin-node-resolve'

const onwarn = warning => {
  // Silence circular dependency warning for moment package
  if (
    warning.code === 'CIRCULAR_DEPENDENCY'
  ) {
    return
  }

  console.warn(`(!) ${warning.message}`)
}

export default {
  input: 'src/index.js',
  output: [
    {
      file: 'dist/index.esm.js',
      format: 'module',
      sourcemap: true
    },
    {
      file: 'dist/index.cjs.js',
      format: 'cjs',
      sourcemap: true
    }
  ],
  plugins: [
    nodeResolve()
  ],
  onwarn
}
