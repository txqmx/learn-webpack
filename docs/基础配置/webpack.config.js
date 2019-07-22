let path = require('path');
let HtmlWebpackPlugin = require('html-webpack-plugin'); // 生成index.html
let MiniCssExtractPlugin = require('mini-css-extract-plugin'); // 抽离css
let OptimizeCss = require('optimize-css-assets-webpack-plugin'); // 压缩css
let UglifyJsPlugin = require('uglifyjs-webpack-plugin'); // 压缩js

module.exports = {
    mode: 'development', // production development
    entry: './src/index.js', // 入口
    output: {
        filename: "bundle.[hash:8].js", // 打包后文件名
        path: path.resolve(__dirname, 'build'), // 打包路径，绝对路径
        // publicPath:'' // 静态资源目录，上传cdn时使用
    },
    optimization: { // 优化项
        minimizer: [
            new OptimizeCss(), // 压缩css
            new UglifyJsPlugin({
                cache: true,
                parallel: true, // 启用多进程并行
                sourceMap: true

            })
        ]
    },
    devServer: { // 开发服务器配置
        // host: 'localhost', // 本地启动地址
        port: 3000,
        progress: true, // 进度条
        open: true, // 自动打开
    },
    module: { // 模块
        rules: [
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader' // 自动加前缀
                ]
            },
            {
                test: /\.lcss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader', // 自动加前缀
                    'less-loader'
                ]
            },
            {
                test:/\.js$/,
                use:{
                    loader:'babel-loader',
                    options:{ // 用babel-loader 需要把es6-es5
                        presets:[
                            '@babel/preset-env'
                        ],
                        plugins:[
                            "@babel/plugin-transform-runtime"
                        ]
                    }
                },
                include:path.resolve(__dirname,'src'),
                exclude:/node_modules/
            },
            {
                test:/\.html$/,
                use:'html-withimg-loader'
            },
            {
                test:/\.(png|jpg|gif)$/,
                // 做一个限制 当我们的图片 小于多少k的时候 用base64 来转化
                // 否则用file-loader产生真实的图片
                use:{
                    loader: 'url-loader',
                    options:{
                        limit:1,
                        outputPath:'/img/',
                        // publicPath:'http://www.xxx.cn'
                    }
                }
            },
        ]
    },
    plugins: [ // 数组，放着所有webpack插件
        new HtmlWebpackPlugin({
            template: './src/index.html', // 入口模板
            filename: 'index.html',
            minify:{
                removeAttributeQuotes: true, // 删除属性双引号
                collapseWhitespace: true, // 折叠空行
            },
            hash: true // 哈希戳
        }),
        new MiniCssExtractPlugin({
            filename: 'css/main.css'
        })
    ]
}
