const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackShellPlugin = require('webpack-shell-plugin');

module.exports = {
    entry: './src/app.js',
    output: {
        path: './public/js/',
        filename: 'app.bundle.js',
    },
    devServer: {
        inline: true,
        proxy: {
            '/api': {
                target: 'http://localhost:3001'
            },
            '/locales': {
                target: 'http://localhost:3001'
            }
        }
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'strict!awesome-typescript-loader'
            }, {
                test: /\.jade$/,
                loader: 'jade-loader?name=./../partials'
            },
            {
                test: /\.less$/,
                loader: "style!css!less"
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
            },
            {
                test: /\.(png|svg|ttf|woff|woff2|eot)$/,
                loader: 'file-loader?name=./../assets/[hash].[ext]'
            },
            {
                test: /\.tsx?$/,
                loader: 'awesome-typescript-loader'
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin("./../css/styles.css"),
        new HtmlWebpackPlugin({
            template: './views/index.jade'
        }),
        new WebpackShellPlugin({
            onBuildStart: ['node server']
        })
    ]
}