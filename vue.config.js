const isDev = process.env.ENV === 'dev';
const publicPath = isDev ? '' : '/crypto-portfolio';

module.exports = {
  publicPath,
  outputDir: 'docs',
  productionSourceMap: false,
  devServer: {
    disableHostCheck: true,
  },
  configureWebpack: {
  },
  pwa: {
    workboxOptions: {
      skipWaiting: true,
    },
    manifestOptions: {
      name: 'Asset Allocation',
      short_name: 'Portfolio',
      start_url: `${publicPath}/index.html?source=pwa`,
      theme_color: '#ffffff',
      background_color: '#ffffff',
      display: 'standalone',
      icons: [
        {
          src: `${publicPath}/icons/android-chrome-192x192.png`,
          sizes: '192x192',
          type: 'image/png',
          purpose: 'any maskable',
        },
        {
          src: `${publicPath}/icons/android-chrome-512x512.png`,
          sizes: '512x512',
          type: 'image/png',
        },
      ],
    },
    iconPaths: {
      favicon32: `${publicPath}/icons/favicon-32x32.png`,
      favicon16: `${publicPath}/icons/favicon-16x16.png`,
      appleTouchIcon: `${publicPath}/icons/apple-touch-icon.png`,
    },
  },
};
