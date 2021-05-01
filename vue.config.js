const path = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
    .BundleAnalyzerPlugin;
module.exports = {
    outputDir: path.resolve(__dirname, "try"),
    productionSourceMap: false,
    devServer: {
        disableHostCheck: true,
    },
    configureWebpack: {
        // entry: './src/main.js',
        // plugins: [new BundleAnalyzerPlugin({
        //     analyzerHost: '0.0.0.0'
        // })]
    }
}