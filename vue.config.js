const webpack = require('webpack')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const productionGzipExtensions = ['js', 'css']
const Timestamp = new Date().getTime();
module.exports = {
  devServer: {
    disableHostCheck: true,
  },
  publicPath: "./",
  outputDir: process.env.VUE_APP_LOGO === 'false' ? 'dist-nologo' : 'dist',
  css: {
    loaderOptions: {
      sass: {
        additionalData: `@import "@/assets/styles/_variable.scss";`
      }
    }
  },
  configureWebpack: {
    output: { // 输出重构  打包编译后的 文件名称 //注：这里要放在js/下要不然nginx配置的问题会找不到相应的文件
      filename: `js/[name]${Timestamp}.js`,
      chunkFilename: `js/[name]${Timestamp}.js`
    },
    plugins: [
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),//该插件能够使得指定目录被忽略，从而使得打包变快，文件变小
      // 下面是下载的插件的配置
      new CompressionWebpackPlugin({
        algorithm: 'gzip',//压缩算法
        test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
        threshold: 10240,
        minRatio: 0.8
      }),
      new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 5, //空指打包的个数
        minChunkSize: 100
      }),
      new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery"
      })
    ]
  },
}