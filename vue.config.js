const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
    .BundleAnalyzerPlugin;
module.exports = {
    productionSourceMap: false,
    devServer: {
        disableHostCheck: true,
    },
    configureWebpack: {
    }
}