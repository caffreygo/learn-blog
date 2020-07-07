# JavaScript设计模式与开发实践

## 基础

### JavaScript面向对象

::: tip 编程语言

- 静态类型语言
- 动态类型语言

:::

#### 静态类型语言（Java）

**优点**：能够在编译时就能发现**类型不匹配**的错误；

​			能够根据数据的不同类型进行针对的优化，提高程序的执行速度。

**缺点**:  强迫程序员必须使用**强契约**来编写程序，为每一个变量规定数据类型；

​	       类型的声明会增加更多的代码，这些细节容易让程序员的精力从思考业务逻辑上分散开。

#### 动态类型语言（Js）

**优点**：编写的代码数量更少，看起来也更简洁，程序员可以把精力更多的放在业务逻辑上面。

**缺点**: **无法保证**变量的类型，从而在程序运行期有可能发生跟类型相关的错误。

### this，call和apply

::: tip

- JavaScript中的this由运行时的环境决定
- arguments 参数类数组

- Array.prototype.shift.call(arguments) 移除数组第一项，返回该项
- Array.prototype.slice.call(arguments) 在不传参数的情况下可以达到浅拷贝的效果
- Array.prototype.concat.call(arr1, arr2) 数组合并

:::

**this指向的四种情况**

1. 作为对象的方法调用
2. 作为普通函数调用
3. 构造器调用
4. Function.prototype.call 或 Function.prototype.apply调用

- #### this作为对象方法调用

```js
// 第一种：作为对象方法调用
var obj = {
  a: 1,
  getA: function() {
    console.log(this.a)
  }
}
obj.getA(); // 输出1
```

- #### this作为普通函数调用

```js
// 第二种：作为普通函数调用
window.name = 'global-name';
var obj = {
  name: 'obj-name',
  getName: function() {
    return this.name;
  }
}
var newGetName = obj.getName;
console.log(newGetName());  // 输出global-name,执行函数的运行环境在window，而不是obj内
```

- #### this作为构造器调用

::: tip new进行构造器调用时的步骤:

1. 新创建一个对象
2. 新对象进行原型委托
3. this绑定到这个新对象
4. 如果构造器不返回其他对象，那么默认返回这个新对象

::: 

```js
// 第三种：作为构造器调用
function Student() {
  this.name = 'why';
}
var stu = new Student();
console.log(stu.name);      // 输出why

function Teacher() {
  this.name = 'www';
  return {
    name: 'AAA'
  }
}
var teacher = new Teacher();
console.log(teacher.name);  // 输出AAA，而不是wwww
```

- #### call和apply调用

::: tip 区别 

1. apply只接受两个参数，其中第二个参数是一个**类数组**或者**数组**
2. call可以接受多个参数，即参数不固定

::: 

```js
// call和apply的区别
var func = function(a,b,c) {
  console.log([a,b,c]);
}
// 当使用call和apply时，如果第一个参数传递的是null,则此时this指向全局对象
func.apply(null,[1,2,3]);   // 输出[1,2,3]
func.call(null,1,2,3);      // 输出[1,2,3]
```

::: tip 用途 

1. 改变this指向
2. Function.prototype.bind绑定
3. 借用其他对象的方法

::: 

- 改变this的指向

```js
// call和apply的用途：改变this指向
var obj1 = {
  name: 'why'
}
var obj2 = {
  name: 'www'
}
window.name = 'global-name'
var getName =function(){
  return this.name;
}
console.log(getName());           // 输出global-name
console.log(getName.call(obj1));  // 输出why
console.log(getName.apply(obj2)); // 输出www
```

- Function.prototype.bind绑定

```js
// call和apply的用途：Function.prototype.bind绑定
// 基础bind实现
Function.prototype.bind = function(context) {
  var self = this;
  return function() {
    return self.apply(context,arguments);
  }
}
var obj = {
  name: 'why'
}
var func = function() {
  console.log(this.name);
}.bind(obj);
func(); // 输出why
```

```js
// 完善版bind
Function.prototype.bind = function() {
  var self = this;
  var context = Array.prototype.shift.call(arguments); // 读取第一个参数，即this对象
  var args = Array.prototype.slice.call(arguments);    // 获取参数
  return function () {
    var newArgs = Array.prototype.concat.call(args,Array.prototype.slice.call(arguments));
    return self.apply(context,newArgs);
  }
}
var obj1 = {
  name: 'why'
}
var func = function(a,b,c,d) {
  console.log(this.name);
  console.log([a,b,c,d]);
}.bind(obj1,1,2);
func(3,4);    // 输出why  [1,2,3,4]
```

- 借用其他对象的方法

```js
// call和apply的用途：借用其他对象的方法
var Foo = function(name) {
  this.name = name;
}
var Bar = function() {
  Foo.apply(this,arguments);
}
Bar.prototype.getName = function(){
  return this.name;
}
var bar = new Bar('why');
console.log(bar.getName()); // 输出why
```

### 闭包和高阶函数

::: tip 闭包

1. 全局变量的生存周期是永久的
2. 局部变量在退出函数时，局部变量会被销毁
3. 闭包能够延长局部变量的生存周期

::: 

```js
// 变量的生存周期
window.name = 'why';
function foo() {
  var sex = '男';
  console.log(sex);
}
function bar() {
  var age = 10;
  return function() {
    return ++age;
  }
}
var _bar = bar();
console.log(name);    // 输出why
console.log(sex);     // 报错
console.log(_bar());  // 输出11
```

::: tip 闭包的作用

1. 封装变量
2. 延续局部变量的寿命

::: 

#### 封装变量

```js
// 闭包的作用：封装变量
// 实例：计算乘积
var mult = (function(){
  var cache = {};
  // 小函数提取出来
  var calculate = function() {
    var a = 1;
    for(var i=0,len=arguments.length;i<len;i++) {
      a = a * arguments[i];
    }
    return a;
  }
  // 闭包计算
  return function() {
    var args = Array.prototype.join.call(arguments,',');
    if(cache[args]) {
      return cache[args]
    }
    let result = calculate.apply([],arguments);
    cache[args] = result;
    return result;
  }
})()

console.log(mult(1,2,3,4)); // 输出24
```

#### 延续局部变量的寿命

```js
// 闭包的作用：延续局部变量的寿命
// 实例：利用img进行数据上报
var report = (function() {
  var imgs = [];
  return function(src) {
    var img = new Image();
    imgs.push(img);
    img.src = src;
  }
})()
```

闭包和面向对象的设计

::: tip 

​		用面向对象思想能实现的功能，用闭包也能实现，反之亦然。

::: 

```js
// 闭包和面向对象设计
var extent = function() {
  var value = 0;
  return {
    call: function() {
      value++;
      console.log(value);
    }
  }
}
var foo = extent();
foo.call();     // 输出1
foo.call();     // 输出2
foo.call();     // 输出3

var extent = {
  value: 0,
  call: function() {
    this.value++;
    console.log(this.value);
  }
}
extent.call();  // 输出1
extent.call();  // 输出2
extent.call();  // 输出3
```

#### 面向对象实现命令模式

```js
// 面向对象实现命令模式
var TV = {
  open: function(){
    console.log('打开电视');
  },
  close: function(){
    console.log('关闭电视')
  }
}
var TVCommand = function(receiver) {
  this.receiver = receiver
}
TVCommand.prototype.open = function(){
  this.receiver.open();
}
TVCommand.prototype.close = function(){
  this.receiver.close();
}
var setCommand = function(command) {
  return {
    open: function(){
      command.open();
    },
    close: function(){
      command.close();
    }
  }
}
var obj = setCommand(new TVCommand(TV));
obj.open();   // 输出打开电视
obj.close();  // 输出关闭电视
```

#### 闭包实现命令模式

```js
// 闭包实现命令模式
var TV = {
  open: function() {
    console.log('打开电视')
  },
  close: function() {
    console.log('关闭电视');
  }
}
var createCommand = function(receiver) {
  var open = function(){
    receiver.open();
  };
  var close = function(){
    receiver.close();
  }
  return {
    open: open,
    close: close
  }
}
var setCommand = function(command) {
  return {
    open: function(){
      command.open();
    },
    close: function() {
      command.close();
    }
  }
}
var obj =  setCommand(createCommand(TV));
obj.open();   // 输出打开电视
obj.close();  // 输出关闭电视
```

#### 闭包在内存泄露上的争议

1. 局部函数应该在函数退出时就销毁，而闭包却延续了局部变量的生存周期
   **解答**：闭包之所以会延长局部变量的生存周期，是因为该局部变量会在以后使用到，而需要使用到的变量，你把它存放在全局或者闭包里，对内存方面的影响是一致的。
2. 使用闭包容易形成循环引用，如果闭包的作用域链中保存着一些DOM节点，这可能会造成内存泄露
   **解答**：在IE浏览器中，垃圾回收机制是基于COM对象的引用计数策略，而基于此的垃圾回收机制无法在两个循环引用的对象之间进行回收，实质是并不是闭包的问题造成的。

#### ----高阶函数----

::: tip 条件

1. 函数可以作为参数被传递
2. 函数可以作为返回值输出

::: 

JavaScript语言中的函数显然满足高阶函数的条件，在实际开发中，无论是将函数作为参数传递还是让函数的执行结果返回另一个函数，这两种情形都有很多的应用场景。

#### 函数作为参数传递

```js
// 高阶函数的应用场景：函数作为参数传递
// 应用场景：创建100个div，并将这些div节点设置隐藏
var appendDiv = function(callback) {
  for(var i=0;i<100;i++) {
    var div = document.createElement('div');
    div.innerHTML = i;
    document.body.appendChild(div);
    if(typeof callback === 'function') {
      callback(div);
    }
  }
}
// 回调函数
var hideDiv = function(div) {
  div.style.display = 'none';
}

appendDiv(hideDiv);
```

#### 函数作为返回值输出

```js
// 高阶函数的应用场景：函数作为返回值输出
// 应用场景：注册isType方法
var isType = function(type) {
  return function(obj) {
    return Object.prototype.toString.call(obj) === '[object '+ type+']';
  }
}
var isNumber = isType('Number');
var isString = isType('String');
var isArray = isType('Array');
console.log(isNumber(12));      // 输出true
console.log(isString('abc'));   // 输出true
console.log(isArray([1,2,3]));  // 输出true
```

#### 实现AOP

::: tip 

​		AOP(面向切面编程)的主要作用是把一些跟核心业务逻辑模块无关的功能抽离出来，这些跟业务逻辑无关的功能通常包括日志统计，安全控制，异常处理等。把这些功能抽离出来后，再通过动态织入的方式掺入业务逻辑模块中

::: 

```js
// 高阶函数的应用场景：实现AOP
// 应用场景：装饰者模式
Function.prototype.before = function(beforeFn) {
  var _self = this;
  return function() {
    beforeFn.apply(this,arguments);
    return _self.apply(this,arguments);
  }
}
Function.prototype.after = function(afterFn) {
  var _self = this;
  return function() {
    var ret = _self.apply(this,arguments);
    afterFn.apply(this,arguments);
    return ret;
  }
}
var func = function() {
  console.log(2);
}
func = func.before(function(){
  console.log(1);
}).after(function(){
  console.log(3);
})
func();
```

#### 柯里化

::: tip 柯里化

又称部分求值，一个柯里化参数首先会接受一些参数，接受这些参数之后，该函数并不会立即求值，而是继续返回另外一个函数，刚才传入的参数在函数形成的闭包中被保存起来，待到合适的时机一起求值。

::: 

```js
// 高阶函数其他用法：柯里化
// 不完整的柯里化
var cost = (function(){
  var costs = [];
  return function() {
    // 开始计算
    if(arguments.length==0) {
      var total = 0;
      for(var i=0;i<costs.length;i++) {
        total += costs[i];
      }
      return total;
    } else {
      Array.prototype.push.apply(costs,arguments);
    }
  }
})()
cost(100);           // 未真正计算
cost(200);           // 未真正计算
cost(20);            // 未真正计算
cost(10);            // 未真正计算
console.log(cost()); // 真正计算，输出330

// 通用的柯里化
var currying = function(fn) {
  var args = [];
  return function() {
    if(arguments.length==0) {
      return fn.apply(this,args);
    } else {
      Array.prototype.push.apply(args,arguments);
      return arguments.callee;
    }
  }
}

var cost = (function(){
  var money = 0;
  return function() {
    for(var i = 0,len = arguments.length;i<len;i++) {
      money +=arguments[i];
    }
    return money;
  }
})()
var cost = currying(cost);
cost(100);
cost(200);
cost(20);
cost(10);
console.log(cost()); // 输出330
```

#### 函数节流

将原本一秒执行10次的事件，节流成一秒执行2次或者3次

::: tip 函数节流场景

1. window.onresize事件
2. mouseover事件
3. scroll事件
4. 其他

::: 

```js
// 高阶函数其他用法：函数节流
// 应用场景：window.onresize事件
var throttle = function(fn,interval) {
  var timer = null;
  var firstTime = true;
  var _self = fn;
  return function() {
    var that = this;
    var args = arguments;
    
    // 判断是否第一次执行
    if(firstTime) {
      _self.apply(that,args);
      return firstTime = false
    }
    // 判断定时器是否执行完毕
    if(timer) {
      return false;
    }
    timer = setTimeout(function() {
      clearTimeout(timer);
      timer = null;
      _self.apply(that,args);
    },interval || 500)
  }
}
window.onresize = throttle(function(){
  console.log('window onsize');
}, 500)
```

#### 分时函数

```js
// 高阶函数其他用法：分时函数
// 应用场景：分批次创建1000个DOM节点

// 分时函数
// 参数arr：要填充的数据
// 参数fn：要分时的函数
// 参数count：每一次分时的数量
// 参数interval：分时的间隔
var timeChunk = function(arr,fn,count,interval) {
  var timer = null;
  var data = null;
  var start = function() {
    for(var i = 0 ; i < Math.min(count || 1 , arr.length) ; i++) {
      data = arr.shift();
      fn(data);
    }
  }
  return function() {
    timer = setInterval(function(){
      if(arr.length == 0) {
        clearInterval(timer);
        timer = null;
        return;
      }
      start();
    }, interval || 200)
  }
}

var arr = [];
for(var i = 0 ; i < 1000 ; i++) {
  arr.push(i);
}

var renderDOMList = timeChunk(arr, function(data) {
  var div = document.createElement('div');
  div.innerHTML = data;
  document.body.appendChild(div);
},8,200);
renderDOMList();
```