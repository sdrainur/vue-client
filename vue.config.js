const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  // configureWebpack: {
  //   module: {
  //     rules: [
  //       {
  //         test: /\.scss$/,
  //         use: [
  //           'vue-style-loader',
  //           'css-loader',
  //           'sass-loader'
  //         ]
  //       }
  //     ]
  //   }
  // }
})
