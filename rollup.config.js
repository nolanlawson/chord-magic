import buble from 'rollup-plugin-buble'

export default {
  entry: 'src/index.js',
  moduleName: 'chordMagic',
  plugins: [
    buble()
  ]
}
