const guacClient = 'http://127.0.0.1:8080';

module.exports = {
    transpileDependencies: ['vuex-persist'],
    devServer: {
        proxy: {
          '/tunnel': {
            target: guacClient,
            changeOrigin: true,
            ws: false
          },
          '/websocket-tunnel': {
            target: guacClient,
            changeOrigin: true,
            ws: true
          },
          '/liderws': {
            target: guacClient,
            changeOrigin: true,
            ws: true
          }
        }
      }
}