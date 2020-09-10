# webpack

## 概念

`webpack` 是一个现代 JavaScript 应用程序的*静态模块打包器(module bundler)*。当 webpack 处理应用程序时，它会递归地构建一个*依赖关系图(dependency graph)*，其中包含应用程序需要的每个模块，然后将所有这些模块打包成一个或多个 *bundle*。

### 面向过程开发

**特征：** 一锅乱炖
在早期 `js` 能力还非常有限的时候，我们通过面向过程的方式把代码写在同一个`.js`文件中，一个面向过程的开发模式可能如下所示。

```html
<!-- index.html代码 -->
<p>这里是我们网页的内容</p>
<div id="root"></div>
<script src="./index.js"></script>
// index.js代码
var root = document.getElementById('root');

// header模块
var header = document.createElement('div');
header.innerText = 'header';
root.appendChild(header);

// sidebar模块
var sidebar = document.createElement('div');
sidebar.innerText = 'sidebar';
root.appendChild(sidebar);

// content模块
var content = document.createElement('div');
content.innerText = 'content';
root.appendChild(content);
```

### 面向对象开发

**特征：** 面向对象开发模式便于代码维护，深入人心。
随着 `js` 的不断发展，它所能解决的问题也越来越多，如果再像**面向过程**那样把所有代码写在同一个`.js`文件中，那么代码将变得非常难以理解和维护，此时**面向对象**开发模式便出现了，一个面向对象开发模式可能如下所示。

在`index.html`中引入不同的模块：

```html
<!-- index.html代码 -->
<p>这里是我们网页的内容</p>
<div id="root"></div>
<script src="./src/header.js"></script>
<script src="./src/sidebar.js"></script>
<script src="./src/content.js"></script>
<script src="./index.js"></script>
```

`header.js`代码：

```js
// header.js代码
function Header() {
  var header = document.createElement('div');
  header.innerText = 'header';
  root.appendChild(header);
}
```

`sidebar.js`代码：

```js
// sidebar.js代码
function Sidebar() {
  var sidebar = document.createElement('div');
  sidebar.innerText = 'sidebar';
  root.appendChild(sidebar);
}
```

`content.js`代码：

```js
// content.js代码
function Content() {
  var content = document.createElement('div');
  content.innerText = 'content';
  root.appendChild(content);
}
```

`index.js`代码：

```js
var root = document.getElementById('root');
new Header();
new Sidebar();
new Content();
```

**不足：** 以上的代码示例中，虽然使用**面向对象**开发模式解决了**面向过程**开发模式中的一些问题，但似乎又引入了一些新的问题。

1. 每一个模块都需要引入一个`.js`文件，随着模块的增多，这会影响页面性能
2. 在`index.js`文件中，并不能直接看出模块的逻辑关系，必须去页面才能找到
3. 在`index.html`页面中，文件的引入顺序必须严格按顺序来引入，例如：`index.js`必须放在最后引入，如果把`header.js`文件放在`index.js`文件后引入，那么代码会报错

### 现代开发模式

**特征：** 模块化加载方案让前端开发进一步工程化 
根据**面向对象**开发模式中的一系列问题，随后各种**模块化**加载的方案如雨后春笋，例如：`ES Module`、`AMD`、`CMD`以及`CommonJS`等，一个`ES Module`模块化加载方案可能如下所示。

`index.html`代码：

```html
<!-- index.html代码 -->
<p>这里是我们网页的内容</p>
<div id="root"></div>
<script src="./index.js"></script>
```

`header.js`代码：

```js
// header.js
export default function Header() {
  var root = document.getElementById('root');
  var header = document.createElement('div');
  header.innerText = 'header';
  root.appendChild(header);
}
```

`sidebar.js`代码：

```js
// sidebar.js
export default function Sidebar() {
  var root = document.getElementById('root');
  var sidebar = document.createElement('div');
  sidebar.innerText = 'sidebar';
  root.appendChild(sidebar);
}
```

`content.js`代码：

```js
// content.js代码
export default function Content() {
  var root = document.getElementById('root');
  var content = document.createElement('div');
  content.innerText = 'content';
  root.appendChild(content);
}
```

`index.js`代码：

```js
// index.js代码
import Header from './src/header.js';
import Sidebar from './src/sidebar.js';
import Content from './src/content.js';

new Header();
new Sidebar();
new Content();
```

**注意：** 以上代码并不能直接在浏览器上执行，因为浏览器并不能直接识别`ES Module`代码，需要借助其他工具来进行翻译，此时 Webpack 就粉墨登场了。



### webpack打包

不建议跟随此小结一起安装，此次示例仅仅作为一个例子，详细学习步骤请直接阅读下一章节[安装](https://wangtunan.github.io/blog/webpack/#安装)

#### 生成package.json文件

参数说明

`-y`参数表示直接生成默认配置项的`package.json`文件，不加此参数需要一步步按需进行配置。

```sh
$ npm init -y
```

生成的`package.json`文件：

```json
{
  "name": "webpack-vuepress",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```

#### 安装Webpack

参数说明

`-D`参数代表在本项目下安装 Webpack ，它是`--save-dev`的简写

```sh
$ npm install webpack webpack-cli -D
```

#### 修改代码

配置说明

```
webpack`默认打包路径到`dist`文件夹，打包后的`.js`文件名字叫`main.js
```

其他代码不动，将`index.html`中的`.js`文件改成如下引用方式(引用打包后的文件)：

```html
<!-- index.html代码 -->
<p>这里是我们网页的内容</p>
<div id="root"></div>
<script src="./dist/main.js"></script>
```

#### Webpack打包

参数说明

1. `npx webpack`代表在本项目下寻找 Webpack 打包命令，它区别于`npm`命令
2. `index.js`参数代表本次打包的入口是`index.js`

```sh
$ npx webpack index.js
```

打包结果： ![效果](../img/webpack/img2.png)

正如上面你所看到的那样，网页正确显示了我们期待的结果，这也是 Webpack 能为我们解决问题的一小部分能力，下面将正式开始介绍 Webpack 。

## loader的编写

::: tip Loader

​	loader实际上是一个函数，实现对源码source的处理

::: 

```shell
npm init
npm install webpack webpack-cli loader-utils -D
```

```sh
|-- loaders
|   |-- replaceLoader.js
|   |-- replaceLoaderAsync.js
|-- src
|   |-- index.js
|-- package.json
|-- webpack.config.js
```

- webpack.config.js （resolveLoader：loader引用时查找位置配置）

  ```js
  const path = require("path");
  
  module.exports = {
    mode: "development",
    entry: {
      main: "./src/index.js",
    },
    // path.resolve(__dirname, "loaders/replaceLoaderAsync.js")
    resolveLoader: {
      modules: ["node_modules", "./loaders"],
    },
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "[name].js",
    },
    module: {
      rules: [
        {
          test: /\.js/,
          // loader执行顺序从右到左
          use: [
            {
              loader: "replaceLoader",
            },
            {
              loader: "replaceLoaderAsync",
              options: {
                name: "Sumi",
              },
            },
          ],
        },
      ],
    },
  };
  
  ```

- replaceLoader.js

  ```js
  module.exports = function (source) {
    return source.replace("Sumi", "Enjoy");
  };
  ```
  
- replaceLoaderAsync.js

  ```js
  // loader-utils更方便获取到this   （options.name === this.query.name）
  const loaderUtils = require("loader-utils");
  
  module.exports = function (source) {
    const options = loaderUtils.getOptions(this);
    // this.async返回异步callback
    const callback = this.async();
  
    setTimeout(() => {
      const result = source.replace("Jerry", options.name);
      // callback返回更多数据
      callback(null, result);
    }, 2000);
  };
  ```

- index.js：   `console.log("hello Jerry");`

- package.json

  ```json
  {
    "scripts": {
      "build": "webpack"
    }
    ......
  }
  ```

  

## 模块打包工具？

webpack最早是一个js的模块打包工具，但是现在，webpack实际上已经是一个<font color=orange>模块打包工具</font>

```js
// commonjs
module.exports = ~
const ~ = require('src')

// ESModule
export default ~
import ~ from "src"
```

[webpack module](https://www.webpackjs.com/concepts/modules/)

[module methods](https://www.webpackjs.com/api/module-methods/)

[module variables](https://www.webpackjs.com/api/module-variables/)

## 安装

### 全局安装

:::注意

如果你只是想做一个 Webpack 的 Demo 案例，那么全局安装方法可能会比较适合你。如果你是在实际生产开发中使用，那么推荐你使用本地安装方法。

`webpack4.0+`的版本，必须安装`webpack-cli`，`-g`命令代表全局安装的意思

```sh
$ npm install webpack webpack-cli -g
```

### 卸载

参数说明

通过`npm install`安装的模块，对应的可通过`npm uninstall`进行卸载

```sh
$ npm uninstall webpack webpack-cli -g
```

### 本地安装(推荐)

参数说明

本地安装的`Webpack`意思是，只在你当前项目下有效。而通过全局安装的`Webpack`，如果两个项目的`Webpack`主版本不一致，则可能会造成其中一个项目无法正常打包。本地安装方式也是实际开发中推荐的一种`Webpack`安装方式。

```sh
$ npm install webpack webpack-cli -D 或者 npm install webpack webpack-cli --save-dev
```

### 版本号安装

参数说明

如果你对`Webpack`的具体版本有严格要求，那么可以先去github的`Webpack`仓库查看历史版本记录或者使用`npm view webpack versions`查看`Webpack`的`npm`历史版本记录

```sh
// 查看webpack的历史版本记录
$ npm view webpack versions

// 按版本号安装
$ npm install webpack@4.25.0 -D
```

