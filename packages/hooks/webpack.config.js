const { merge } = require('webpack-merge');
const path = require('path');
const baseConfig = require('../../webpack.base.config');

module.exports = merge(baseConfig, {
    entry: './es/index.js',
    output: {
        filename: 'xi-hooks.js',
        library: 'xi-hooks',
        path: path.resolve(__dirname, './dist'),
    },
})