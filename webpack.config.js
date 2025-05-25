const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'index.js',
        clean: true,
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'style.css'
        })
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/preset-env',
                            ['@babel/preset-react', { runtime: 'automatic' }]
                        ],
                    },
                },
            },
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader',
                ],
            },
        ],
    },
    externals: {
        '@wordpress/blocks': 'wp.blocks',
        '@wordpress/block-editor': 'wp.blockEditor',
        '@wordpress/components': 'wp.components',
        '@wordpress/element': 'wp.element',
        '@wordpress/i18n': 'wp.i18n',
    },
    resolve: {
        extensions: ['.js', '.jsx'],
    },
    devtool: 'source-map',
    mode: 'development',
};