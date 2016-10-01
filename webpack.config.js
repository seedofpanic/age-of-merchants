const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackShellPlugin = require('webpack-shell-plugin');

module.exports = {
    entry: './src/app.ts',
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
            },
            '/login': {
                target: 'http://localhost:3001'
            },
            '/logout': {
                target: 'http://localhost:3001'
            },
            '/registration': {
                target: 'http://localhost:3001'
            },
        }
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
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
                exclude: /node_modules/,
                loader: 'awesome-typescript-loader?tsconfig=tsconfig-f.json'
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin("./../css/styles.css"),
        new HtmlWebpackPlugin({
            template: './views/index.jade'
        }),
        new WebpackShellPlugin({
            //onBuildStart: ['ts-node server']
        })
    ]
}