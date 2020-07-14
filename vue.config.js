module.exports = {
  lintOnSave: process.env.NODE_ENV !== 'production',
  devServer: {
    proxy: {
      '/system-admin': {
        target: 'http://192.168.0.235:9999',
        ws: false,
        changeOrigin: true
      }
    }
  }
}
