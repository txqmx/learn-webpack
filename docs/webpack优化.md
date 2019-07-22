[toc]

# 优化配置
## 配置基本环境
`npm install webpack webpack-cli html-webpack-plugin @babel/core babel-loader @babel/preset-env -D`


```
let path = require('path')
let HtmlWebpackPlugin = require('html-webpack-plugin')
module.export = {
    mode: 'development',
    entry: './sec/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {test: /\.js$/, use: {
                loader: 'babel-loader',
                options:{
                    presets:[
                        '@babel/preset-env'
                    ]
                }
            }}
        ]
    },
    plugins:[
        new HtmlWebpackPlugin({
            template: './src/index.html'
        })
    ]
}
```


## noParse
如果第三方包没有其他依赖，可以不用去解析

```
module: {
    noParse: /jquery/, // 不去解析jquery中的依赖库
}
```

## lgnorePlugin

```js
rules: [
    {
        exclude: /node_modules/,
        include: path.resolve('src'),
    }
]
```

某些第三方包设置语言会引入全部的语言包，使用lgnorePlugin忽略语言包，手动引入中文包

```js
new webpack.IgnorePlugin(/\.\/locale/,/moment/)
```

## dllPlugin

动态链接库，提前把一些体积大的库打包，生成一个`manifest.json`文件，在文件打包时会先去文件中查找，如果没有在进行打包

**webpack.config.react.js**

```js
let path = require('path')
let webpack = require('webpack')

module.exports = {
    entry:{
        react: ['react']
    },
    output: {
        filename: "_dll_[name].js", // 产生的文件名
        path: path.resolve(__dirname, 'dist'),
        library:'_dll_[name]',  // 导出的变量 _dll_react
        // libraryTarget: "var" // commonjs var this
    },
    plugins: [
        new webpack.DllPlugin({  // 产生文件清单 name == library
            name: '_dll_[name]',
            path: path.resolve(__dirname,'dist', 'manifest.json')
        })
    ]
}
```
**webpack.config.js**

```js
let path = require('path')
let webpack = require('webpack')

module.exports = {
    plugins: [
       new webpack.DllReferencePlugin({ // 先去清单中查找，找不到再打包
            manifest: path.resolve(__dirname, 'dist', 'manifest.json')
        })
    ]
}
```

## happypack

可以实现多线程打包

```js
let Happypack = require('happypack')

module.export = {
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                include: path.resolve('src'),
                use: 'Happypack/loader?id=js'
            },
            {
                test: /\.css$/,
                use: 'Happypack/loader?id=css'
            }
        ]
    },
    plugins:[
       Happypack({
            id: 'css',
            use: ['style-loader', 'css-loader']
        }),
        new Happypack({
            id: 'js',
            use: [{
                loader: 'babel-loader',
                option: {
                    presets:['@babel/preset-ebv']
                }
            }]
        })
    ]
}
```

## webpack自带优化

生产环境下的优化

- tree-shaking 把没用的代码自动删除掉  
import 在生产环境下，会自动去掉没有用的代码（没有用到）es6模块会把结果放到defalut  

- scope hosting 作用域提升，在webpack中自动简化代码

## 抽离公共代码

- wbpack3中使用`commChunkPlugins`，webpack4直接在`optimization`中配置  
- 按照规则分割代码块（chunks），应用于多页面打包

```
 optimization: {  
    splitChunks: { 
        cacheGroups:{ // 缓存组
            common:{ // 公共的模块
                chunks: 'initial', 
                miniSize: 0, //大于0抽离
                minChunks: 2, // 引用次数
            },
            vendor:{ // 第三方模块
                priority: 1,  // 权重，先抽离第三方模块
                test: /node_module/,
                chunks: 'initial',
                miniSize: 0, //大于0抽离
                minChunks: 2, // 引用次数
            }

        }
    }
}
```

## 懒加载

vue路由懒加载

```js
button.addEventListener('click',function(){
    // es6 草案中的语法，jsonp实现动态加载文件
    import('./source.js').then(data=>{
        console.log(data.default)
    })
})
```

`npm install @babel/plugin-syntax-dynamic-import -D`  
语法动态导入


```
module: {
    rules: [
        {
            test: /\.js$/,
            exclude: /node_modules/,
            include: path.resolve('src'),
            use: {
                loader: 'babel-loader',
                options: {
                    presets: [
                        '@babel/preset-env',
                    ],
                    plugins: [
                        '@babel/plugin-syntax-dynamic-import'
                    ]
                }
            }
        }
    ]
}
```

## 热更新


```js
devServer:{
    hot: true, // 启用热更新
    port: 3000,
    open: true,
    contentBase: './dist'
},
plugins:[
    new webpack.NamedModulesPlugin(),  // 打印更新的模块路径
    new webpack.HotModuleReplacementPlugin()   // 热更新插件
]
```





