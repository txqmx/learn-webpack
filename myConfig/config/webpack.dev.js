const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
function resolve(dir){
    return path.join(__dirname, '..', dir)
}

module.exports = {
    context: path.resolve(__dirname, '..'), // 上下文，默认当前目录下
    mode: "development",
    devServer: {
        contentBase: resolve('dist'),
        hot: true,
        host: "localhost",
        port: 8080,
        proxy: {
            "/api": {
                target: "http://localhost:8080",
                pathRewrite: {
                    '^/api': '/static/mock'
                }
            }
        }
    },
    entry: resolve('src/main.js'),
    output: {
        filename: "js/[name].[hash:5].js",
        path: resolve('dist'),
        publicPath: "/"
    },
    resolve: {
        modules: ['node_modules'],
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
            '@': resolve('src'),
            'styles': resolve('src/assets/styles'),
            'common': resolve('src/common')
        },
        extensions: ['.js','.vue','.json'],
    },
    devtool: "cheap-module-eval-source-map",
    module: {
        rules: [
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                },
                exclude: /node_modules/
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test:/\.css$/,
                use:[
                    'vue-style-loader',
                    'css-loader',
                ]
            },
            {
                test:/\.styl(us)?/,
                use:[
                    'vue-style-loader',
                    'css-loader',
                    'stylus-loader', // 把stylus转变为css
                ]
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,       // 找到所有的图片
                use: {// 做一个限制，当我们的图片，小于多少k的时候，用base64来转化，否则用file-loader产生真实的图片
                    loader: 'url-loader',
                    options: {
                        limit: 10000,   // 小于10M，会转化成base64
                        name: 'img/[name].[hash:7].[ext]'
                    }
                }
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: 'media/[name].[hash:7].[ext]'
                }
            },
            // canvas 解析
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: 'fonts/[name].[hash:7].[ext]'
                }
            }
        ]
    },
    plugins: [
        new VueLoaderPlugin(),
        new HtmlWebpackPlugin({
            template: resolve('index.html'),
            filename: 'index.html',
            inject: 'body'
        }),
        new CopyWebpackPlugin([  // 不做处理，直接拷贝
            {
                from: path.resolve(__dirname, '../static'),
                to: 'static',
                ignore: ['.*']
            }
        ]),
        // new webpack.NamedModulesPlugin(),  // 打印更新的模块路径
        new webpack.HotModuleReplacementPlugin()   // 热更新插件
    ],
    watch: true,
    watchOptions: {
        ignored: /node_modules/,
        aggregateTimeout: 300,
        poll: 1000
    }
}
