const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const OptimizeCss = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const Happypack = require('happypack');
const webpack = require('webpack')
function resolve(dir){
    return path.join(__dirname, '..', dir)
}

module.exports = {
    context: path.resolve(__dirname, '..'), // 上下文，默认当前目录下
    mode: "production",
    entry:{
        app:resolve('src/main.js')
    },
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
    devtool: "cheap-module-source-map",
    optimization: {
        minimizer: [
            new OptimizeCss(),
            new UglifyJsPlugin({
                cache:true,
                parallel: true,
                // sourceMap: true
            })
        ],
        splitChunks: {
            chunks: "all",
            minChunks: 1,
            cacheGroups: {
                common:{ // 公共的模块
                    chunks: 'initial',
                    minChunks: 2, // 引用次数
                    reuseExistingChunk: true // 这个配置允许我们使用已经存在的代码块
                },
                vendor:{ // 第三方模块
                    name: 'vendors',
                    priority: 1,  // 权重，先抽离第三方模块
                    test: /node_module/,
                    chunks: 'initial',
                    minChunks: 2 // 引用次数
                },

            }
        }
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: 'Happypack/loader?id=js',
                // use: {
                //     loader: 'babel-loader',
                //     options: {
                //         presets: ['@babel/preset-env']
                //     }
                // },
                exclude: /node_modules/
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test:/\.css$/,
                use:[
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                ]
            },
            {
                test:/\.styl(us)?/,
                use:[
                    MiniCssExtractPlugin.loader,
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
        new Happypack({
            id: 'js',
            use: [{
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env']
                }
            }]
        }),
        new VueLoaderPlugin(),
        new HtmlWebpackPlugin({
            template: resolve('index.html'),
            filename: 'index.html',
            inject: 'body',
            minify: {
                removeComments: true,//移除注释
                collapseWhitespace: true,//移除空白字符串
                removeAttributeQuotes: true //移除双引号
            }
        }),
        new webpack.HashedModuleIdsPlugin(),
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: 'css/[name]_[hash:5].css',
            // chunkFilename: "css/[id].css"
        }),
        new CopyWebpackPlugin([  // 不做处理，直接拷贝
            {
                from: path.resolve(__dirname, '../static'),
                to: 'static',
                ignore: ['.*']
            }
        ])
    ]
}

