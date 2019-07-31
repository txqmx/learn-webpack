# webpack配置练习

## 项目代码
慕课-去哪网的项目代码，只借用src代码来练习webpack配置，并将所有类库进行更新

### 技术栈
- vue@2.6.10
- vuex@3.1.1
- vue-router@3.0.7
- axios@0.19.0
- stylus@0.54.5

`npm install vue vuex vue-router axios stylus --save`

### 其他第三方库
- reset.css 初始化样式
- border.css 1像素边框问题
- fastclick@1.0.6 解决300ms延迟
- vue-awesome-swiper@3.1.3 轮播图
- better-scroll@1.15.2 上下滑动

`npm install fastclick vue-awesome-swiper better-scroll --save`

# 基本配置
`npm install webpack webpack-cli -D `
`npm install webpack-dev-server -D`
`npm install html-webpack-plugin -D`
`npm install css-loader style-loader -D`
`npm install stylus-loader -D`
`npm install vue-loader vue-template-compiler -D`
`npm install postcss-loader autoprefixer -D`
`npm install html-with-loader -D`
`npm install babel-loader @babel/core @babel/preset-env -D`
`npm install url-loader file-loader  -D`
 `npm install copy-webpack-plugin -D `
`npm install mini-css-extract-plugin -D`

serve

构建工具 | vue-cli2 | vue-cli3 | webpack4-handle
---|---|---|---
速度 | 11.4s | 6s| 3.9s
大小 | 400.4KB | 430.24kB | 371.4KB
