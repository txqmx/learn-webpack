const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin');//VueLoaderPlugin,注意路径一定是('vue-loader/lib/plugin')，而不是('vue-loader')，不然会报错


function resolve(dir){
    return path.join(__dirname, dir)
}

module.exports = {
    devServer: {
        port: 3000,
        progress: true,  // 编译的进度条
        compress: true, // 自动压缩
        open: true, // 自动打开浏览器
    },
    entry:{
        app: './src/main.js'
    },
    output: {
        filename: '[name].[hash:8].js',
        path: path.resolve(__dirname, 'dist')
    },
    resolve: {
        extensions: ['.js','.vue','.json'],
        alias:{
            'vue$': 'vue/dist/vue.esm.js',
            '@': resolve('src'),
            'styles': resolve('src/assets/styles'),
            'common': resolve('src/common')
        }
    },
    module: { // 模块loader 默认是从右到左，从下到上执行,多个loader需要一个数组，loader是有顺序的，默认是从右向左执行，loader还可以写成 对象方式
        rules: [
            {
                test: /\.css$/,
                use:[
                    'style-loader', // 把样式都抽离成一个单独的css文件
                    'css-loader',
                    //给CSS3语法，比如transfrom加上前缀， 需要新建 postcss.config.js 配置文件，需要引用 autoprefixer 这个插件
                ]
            },
            {
                test: /\.styl(us)?/,
                use: [
                    'style-loader',
                    // 'vue-style-loader',
                    'css-loader', // 解析 @import这种语法的
                    'stylus-loader' // 把stylus转变为css
                ]
            },
            // {
            //     test: /\.html$/,    // 找到html文件
            //     use: 'html-withimg-loader'//解决html引入图片打包的问题
            // },
            {
                test: /\.(png|jpg|gif)$/,       // 找到所有的图片
                use: {// 做一个限制，当我们的图片，小于多少k的时候，用base64来转化，否则用file-loader产生真实的图片
                    loader: 'url-loader',
                    options: {
                        limit: 200 * 1024   // 小于200k，会转化成base64
                    }
                }
            },
            {
                test: /\.js$/,  // 找到所有的js文件
                use: {
                    loader: 'babel-loader', // 用babel-loader，需要把ES6转换成ES5语法
                    options: {
                        presets: [ // babel的集合
                            '@babel/preset-env'    // @babel/preset-env 就是用来将ES6转化成ES5语法的
                        ]
                    }
                },
                include: path.resolve(__dirname, 'src'),// 只查找src目录下的js，不找node_modules里面的js
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {

                }
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: 'img/[name].[ext]'
                }
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: 'media/[name].[ext]'
                }
            },
            // canvas 解析
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: 'fonts/[name].[ext]'
                }
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'index.html',
            filename: 'index.html',
            minify: {  // 压缩这个html文件(主要是对HTML文件进行压缩)
                removeAttributeQuotes: true,        // 删除这个html文件的双引号
                collapseWhitespace: true      // 变成一行
            },
            hash: true
        }),
        new VueLoaderPlugin()
    ]

}
