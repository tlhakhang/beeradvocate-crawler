var path = require('path');
var nodeExternals = require('webpack-node-externals');

module.exports = {
    entry: './src/crawler.js',
    target: 'node',
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'crawler.js'
    },
    module: {
        loaders: [{
            test: /\.js$/,
            include: path.join(__dirname, 'src'),
            loaders: ['babel']
        }]
    },
    externals: [nodeExternals()],
}
