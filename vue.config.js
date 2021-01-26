/**  
 * 待优化的部分，开启Gzip压缩，开启CDN加速(需注释代码引用)，启用路由懒加载
 */
const isProd = process.env.NODE_ENV === 'production' // 是否生产环境


const CompressionWebpackPlugin = require('compression-webpack-plugin')
const productionGzipExtensions = /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i

let externals = {
  'vue': 'Vue',
  'vue-router': 'VueRouter',
  'vuex': 'Vuex',
  'axios': 'axios',
  'element-ui': 'ELEMENT',
}

let cdn = {
  css: [
    //normalize css
    'https://cdn.bootcdn.net/ajax/libs/normalize/8.0.1/normalize.min.css',
    // element-ui css
    'https://cdn.bootcdn.net/ajax/libs/element-ui/2.4.5/theme-chalk/index.css'

  ],
  js: [
    //axios
    'https://cdn.bootcdn.net/ajax/libs/axios/0.21.0/axios.min.js',
    // vue must at first!
    'https://cdn.bootcdn.net/ajax/libs/vue/2.6.11/vue.min.js',
    //vue-router
    'https://cdn.bootcdn.net/ajax/libs/vue-router/3.2.0/vue-router.min.js',
    //vuex
    'https://cdn.bootcdn.net/ajax/libs/vuex/3.5.1/vuex.min.js',
    // element-ui js
    'https://cdn.bootcdn.net/ajax/libs/element-ui/2.4.5/index.js'

  ]
}

cdn = isProd ? cdn : { css: [], js: [] }
externals = isProd ? externals : {}



module.exports = {
  // 部署生产环境和开发环境下的URL。
  // 默认情况下，Vue CLI 会假设你的应用是被部署在一个域名的根路径上
  // 例如 https://www.ln.vip/。如果应用被部署在一个子路径上，你就需要用这个选项指定这个子路径。例如，如果你的应用被部署在 https://www.ln.vip/admin/，则设置 baseUrl 为 /admin/。
  publicPath: process.env.NODE_ENV === "production" ? "./" : "/",
  /* 输出文件目录：在npm run build时，生成文件的目录名称 */
  outputDir: 'dist',
  /* 放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录 */
  assetsDir: "assets",
  /*指定生成的 index.html 的输出路径(相对于 outputDir)也可以是一个绝对路径。*/
  indexPath: 'index.html',
  /* 是否在构建生产包时生成 sourceMap 文件，false将提高构建速度 */
  productionSourceMap: false,
  /* webpack-dev-server 相关配置 */
  devServer: {
    /* 自动打开浏览器 */
    open: true,
    /* 设置为0.0.0.0则所有的地址均能访问 */
    host: '0.0.0.0',
    port: 8080,
    https: false,
    hotOnly: true,
    overlay:{
      warnings:false,
      errors:true
    },
    /* 使用代理 */
    // proxy: {
      // '/api': {
        /* 目标代理服务器地址 */
        // target: 'http://localhost:8080',
        /* 允许跨域 */
        // changeOrigin: true,
    //   },
    // },
  },
  configureWebpack: {
    externals,  //启用cdn加速,添加打包排除，说明以下配置中的包将来不会打包到项目中
    plugins: [
      new CompressionWebpackPlugin({
        filename: '[path][base].gz',   // 目标资源名称
        algorithm: 'gzip',
        test: productionGzipExtensions,  //处理所有匹配此 {RegExp} 的资源
        threshold: 10240,  //只处理比这个值大的资源。按字节计算(此值设置10K以上进行压缩)
        minRatio: 0.8   ////只有压缩率比这个值小的资源才会被处理,
      }),
    ],

    resolve: {
      alias: {
        'api': '@/api',
        'assets': '@/assets',
        'components': '@/components',
        'plugins': '@/plugins',
        'router': '@/router',
        'store': '@/store',
        'utils': '@/utils',
        'views': '@/views',
      }
    }
  },
  chainWebpack(config) {
    config.plugin('html').tap(args => {
      args[0].cdn = cdn
      return args
    })
  }
}