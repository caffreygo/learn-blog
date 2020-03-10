# JavaScript基础

## 变量类型和引用类型

### 值类型和引用类型

```javascript
// 值类型
let a = 100
let b = a
a = 200
console.log(b)  // b = 100

// 引用类型(现象：相互影响)
let a = {age: 20}
let b = a
b.age = 21
console.log(a.age)   // 21
```

- 栈：从上往下增加
- 堆：从下往上增加

| 栈   |       |      | 栈   |       |      | 栈   |       |
| ---- | ----- | ---- | ---- | ----- | ---- | ---- | ----- |
| key  | value |      | key  | value |      | key  | value |
| a    | 100   |      | a    | 100   |      | a    | 200   |
|      |       |      | b    | 100   |      | b    | 100   |



| 栈   |           |      | 栈   |           |      | 栈   |           |
| ---- | --------- | ---- | ---- | --------- | ---- | ---- | --------- |
| key  | value     |      | key  | value     |      | key  | value     |
| a    | 内存地址1 |      | a    | 内存地址1 |      | a    | 内存地址1 |
|      |           |      | b    | 内存地址1 |      | b    | 内存地址1 |

|           |             |      |           |             |      |           |            |
| --------- | ----------- | ---- | --------- | ----------- | ---- | --------- | ---------- |
| 内存地址1 | { age: 20 } |      | 内存地址1 | { age: 20 } |      | 内存地址1 | { age: 21} |
| key       | value       |      | key       | value       |      | key       | value      |
| **堆**    |             |      | **堆**    |             |      | **堆**    |            |

- 值类型的占用空间少，直接复制快；

- 引用类型有的时候占用类型会很大，直接复制会导致存储空间太大，而且直接复制可能会很慢

常见的值类型

```javascript
let a  // undefined
const s = 'abc'
const n = 100
const b = true
const s = Symbol('s')
```

常见的引用类型

```javascript
const obj = { x: 100 }
const arr = ['a', 'b', 'c']

const n = null  // 特殊引用类型，指针指向为空地址

// 特殊引用类型，但不用于存储数据，所以没有“拷贝、复制函数”一说
function () {}
```

### typeof运算符和深拷贝

- typeof

type能判读哪些类型：1.识别所以的值类型； 2.识别函数；  3.判断是否是引用类型

```javascript
// 判断所有值类型
let a;                   		typeof a   // 'undefined'
const str = 'abc';				typeof str // 'string'				
const n = 100;					typeof n   // 'number'
const b = true;					typeof b   // 'boolean'
const s = Symbol('s')			typeof s   // 'symbol'

// 能判断函数
typeof console.log()   // 'function'
typeof function(){}    // 'function'

// 能识别引用类型 （不能再继续识别）
type null              // 'object'
type ['a','b']         // 'object'
type { age: 20}        // 'object'
```

- 简单深拷贝
  1. 注意判断是值类型还是引用类型
  2. 注意判断是数组还是对象
  3. 递归

```javascript
function deepClone( obj = {}) {
    if(typeof(obj) !=='object' || typeof(obj) == null) {
        // obj是null,或者不是对象和数组，直接返回
        return obj
    }
    
    // 初始化返回结果
    let result
    if (obj instanceof Array) {
        result = []
    } else {
        result = {}
    }
    
    for (key in obj) {
        // 保证key不是原型的属性
        if(obj.hasOwnProperty(key)) {
            // 递归调用
            result[key] = deepClone(obj[key])
        }
    }
    
    return result
}
```

### 浅拷贝

浅拷贝的几种实现方法

1. 利用`Object.assign()`方法
2. 利用`...`扩展运算符

**第一种方法：** `Object.assign()`会拷贝原始对象中的所有属性到一个新对象上，如果属性为对象，则拷贝的是对象的地址，改变对象中的属性值，新拷贝出来的对象依然会受影响。

```js
var obj = {
  name: '张三',
  age: 23,
  isStudent: false,
  job: {
    name: 'FE',
    money: 12
  }
}
var newObj = Object.assign({}, obj);
obj.job.money = 21;
console.log(newObj.name);     // 输出张三
console.log(newObj.age);      // 输出23
console.log(newObj.job.money);// 输出21，受影响
```

**第二种方法：**`...`扩展运算符是`ES6`新增加的内容

```js
var obj = {
  name: '张三',
  age: 23,
  isStudent: false
}
var newObj = {...obj};
console.log(newObj.name);     // 输出张三
console.log(newObj.age);      // 输出23
```

### 深拷贝几种实现方式

1. 配合使用`JSON.parse()`和`JSON.stringify()`两个函数(局限性比较大)
2. 实现自己的简易深拷贝方法
3. `lodash`第三方库实现深拷贝

**第一种方法：** 利用`JSON`的序列化和反序列化方法，可以实现简易对象深拷贝，但此种方法有较大的限制：

1. 会忽略属性值为`undefined`的属性
2. 会忽略属性为`Symbol`的属性
3. 不会序列化函数
4. 不能解决循环引用的问题，直接报错

```js
var obj = {
  name: '张三',
  age: 23,
  address: undefined,
  sayHello: function() {
    console.log('Hello');
  },
  isStudent: false,
  job: {
    name: 'FE',
    money: 12
  }
}
var newObj = JSON.parse(JSON.stringify(obj));
obj.job.money = 21;
console.log(newObj.name);      // 输出张三
console.log(newObj.age);       // 输出23
console.log(newObj.job.money); // 输出12

console.log(newObj.address);   // 报错
console.log(newObj.sayHello());// 报错
```

**第二种：** 实现自己简易的深拷贝函数

```js
function deepClone(obj) {
  function isObject(o) {
    return (typeof o === 'object' || typeof o === 'function') && o !== null;
  }
  if(!isObject(obj)) {
    throw new Error('非对象');
  }
  var isArray = Array.isArray(obj);
  var newObj = isArray ? [...obj] : {...obj};
  Reflect.ownKeys(newObj).forEach(key => {
    newObj[key] = isObject(newObj[key]) ? deepClone(newObj[key]) : newObj[key];
  })
  return newObj;
}
var obj = {
  name: 'AAA',
  age: 23,
  job: {
    name: 'FE',
    money: 12000
  }
}
var cloneObj = deepClone(obj);
obj.job.money = 13000;
console.log(obj.job.money);     // 输出13000
console.log(cloneObj.job.money);// 输出12000
```

**第三种方法：** 使用[lodash](https://lodash.com/docs#cloneDeep)第三方函数库实现(需要先引入lodash.js)

```js
var obj = {
  name: '张三',
  age: 23,
  isStudent: false,
  job: {
    name: 'FE',
    money: 12
  }
}
var newObj = _.cloneDeep(obj);
obj.job.money = 21;
console.log(newObj.name);     // 输出张三
console.log(newObj.age);      // 输出23
console.log(newObj.job.money);// 输出12，不受影响
```

### 变量计算

- 字符串拼接

```javascript
const a = 100 + 10          // 110
const b = 100 + '10'        // '10010'    100+parseInt('10') === 110
const c = true + '10'       // 'true10'
```

- ==运算符

```javascript
// true
100 == '100'    
0 == ''
0 == false
fase == ''
null == undefined

// 除了 == null 之外，其他一律用 === ，例如

const obj = { x: 100 }
if(obj.a == null) {}
// 相当于:
// if (obj.a === null || obj.a === undefined) {}
```

- if语句和逻辑运算

1. truly变量： !!a === true 的变量
2. falsely变量： !!a === false 的变量

truly和falsely变量是经过两步取反后为true或者false的变量

```
// 一下是 falsely变量。 除此之外都是truely变量
!!0 === false
!!NaN === false
!!'' === false
!!null === false
!!undefined === false
!!false === false
```

- 逻辑判断

```javascript
console.log(10 && 0)            // 0
console.log('' || 'abc')        // 'abc'
console.log(!window.abc)        // true
```

## 原型和原型链

JavaScript是一个基于原型继承的，ES6的class其实也是原型继承

### class和继承

- constructor
- 属性
- 方法

```javascript
class Student {
    constructor (name,number) {
        this.name = name
        this,number = number
    }
    sayHi () {
        console.log(`姓名 ${this.name}, 学号 ${this.number}`)
    }
}

// 通过类 new 实例/对象
const caffrey = new Student('caffrey', 18)
console.log(caffrey.name)
console.log(caffrey.number)
caffrey.sayHi()
```

- class继承(extends)

```javascript
// 父类
class People {
    constructor (name) {
        this.name = name
    }
    eat() {
        console.log(`${this.name} eat a log`)
    }
}

// 子类
class Student extends People {
    constructor(name,number) {
        super(name)
        this.age = number
    }
    sayHi () {
        console.log(`姓名 ${this.name}, 学号 ${this.number}`)
    }
}

// 通过类 new 实例/对象
const caffrey = new Student('caffrey', 18)
console.log(caffrey.name)
console.log(caffrey.number)
caffrey.eat()
caffrey.sayHi()
```

### 原型

- 类型判断 - instanceof

```javascript
caffrey instanceof Student    // true
caffrey instanceof People     // true
caffrey instanceof Object     // true

[] instanceof Array     // true
[] instanceof Object    // true

{} instanceof Object    // true
```

- 原型

```
// class 实际上是函数， 可见是语法糖
typeof People   // 'function'
typeof Student   // 'function'

// 隐式原型和显式原型
console.log( caffrey.__proto__ )
console.log( Student.prototype )
console.log( caffrey.__proto === Student.prototype )    // true
```

![原型](../img/javascript/yuanxing.png)

- **原型关系**

1. 每个class都有显式原型
2. 每个实例都有隐式原型
3. 实例的隐式原型指向对应 class 的prototype(显式原型)

- **基于原型的执行规则**

1. 获取属性 caffrey.name 或执行方法 caffrey.sayHi( )时
2. 现在自身属性和方法寻找
3. 如果找不到则自动去隐式原型中寻找

### 原型链和instanceof

**实例的隐式原型指向构造函数的显式原型**

```
// student继承于People  
console.log( Student.prototype.__proto__ )
console.log( People.prototype )
console.log( Student.prototype.__proto__ === People.prototype )    // true
```

![原型链](../img/javascript/yuanxinglian.png)

- **hasOwnProperty**

hasOwnProperty方法是继承自Object的

```javascript
// hasOwnProperty检测是不是自身属性（非继承）
caffrey.name                            // 'caffrey'
caffrey.hasOwnProperty('name')          // true

caffrey.sayHi()                         // '姓名 caffrey , 学号 18'
caffrey.hasOwnProperty('sayHi')         // false
caffrey.hasOwnProperty('eat')           // false
```

![原型链](../img/javascript/yuanxinglian2.png)

- **instanceof**

实例沿着隐式原型链往上寻找，如果隐式原型能对应到class(构造函数)的显示原型，则返回true,否则返回false



1. class是ES6语法规范，由ECMA委员会发布
2. ECMA只规定语法规则，即我们的代码的书写规范，不规定如何实现
3. 以上实现方式都是V8引擎（yinqing）的实现方式，也是主流的

### 回顾

- 手写一个简易的jQuery,考虑插件和扩展性

```javascript
class jQuery {
    constructor(selector) {
        const result = document.querySelectorAll(selector)
        const length = result.length
        for(let i =0; i<length; i++) {
            this[i] = result[i]
        }
        this.length = length
        this.selector = selector
    }
    get(index) {
        return this[index]
    }
    each(fn) {
        for(let i =0; i<length; i++) {
            const elem = this[i]
            fn(elem)
        }
    }
    on(type, fn) {
        return this.each(elem => {
            elem.addEventListener(type, fn, false)
        })
    }
    ......
}
    
// 插件
   	jQuery.prototype.dialog = function (info) { alert(info) }
// "造轮子"
	class myJQuery extends jQuery {
        constructor(selector) {
            super(selector)
        }
        // 扩展自己的方法
        addClass(className) {
            ...
        }
    }
    
//  const $p = new jQuery('p')
//  $p.get(1)
//  $p.each(elem=> console.log(elem.nodeName))
//  $p.on('click',()=>alert('clicked'))
```

## 作用域和闭包

### 作用域和自由变量

![函数作用域](../img/javascript/hanshuzuoyongyu.png)

- **作用域**

代表了一个变量的合法使用范围，超出范围使用则报错

1. 全局作用域
2. 函数作用域
3. 块级作用域（ES6新增）

```
// 块级作用域 { }  let/const
if (true) {
	let x = 100
}
console.log(x)  // 会报错
```

- **自由变量**

1. 一个变量在当前作用域没有**定义**，但被使用了
2. 向上级作用域，一层一层依次寻找，直到找到为止
3. 如果到了全局作业域，则报错 ××× not defined

### 闭包

- 作用域应用的特殊情况，有两种表现（函数的声明和调用不在一个位置）
- 函数作为参数被传递
- 函数作为返回值被返回

```javascript
// 函数作为返回值
function create() {
	const a = 100
	return function () {
		console,log(a)
	}
}

const fn = create()
const a = 200
fn()  // 100   在create作用域声明，在全局作用域执行

```

```javascript
// 函数作为参数被传递
function print (fn) {
	const a = 200
	fn ()
}
const a = 100
function fn() {
	console.log(a)
}
print(fn)  // 100  在全局作用域声明，在print作用域执行
```

所有的自由变量的查找： 是在**定义**的地方，向上级作用域查找，不是在执行的地方！！

### this

- 作为普通函数
- 使用call apply bind （改变this指向）
- 作为对象方法被调用
- 在class方法中调用
- 箭头函数

this取什么值，是在函数**执行**的时候确认的，不是在函数定义的时候确认的

```javascript
function fn1 {
	console.log(this)
}

fn1()   // window

// 区别：call可以直接调用，bind返回一个新的函数来执行
fn1.call({x:100})     // {x: 100}

const fn2 = fn1.bind({x:200})
fn2()   // {x:200}
```

- **setTimeout中的this**

《JavaScript高级程序设计》第二版中，写到：“超时调用的代码都是在全局作用域中执行的，因此函数中this的值在非严格模式下指向window对象，在严格模式下是undefined”。

```javascript
const zhangsan = {
	name: '张三'，
	sayHi() {
		// this 即当前zhangsan对象
		console.log(this)
	}
	wait () {
		setTimeout (function () {
			// this === window,这个函数被执行是setTimeout本身被触发的执行，它并不是						// zhangsan.sayHi()这种方式的执行，作为一个普通函数被执行
			console.log(this)
		})
	}
}
```

**箭头函数**的this永远是取它**上级作用域**的this

```javascript
const zhangsan = {
	name: '张三'，
	sayHi() {
		// this 即当前zhangsan对象
		console.log(this)
	}
	wait () {
        // this 即当前zhangsan对象
		setTimeout (()=> {
			// this 即当前zhangsan对象
			console.log(this)
		})
	}
}
```

**class**中的this

```javascript
class People {
	constructor(name) {
		this.name = name
		this.age = 20
	}
	sayHi () {
		console.log(this)
	}
}
const cc = new People('caffrey')
cc.sayHi()   // cc 对象
```

- Tips:

  ```js
  // sayHi是对象方法，this指向caffrey
  caffrey.sayHi()               // name caffrey, age 18
  
  // 此时是隐式原型的对象方法，没有name和number,sayHi方法是在隐式原型中查找的
  caffrey.__proto__.sayHi()     // name undefined, age undefined
  ```

  

### 实例

#### bind函数

- bind函数的使用

```js
function fn1(a, b) {
    console.log('this', this)
    console.log(a, b)
    return 'this is fn1'
}

const fn2 = fn1.bind({x: 100},10,20)
const res = fn2()    // this {x: 100}; 10 20
console.log(res)	 // this is fn1
```

- 手写bind函数

```js
Function.prototype.bind1 = function() {
    // 将参数拆解为数组
    const args = Array.prototype.slice.call(arguments)
    
    // 获取this(数组的第一项)
    const t = args.shift()
    
    // fn1.bind(...) 中的 fn1
    const self = this
    
    // 返回一个函数
    return function () {
        return self.apply(t,args)
    }
}
```

#### 闭包的应用

- 隐藏数据

```js
function createCache () {
    const data = {}
    return {
        get: function(key) {
            return data[key]
        },
        set: function(key,value) {
            data[key] = value
        }
    }
}

const c = createCache ()
c.set('a',100)
c.get('a')       // 100
```

- 创建10个a标签，点击弹出对应值

```js
let a
// i在块级作用域内
for(let i=0;i<10,i++) {
    a = document.createElement('a')
    a.innerText = i +'<br>'
    a.addEventListener('click',function(e){
        e.preventDefault()
        alert(i)
    })
    document.body.appendChild(a)
}
```

- apply和call的区别

JavaScript中的每一个Function对象都有一个apply()方法和一个call()方法，它们的语法分别为：

```js
/*apply()方法*/
function.apply(thisObj[, argArray])

/*call()方法*/
function.call(thisObj[, arg1[, arg2[, [,...argN]]]]);
```

#### call、apply、bind

- **手写Call**

```js
Function.prototype.myCall = function(context) {
  if(typeof this !== 'function') {
    throw new TypeError('error');
  }
  context = context || window;
  context.fn = this;
  var args = [...arguments].slice(1);
  var result = context.fn(...args);
  delete context.fn;
  return result;
}
function foo(){
  console.log(this.age);
}
var obj = {
  age: 101
}
foo.myCall(obj); // 输出 101
```

- **手写apply**

```js
手写apply
// 手写
Function.prototype.myApply = function(context) {
  if(typeof this !== 'function') {
    throw new TypeError('error');
  }
  context = context || window;
  context.fn = this;
  var result = arguments[1] ? context.fn(...arguments[1]) : context.fn();
  delete context.fn;
  return result;
}
function foo(){
  console.log(this.age);
}
var obj = {
  age: 101
}
foo.myApply(obj); // 输出101
```

- **手写bind**

```js
Function.prototype.myBind = function(context) {
  if(typeof this !== 'function') {
    throw TypeError('error');
  }
  const self = this;
  const args = [...arguments].slice(1);
  return function F() {
    if(this instanceof F) {
      return new self(...args, ...arguments);
    }
    return self.apply(context, args.concat(...arguments));
  }
}
function foo() {
  console.log(this.age);
}
var obj = {
  age: 121
}
var newFunc = foo.myBind(obj);
newFunc(); // 输出121
```

## 异步

### 同步和异步的区别

#### 单线程

- JavaScript是单线程语言，只能同时做一件事

作为浏览器脚本语言，JavaScript 的主要用途是与用户互动，以及操作 DOM。这决定了它只能是单线程，否则会带来很复杂的同步问题。比如，假定JavaScript 同时有两个线程，一个线程在某个 DOM 节点上添加内容，另一个线程删除了这个节点，这时浏览器应该以哪个线程为准？

所以，为了避免复杂性，从一诞生，JavaScript 就是单线程，这已经成了这门语言的核心特征，将来也不会改变。

- 浏览器和nodejs已支持JS启动进程，如 Web Worker

为了利用多核 CPU 的计算能力，HTML5 提出 Web Worker 标准，允许 JavaScript 脚本创建多个线程，但是子线程完全受主线程控制，且不得操作 DOM。所以，这个新标准并没有改变 JavaScript 单线程的本质。

- JS和DOM渲染共用同一个线程，因为JS可修改DOM结构

#### 异步

（异步的背景就是单线程：同时只能做一件事）

- 遇到等待（网络请求，定时任务）不能卡住
- 需要异步
- 回调callback函数形式

```js
// 异步 (callback回调函数)
console.log(100)
setTimeout(function() {
    console.log(200)
}, 1000)
console.log(300)        // 100 300 200

// 同步 （卡住）
console.log(100)
alert(200)
console.log(300) 
```

#### 区别

- 基于JS是单线程语言
- 异步不会阻塞代码的执行
- 同步会阻塞代码的执行

### 异步应用场景

1. 网络请求，如ajax图片加载
2. 定时任务，如setTimeout

```js
// ajax
console.log('start')
$.get('src', function(res) {
	console.log(res)
})
console.log('end')

// 图片加载
console.log('start')
let img = document.createElement('img')
// onload callback
img.onload = function () {
    console.log('loaded')
}
img.src = '/***.png'
console.log('end')
```

### Promise

callback hell回调地狱

```js
// 获取res1
$.get(url1, (res1) => {
	console.log(res1)
    
	// 获取res2
	$.get(url2, (res2) => {
        console.log(res2)
        
        // 获取res3
        $.get(url3, (res3) => {
            console.log(res3)
            
            ......
        })
    })
})
```

Promise

```js
function getData (url) {
    // 返回一个Promise函数，函数参数是一个函数
    return new Promise((resolve, reject) => {
       	$.ajax({
            url,
            success(data) {
                resolve(data)
            },
            error(err) {
                reject(err)
            }
        })                
    })
}

const url  = '/data1.json'
const url  = '/data2.json'
const url  = '/data3.json'
getData(url1).then(data1 => {
    console.log(data1)
    return getData(url2)
}).then(data2 => {
    console.log(data2)
    return getData(url3)  
}).then(data3 => {
    console.log(data3) 
}).catch(err => console.error(err))
```

- 手写promise加载一张图片

```js
const url = "http://demo1.jinrui.kooboo.site/aironepage/HTML/img/1920x1080/01.jpg"

function loadImg (src) {
    // new Promise返回一个函数，两个参数也是函数
    return new Promise((resolve,reject) => {
        const img = document.createElement('img')
        img.onload = () => {
            resolve(img)
        }
        img.onerror =() => {
            const err = new Error('图片加载失败 '+src)
			reject(err)
        }
		img.src = src
    })
}

loadImg(url).then(img => {
    console.log(img.width)
    // return 的img会被传递到第二个then
    return img
}).then(img => {
    console.log(img.height)
}).catch(err => console.log(err))            // 1920 1080
```

```js
const url1 = '...'
const url1 = '...'

loadImg(url).then(img1 => {
    console.log(img1.width)
    // 返回img对象
    return img1
}).then(img1 => {
    console.log(img1.height)
    // 返回Promise实例
    return loadImg(url2)
}).then(img2) => {
    console.log(img2.width)
    return img2
}).then(img2) => {
    console.log(img2.height)
})
```

- setTimeout笔试题

```js
console.log(1)
setTimeout(function() {
    console.log(2)
}, 1000)
console.log(3)
// 只要是异步就会延迟执行
setTimeout(function() {
    console.log(4)
}, 0)
console.log(5)             // 1 3 5 4 2
```

