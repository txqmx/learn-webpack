[toc]

# webpack介绍
## 什么是webpack
webpack可以看做是模块打包机，他做的事情是，分析你的项目结构，找到js模块以及其他的一些浏览器不能直接运行的拓展语言（Scss，TypeScript等），并将其打包为合适的格式以供浏览器使用

可以做的事情
>- 代码转换（es6->es5）
>- 文件优化（压缩代码体积、合并文件）
>- 代码分割（公共模块处理、路由抽离）
>- 模块合并
>- 自动刷新（本地服务，热更新）
>- 代码校验
>- 自动发布

## 需要掌握内容
- node基础，npm使用
- es6语法

## webpack安装
- 安装本地的webpack
- `npm install webpack webpack-cli -D`   开发依赖

## webpack可以进行0配置
- 打包工具 -> 输出后的结果（js模块）
- 默认入口 src->index.js
- `npx webpack`
- 打包（支持js的模块化）

## 打包文件解析

```js
(function(modules) {
    // 定义一个缓存
	var installedModules = {};
	//  实现一个require方法
	function __webpack_require__(moduleId) {
		//  检查是都在缓存中
		if(installedModules[moduleId]) {
			return installedModules[moduleId].exports;
		}
		// 创建一个新模块（并将其放入缓存）
		var module = installedModules[moduleId] = {
			i: moduleId,
			l: false,
			exports: {}
		};
		// 执行模块功能
		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
		// 将模块标记为已加载
		module.l = true;
		// 返回模块的导出
		return module.exports;
	}
	
	// 加载输入模块并返回导出
	return __webpack_require__(__webpack_require__.s = "./src/index.js"); // 入口模块
})
({
    "./src/a.js":  // key -> 模块的路径
        (function(module, exports) { // value 函数
            eval("module.exports = 'liusinan'\n\n\n//# sourceURL=webpack:///./src/a.js?");
        }),
    "./src/index.js":
     (function(module, exports, __webpack_require__) {
         eval("let str = __webpack_require__(/*! ./a.js */ \"./src/a.js\")\nconsole.log(str);\n\n\n//# sourceURL=webpack:///./src/index.js?");
     })
});
```

