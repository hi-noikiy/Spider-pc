const CompressionWebpackPlugin = require('compression-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const path = require('path')
function resolve(dir) {
  return path.join(__dirname, dir)
}

const compress = new CompressionWebpackPlugin({
  filename: info => {
    return `${info.path}.gz${info.query}`
  },
  algorithm: 'gzip',
  threshold: 10240,
  test: new RegExp('\\.(' + ['js'].join('|') + ')$'),
  minRatio: 0.8,
  deleteOriginalAssets: false
})

module.exports = {
  publicPath: './',
  productionSourceMap: false,

  devServer: {
    host: '0.0.0.0',
    port: 8082,
    proxy: {
      '/athena': {
        target: 'http://x.wego168.com/',
        changeOrigin: true,
        pathRewrite: {
          '/athena': 'athena'
        }
      },
      '/hyzs': {
        target: 'http://x.wego168.com/',
        // target: 'http://192.168.1.16:8080/',
        changeOrigin: true,
        pathRewrite: {
          '/hyzs': 'hyzs'
        }
      },
      '/wghjy': {
        target: 'http://x.wego168.com/',
        // target: 'http://192.168.1.16:8080/',
        changeOrigin: true,
        pathRewrite: {
          '/wghjy': 'wghjy'
        }
      },
      '/lbxyh': {
        target: 'http://x.wego168.com/',
        changeOrigin: true,
        pathRewrite: {
          '/lbxyh': 'lbxyh'
        }
      },
      '/accelerator_test': {
        target: 'http://abs.wego168.com/',
        pathRewrite: {
          '/accelerator_test': 'accelerator_test'
        }
      }
    }
  },

  // configureWebpack: {
  //   plugins: [compress]
  // },

  css: {
    extract: process.env.NODE_ENV === 'production' ? true : false,
    loaderOptions: {
      sass: {
        data: `@import "@/theme/element.scss";`
      }
    }
  },
  // configureWebpack: config => {
  //   if (process.env.NODE_ENV === 'production') {
  //     config.plugins.push(
  //       new TerserPlugin({
  //         terserOptions: {
  //           compress: {
  //             drop_console: true
  //           }
  //         }
  //       })
  //     )
  //   }
  // },
  lintOnSave: false, // 关掉eslint校验
  chainWebpack: config => {
    config.entry('index').add('babel-polyfill')
    config.externals({
      UE: 'UE'
    })
    // config.optimization.minimize(true);
    // config.optimization.splitChunks({
    //   chunks: 'all'
    // });
    // 启用时，符号链接(symlink)的资源，将解析为其 真实 路径，而不是其符号链接(symlink)的位置
    config.resolve.symlinks(true)
    // 配置别名
    config.resolve.alias
      .set('@', resolve('src'))
      .set('apiSchool', resolve('src/modules/school/api')) //社群2.0后要删除
      .set('jsSchool', resolve('src/modules/school/js'))
      .set('commonSchool', resolve('src/modules/school/components/common'))
  }
}
