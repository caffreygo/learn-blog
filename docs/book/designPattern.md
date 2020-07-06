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