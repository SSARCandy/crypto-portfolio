// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
//     .BundleAnalyzerPlugin;
module.exports = {
  outputDir: 'docs',
  publicPath: '/crypto-portfolio',
  productionSourceMap: false,
  devServer: {
    disableHostCheck: true,
  },
  configureWebpack: {
    // entry: './src/main.js',
    // plugins: [new BundleAnalyzerPlugin({
    //     analyzerHost: '0.0.0.0'
    // })]
  },
  pwa: {
    workboxOptions: {
      skipWaiting: true,
    },
    manifestOptions: {
      name: 'Asset Allocation',
      short_name: 'Portfolio',
      start_url: '/crypto-portfolio/index.html?source=pwa',
      theme_color: '#ffffff',
      background_color: '#ffffff',
      display: 'standalone',
      icons: [
        {
          src: '/crypto-portfolio/icons/android-chrome-192x192.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'any maskable',
        },
        {
          src: '/crypto-portfolio/icons/android-chrome-512x512.png',
          sizes: '512x512',
          type: 'image/png',
        },
      ],
    },
    iconPaths: {
      favicon32: '/icons/favicon-32x32.png',
      favicon16: '/icons/favicon-16x16.png',
      appleTouchIcon: '/icons/apple-touch-icon.png',
    },
  },
};
