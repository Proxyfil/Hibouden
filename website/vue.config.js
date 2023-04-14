const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: process.env.NODE_ENV === 'production'
  ? '/' : '/Projets 2022/InGDoc/Hibouden/website/dist/'
})
