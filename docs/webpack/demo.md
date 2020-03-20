# 简单配置实例

## 环境配置

```
npm init -y
npm install webpack webpack-cli -D
```

```
|-- node_modules
|-- src
|  |-- index.js
|  |-- index.html
|-- package-lock.json
|-- package.json
|-- webpack.config.js
```

- 配置文件**webpack.config.js**

```js
const path = require('path')

module.exports = {
    mode: 'development', // production
    entry: path.join(__dirname, 'src', 'index.js'),
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, 'dist')
    }
}
```

package.json

```json
"scripts": {
    "build": "webpack"
}
```

- 在**html模板**中引入打包后的js，**启动服务**显示

```sh
npm install html-webpack-plugin -D
npm install webpack-dev-server -D
```

```js
const path = require('path')
const htmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    mode: 'development', // production
    entry: path.join(__dirname, 'src', 'index.js'),
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, 'dist')
    },
    plugins: [
        new htmlWebpackPlugin({
            template: path.join(__dirname, 'src', 'index.html'),
            // filename是插件引入js后产出的文件名，位置和output一致
            filename: 'index.html'
        })
    ]，
    devServer: {
    	port: 3000,
    	contentBase: path.join(__dirname, 'dist')  // 当前目录
	}
}
```

```sh
"scripts": {
    "dev": "webpack-dev-server"
}
```

## webpack-babel

实现**打包**输出**转义**ES6语

```sh
npm install @babel/core @babel/preset-env -D
```

新建一个.babelrc的babel配置文件（json格式）

```sh
|-- node_modules
|-- src
|  |-- index.js
|  |-- index.html
|-- package-lock.json
|-- package.json
|-- webpack.config.js
|-- .babelrc
```

**.babelrc**

```json
{
	"presets": ["@babel/preset-env"]
}
```

为src内的js文件添加babel-loader，由这个插件进行处理

```js
const path = require('path')
const htmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    mode: 'development', // production
    entry: path.join(__dirname, 'src', 'index.js'),
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, 'dist')
    },
    module: {
    	rules: [
            {
                test: /\.js$/,
                loader: ['babel-loader'],
                include: path.join(__dirname, 'src'),
                exclude: /node_modules/
            }
        ]  
    },
    plugins: [
        new htmlWebpackPlugin({
            template: path.join(__dirname, 'src', 'index.html'),
            // filename是插件引入js后产出的文件名，位置和output一致
            filename: 'index.html'
        })
    ]，
    devServer: {
    	port: 3000,
    	contentBase: path.join(__dirname, 'dist')  // 当前目录
	}
}
```

运行`npm run dev`可以得到转义的js

## 生产环境配置

添加`webpack.prod.js`

```sh
|-- node_modules
|-- src
|  |-- index.js
|  |-- index.html
|-- package-lock.json
|-- package.json
|-- webpack.config.js
|-- webpack.prod.js
```

修改mode为production生产环境（压缩版）；

去掉devServer这个开发环境配置项；

filename增加[contenthash]根据代码内容生产hash，缓存；

```
const path = require('path')
const htmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    mode: 'production',
    entry: path.join(__dirname, 'src', 'index.js'),
    output: {
        filename: 'bundle.[contenthash].js',
        path: path.join(__dirname, 'dist')
    },
    module: {
    	rules: [
            {
                test: /\.js$/,
                loader: ['babel-loader'],
                include: path.join(__dirname, 'src'),
                exclude: /node_modules/
            }
        ]  
    },
    plugins: [
        new htmlWebpackPlugin({
            template: path.join(__dirname, 'src', 'index.html'),
            // filename是插件引入js后产出的文件名，位置和output一致
            filename: 'index.html'
        })
    ]
}
```

```
"scripts": {
    "build": "webpack --config webpack.prod.js"
}
```

