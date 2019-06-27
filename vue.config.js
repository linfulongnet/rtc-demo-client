module.exports = {
  configureWebpack: {
    output: {
      webassemblyModuleFilename: '[modulehash].wasm'
    },
    module: {
      rules: [
        {
          test: /\.wasm$/,
          type: 'webassembly/experimental'
        }
      ]
    },
  }
}
