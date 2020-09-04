## js运行环境

### 运行环境

js作为脚本语言运行在浏览器中，浏览器就是js的运行环境。对于众多风云的浏览器厂商来说， 他们的内核又是不一样的。浏览器内核分为两种：**渲染引擎**和**js引擎**。

- 渲染引擎：负责网页内容呈现
- js引擎：解释js脚本，实现js交互效果

### js的执行

首先我们js文件以scirpt标签元素呈现在html里面的。浏览器根据html文件以此解析标签，当解 析到scirpt标签时，会停止html解析,阻塞住，开始下载js文件并且执行它，在执行的过程中，如 果是第一个js文件此时浏览器会触发首次渲染（至于为什么，自己做下实验，不懂的可以留言）。 所以出现一个问题js文件大大阻碍了html页面解析及渲染，所以引入async和defer两个属性（对于 首屏优化有很大的提升，也要谨慎使用）  

async:开启另外一个线程下载js文件，下载完成，立马执行。（此时才发生阻塞）  

defer:开启另一个线程下载js文件,直到页面加载完成时才执行。（根本不阻塞）

## js数据类型

### 基本数据类型

- string
- number
- boolean
- undefined
- null
- Symbol

### 引用数据类型

- object （array、date、function）

```js
// 判断对象
val !== null && typeof val === 'object'
// 判断纯对象
Object.prototype.toString.call(val) === '[object Object]'
// Date对象
Object.prototype.toString.call(val) === '[object Date]'
```

### typeof

```js
typeof(null) === "object"
typeof(()=>true) === "function"
```

### instanceof

检测当前对象实例的原型链