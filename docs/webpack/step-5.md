# 5-webpack配置案例

## 5-1 Library打包

当需要将自己的库文件打包给他人使用时，我们便需要设及到library的打包

#### 新建一个项目

::: tip STEP

- 新建一个<font color=orange>library</font>文件夹
- <font color=orange>npm init -y</font> 生成<font color=orange>package.json</font>文件
- 新建<font color=orange>src</font>文件夹，新建index.js、string.js和math.js文件
- 在根目录（library文件夹）下创建<font color=orange>webpack.config.js</font>文件
- <font color=orange>npm install webpack webpack-cli --save</font>

:::

生成的项目目录如下

```js
|-- src
|   |-- index.js
|   |-- math.js
|   |-- string.js
|-- webpack.config.js
|-- package.json
```

对package文件作一些修改

```js
{
  "name": "library",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "build": "webpack"
  },
  "keywords": [],
  "author": "",
  "license": "MIT"
}
```

**MIT**:MIT 协议是所有开源许可中最宽松的一个，除了必须包含许可声明外，再无任何限制。



#### **math.j**s (实现的简单四则运算)

```js
export function add(a, b) {
  return a + b;
}
export function minus(a, b) {
  return a - b;
}
export function multiply(a, b) {
  return a * b;
}
export function division(a, b) {
  return a / b;
}
```

#### **string.js** (字符串的拼接)

```js
export function join(a, b) {
  return a + '' + b;
}
```

#### **index.js**

```js
import * as math from './math';
import * as string from './string';

export default { math, string };
```

#### **webpack.config.js**

```js
const path = require('path');

module.exports = {
  mode: 'production',   //库文件的打包配置生产环境即可
  entry: './src/index.js',
  output: {
    filename: 'library.js',
    path: path.resolve(__dirname, 'dist')
  }
}
```

#### 打包

`npm run build`进行打包，在`dist`目录下会生成一个叫`library.js`的文件

我们要测试这个文件的话，需要在`dist`目录下新建`index.html`

```sh
$ npm run build
$ cd dist
$ touch index.html
```

在`index.html`中引入`library.js`文件：

```html
<script src="./library.js"></script>
```

#### 引用场景

库文件打包之后，在引入的过程中会有很多方法

- import library from 'library'      //  ES Module

- const library = require('library')     //  CommonJS

- require(['library'], function() {   ...   })   //   AMD

- ```html
  <script src="./library.js></script>
  ```

::: tip 打包配置

针对于出现的各种引入方式，我们需要配置webpack的相关library参数:<font color=orange>output</font>中的<font color=orange>library</font>和<font color=orange>libraryTarget</font>

:::

```js
const path = require('path');
module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    filename: 'library.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'library',
    libraryTarget: 'umd'
  }
}
```

#### 配置属性说明

- **library**：这个属性将该库设置为全局变量library，类似于`jquery`中的`$`符号（名称）
- **libraryTarget**: 这个属性指，我们库应该支持的模块引入方案，`umd`代表支持`ES Module`、`CommomJS`、`AMD`以及`CMD`, `this`表示将library挂载在全局的this上面（window、global）,可以通过this.library获取到这个库相应的内容。

在配置完毕后，我们再使用`npm run build`进行打包，并在浏览器中运行`index.html`，可以在`console`控制台输出`library`这个全局变量。

#### externals

::: tip 场景：

当我们的库文件需要引入第三方库（lodash）,而这样往往可能造成和引入的项目重复打包了这个第三方库，为了避免这种情况，可以配置<font color=orange>webpack.config.js</font>的<font color=orange>externals</font>参数

[externals](https://webpack.js.org/configuration/externals/#root)

:::

```js
const path = require('path');
module.exports = {
  mode: 'production',
  entry: './src/index.js',
  externals: ['lodash'],
  output: {
    filename: 'library.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'library',
    libraryTarget: 'umd'
  }
}
```

**这样我们的库文件在打包过程中便会忽略lodash这个库文件,这样要求在使用这个库文件时必需先引入lodash**

external参数也可以是一个对象

```js
externals: {
    lodash: {
        commonjs: 'lodash'
    }
}
// 如果这个库在commonjs环境下引入，必需取名为lodash
// const lodash = require('lodash')
// const library = require('library')
```

#### 库文件的发布

::: tip 步骤

- 注册`npm`账号
- 修改`package.json`文件的入口，修改为：`"main": "./dist/library.js"`
- 运行`npm adduser`添加账户名称
- 运行`npm publish`命令进行发布
- 运行`npm install xxx`来进行安装

:::

