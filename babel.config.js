// 1、这是项目发布阶段需要用到的 babel 插件
const prodPlugins = []
if (process.env.NODE_ENV === 'production') {
  prodPlugins.push('transform-remove-console')
}

module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: [
    [
      'component',
      {
        libraryName: 'element-ui',
        styleLibraryName: 'theme-chalk'
      }
    ],
    // 2、发布产品时候的插件数组
    ...prodPlugins,
    // 'transform-remove-console' // 这样配置不管是开发还是测试生产环境都会去掉console
    // 因此 要配置只有生产环境才去掉 console
    '@babel/plugin-syntax-dynamic-import'
  ]
}
