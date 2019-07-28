const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const isProd = process.env.NODE_ENV === 'production'


function resolve(dir){
    return path.join(__dirname, '..', dir)
}

module.exports = {
    context: path.resolve(__dirname, '..'), // 上下文，默认当前目录下
    entry: {
        app: './src/main.js'
    },
    output: {
        filename: 'js/[name].[hash:5].js',
        path: path.resolve(__dirname, '..','dist'),
        publicPath: './'
    },
    resolve: {
        extensions: ['.js','.vue','.json'],
        alias:{
            'vue$': 'vue/dist/vue.esm.js',
            '@': resolve('src'),
            'styles': resolve('src/assets/styles'),
            'common': resolve('src/common')
        },
        modules: [resolve('node_modeules')]
    },
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
                    isProd ? MiniCssExtractPlugin.loader:'vue-style-loader',
                    'css-loader',
                    //'postcss-loader'
                ]
            },
            {
                test:/\.styl(us)?/,
                use:[
                    isProd ? MiniCssExtractPlugin.loader:'vue-style-loader',
                    'css-loader',
                    // 'postcss-loader',
                    'stylus-loader' // 把stylus转变为css
                ]
            },
            {
                test: /\.html$/,    // 找到html文件
                use: 'html-withimg-loader'//解决html引入图片打包的问题
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
            filename: 'index.html'
        }),

        new MiniCssExtractPlugin({
            filename: 'main.css'
        })
    ]
}
