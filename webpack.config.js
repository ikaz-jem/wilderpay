module.exports = {
  // other config...
  experiments: {
    asyncWebAssembly: true, // <-- enables async WASM loading
  },
  module: {
    rules: [
      {
        test: /\.wasm$/,
        type: 'webassembly/async'
      }
    ]
  }
};
