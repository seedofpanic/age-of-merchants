const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    entry: './src/app.js',
    output: {
        path: './public/js/',
        filename: 'app.bundle.js',
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
        new ExtractTextPlugin("./../css/styles.css")
    ]
}