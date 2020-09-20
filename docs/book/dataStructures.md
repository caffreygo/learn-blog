## JavaScript基础

### 真值和假值

- undefined、null为falsy

- JavaScript的对象都是true, 所以 `new Boolean(false)`是truthy
- 数值除了+0、-0和NaN都是falsy
- 字符串长度为0则为falsy

```js
function testTruthy(val) {
	return val ? 'truthy' : 'falsy'
}

testTruthy({});  // truthy

testTruthy('');                 // falsy
testTruthy(new String(''));     // truthy
testTruthy(false);              // falsy
testTruthy(new Boolean(false)); // truthy
testTruthy(NaN);                // falsy
testTruthy(new Number(NaN));    // truthy
```

### 构造函数

```js
function Book(name) {
	this.name = name
	this.printName = function() {
		console.log(this.name)
	}
}
// Book.prototype.printName = function(){ ... }
```

- 在prototype的例子里，printName函数只会创建一次，在所有的实例中共享；如果在类里面定义，和前面的生命一样，每个实例内都会创建自己的函数副本。
- 在prototype内的生命可以节约内存，但是不能像类声明一样声明只在类的内部访问的privatte函数和属性。

### 声明展开和剩余参数

#### 声明展开

```js
let params = [2, 4, 5]
console.log(sum(...params))    // ..params  === 2, 4, 5
```

以上代码和下面ES5效果一样

```js
console.log(sum.apply(undefined, params))
// apply(this, params[])
```

#### 剩余参数

```js
function restParameterFunc (x, y, ...a) {
	return (x+y)*a.length
}

console.log(restParameterFunc(1, 2, "hello", true, 7))  // (1+2)*3=9
```

以上代码和下面ES5效果一样

```js
function restParameterFunc (x, y) {
	var a = Array.prototype.slice(arguments, 2)
	return (x+y)*a.length
}
```

### 数组结构

```js
let [x, y] = ['a', 'b']

[x, y] = [y, x]   //值的互换

let obj = {x, y}  // {x: 'b', y: 'a'}
```

### 对象方法简写

```js
var hello = {
	name: 'caffrey',
	printInfo: function() {
		console.log('123')
	}
}
```

### 模块

::: tip 模块

- ES2015的官方模块功能`import/export`
- 异步模块定义(AMD)，RequireJS是AMD最流行的实现 `require([module], callback)`
- Node.js使用Common.js模块的require语法`require([module])`

::: 

#### 重命名

```js
// 导入重命名
import { a as newName } from "~";

import * as all from "~"      // 整个模块作为变量导入

// 导出重命名
export { a as newAName, b as newBName }
```

## ES6数组

### for...of循环迭代

```js
let numbers [1, 2, 3, ..., 14, 15]
for (const n of numbers) {
	console.log(n % 2 === 0 ? 'even' : 'odd')
}
```

### 使用@@iterator对象

ES2015为Array类增加了一个**@@iterator**属性，需要通过Symbol.iterator来访问。

```js
let iterator = numbers[Symbol.iterator]()      
console.log(iterator.next().value);   // 1
console.log(iterator.next().value);   // 2
console.log(iterator.next().value);   // 3


for(const n of iterator) {
    console.log(n)        // 1, 2, 3, ..., 14, 15
}
```

数组中的所有值都迭代完之后，iterator.next().value会返回undefined

### entries、keys和values

ES2015还增加了三种从数组中得到**迭代器**的方法。

- entries方法返回了**包含键值对的@@iterator**

```js
const aEntries = numbers.extries;     // Array Iterator {}
console.log(aEntries.next().value);   // [0, 1]  位置0的值为1
console.log(aEntries.next().value);   // [1, 2]  位置1的值为2
console.log(aEntries.next().value);   // [2, 3]  位置2的值为3

for(const n of numbers.entries()) { 
    console.log(n)    // [0, 1]  [1, 2] [2, 3] ...
}
```

- keys方法返回**包含数组索引的@@iterator**

```js
const aKeys = numbers.keys();
console.log(aKeys.next().value);   // {value: 0, done: false}
console.log(aKeys.next().value);   // {value: 1, done: false}
console.log(aKeys.next().value);   // {value: 2, done: false}
```

- values方法返回的**@@iterator则包含数组值**

```js
const aValues = numbers.values();
console.log(aValues.next().value);   // {value: 1, done: false}
console.log(aValues.next().value);   // {value: 2, done: false}
console.log(aValues.next().value);   // {value: 3, done: false}
```

### Array.from方法

Array.from根据已有的数组创建一个新数组。

```js
let numbers1 = Array.from(numbers)   // 数组的复制
```

还可以传入**过滤函数**

```js
let evens = Array.from(numbers, x => (x % 2 == 0) )
// [false, true, false, true, ..., false]
```

### Array.of方法

Array.of根据传入的参数创建一个新数组

```js
let numbers = Array.of(1,2,3)   // let numbers = [1, 2, 3]
```

::: tip 

​		Array.from(numbers) 和 Array.of(...numbers) 效果一样哦

:::

### fill方法

```js
/*
 * fill(fillData ?,start ?,end)
*/
let nums = Array.of(1, 2, 3, 4, 5, 6)       // [1, 2, 3, 4, 5, 6]
nums.fill(0)         // [0, 0, 0, 0, 0, 0]
nums.fill(2,1)       // [0, 2, 2, 2, 2, 2]
nums.fill(1,3,5)     // [0, 2, 2, 1, 1, 2]
```

::: tip  创建数组并初始化

```js
let ones = Array(6).fill(1)   // [1, 1, 1, 1, 1, 1]
```

:::

### copyWithin方法

::: tip copyWithin

​	copyWithin(index, start, end)

​	copyWithin方法复制数组中的一系列元素到同一数组指定的起始位置

:::

```js
// 将从位置3开始的4，5，6复制到0位置
let copyArr = [1, 2, 3, 4, 5, 6]
copyArr.copyWithin(0, 3)     // [4, 5, 6, 4, 5, 6]
```

```js
// 把4、5(在位置3和4上)复制到位置1和2
let copyArr = [1, 2, 3, 4, 5, 6]
copyArr.copyWithin(1, 3, 5)     // [1, 5, 6, 4, 5, 6]
```

### find和findIndex

- find方法返回第一个满足条件的**值**
- findIndex返回第一个满足条件的值的**索引**

```js
let nums = [1,2,3,4,5,6,7,8,9,10]
function multipleOf5(element, index, array) {
	return (element % 5 == 0)
}
console.log(nums.find(multipleOf5))        // 5
console.log(nums.findIndex(multipleOf5))   // 4
```

### includes方法

::: tip includes

​	includes(data, ?start)

​	如果数组内存在某个元素则返回true，否则返回false

​	includes还接受另外一个参数，表示开始搜索的**起始位置**

:::

```js
let nums = [1,2,3,4,5,6,7,8,9,10]

console.log(nums.includes(3))    // true
console.log(nums.includes(11))   // false

console.log(nums,includes(3,2))  // true
console.log(nums,includes(3,3))  // false
```

### 类型数组

类型数组用于存储单一类型的数据`ley arr = new TypeArray(length)`

```js
let int16 = new Int16Array(5)
```

