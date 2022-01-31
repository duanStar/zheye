module.exports = {
  publicPath: '.',
  devServer: {
    proxy: {
      '/api': {
        target: 'http://api.vikingship.xyz/',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/api'
        }
      }
    }
  }
}
