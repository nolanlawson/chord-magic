import buble from 'rollup-plugin-buble'

export default {
  input: 'src/index.js',
  output: {
    name: 'chordMagic'
  },
  plugins: [
    buble()
  ]
}
