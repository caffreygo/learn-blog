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

## 二叉树

::: tip 

​		对于树，使用两个指针，一个指向左侧子节点，另一个指向右侧子节点。因此，将声明一个Node类来表示树中的每个节点。键是树相关的术语中对节点的称呼。

::: 

```js
export class Node {
    constructor(key) {
        this.key = key
        this.left = null
        this.right = null
    }
}

export default class BinarySearchTree {
    constructor(compareFn = defaultCompare) {
        this.compareFn = compareFn;   // 用来比较节点值
        this.root = null;  // Node类型的根节点
    }
}
```

### 插入 insert

❑ 如果树非空，需要找到插入新节点的位置。因此，在调用insertNode方法时要通过参数传入树的根节点和要插入的节点。

❑ 如果新节点的键小于当前节点的键（现在，当前节点就是根节点）（行{4}），那么需要检查当前节点的左侧子节点。注意在这里，由于键可能是复杂的对象而不是数，我们使用传入二叉搜索树构造函数的compareFn函数来比较值。如果它没有左侧子节点（行{5}），就在那里插入新的节点（行{6}）。如果有左侧子节点，需要通过递归调用insertNode方法（行{7}）继续找到树的下一层。在这里，下次要比较的节点将会是当前节点的左侧子节点（左侧节点子树）。

❑ 如果节点的键比当前节点的键大，同时当前节点没有右侧子节点（行{8}），就在那里插入新的节点（行{9}）。如果有右侧子节点，同样需要递归调用insertNode方法，但是要用来和新节点比较的节点将会是右侧子节点（右侧节点子树）

```js
insert(key) {
    if(this.root == null) {
        this.root = new Node(key)
    }else {
        this.insertNode(this.root, key)
    }
}

insertNode(node, key) {
    if(this.compareFn(key, node.key) === Compare.LESS_THAN) {   // 4
        if(node.left == null) {                                 // 5
            node.left = new Node(key)                           // 6
        } else {
            this.insertNode(node.left, key)                     // 7
        }
    }else {
        if(node.right == null) {                                // 8
           node.right = new Node(key)                           // 9
		}else {
            this.insertNode(node.right, key)                    // 10
        }
    }
}
```

### 中序遍历

::: tip 

​		对于**父节点**的处理放在中间

​		中序遍历是一种以上行顺序访问BST所有节点的遍历方式，也就是以从最小到最大的顺序访问所有节点。中序遍历的一种应用就是对树进行**排序操作**

::: 

```js
inOrderTraverseNode(node, callback) {
    if(node!=null) {
        this.inOrderTraverseNode(node.left, callback)
        callback(node.key)
        this.inOrderTraverseNode(node.right, callback)
    }
}
```

​		要通过中序遍历的方法遍历一棵树，首先要检查以参数形式传入的节点是否为null——这就是停止递归继续执行的判断条件，即递归算法的**基线条件**。

​		然后，递归调用相同的函数来访问左侧子节点。接着对根节点进行一些操作（callback），然后再访问右侧子节点。

### 先序遍历

::: tip 

​		先序遍历是以优先于后代节点的顺序访问每个节点的。先序遍历的一种应用是打印一个结构化的文档。

::: 

```js
preOrderTraverseNode(node, callback) {
    if(node!=null) {
        callback(node.key)
        this.preOrderTraverseNode(node.left, callback)
        this.preOrderTraverseNode(node.right, callback)
    }
}
```

### 后序遍历

::: tip 

​		后序遍历则是先访问节点的后代节点，再访问节点本身。后序遍历的一种应用是计算一个目录及其子目录中所有文件所占空间的大小。

::: 

```
postOrderTraverseNode(node, callback) {
    if(node!=null) {
        this.postOrderTraverseNode(node.left, callback)
        this.postOrderTraverseNode(node.right, callback)
        callback(node.key)
    }
}
```

### 搜索最小、最大值

```js
min() {
    return this.minNode(this.root)
}
minNode(node) {
    let current = node
    while(current != null && current.left !=null) {
        current = current.left
    }
    return current
}

max() {
    return this.maxNode(this.root)
}
maxNode(node) {
    let current = node
    while(current != null && current.right !=null) {
        current = current.right
    }
    return current
}
```

### 搜索特定值

```js
search(key) {
	return this.searchNode(this.root, key)
}

searchNode(node, key) {
    if(node == null) {
		return false
    }
    if(this.compareFn(key, node.key) === CompareFn.LESS_THAN) {
        return this.searchNode(node.left, key)
    }else if(this.compareFn(key, node.key) === CompareFn.BIGGER_THAN) {
        return this.searchNode(node.right, key)
    }else {
        return true
    }
}
```

### 移除节点

::: tip 

​		root被赋值为removeNode方法的返回值, 父节点总是会接收到函数的返回值

- 移除一个叶节点
- 移除有一个左侧或右侧子节点的节点
- 移除有两个子节点的节点

::: 

```js
remove(key) {
	this.root = this.removeNode(this.root, key)
}

removeNode(node, key) {
    if(node == null) {
		return null
    }
    if(this.compareFn(key, node.key) === CompareFn.LESS_THAN) {
        node.left = this.removeNode(node.left, key)
        return node
    }else if(this.compareFn(key, node.key) === CompareFn.BIGGER_THAN) {
        node.right = this.removeNode(node.righ, key)
        return node
    }else {
        // 移除一个叶节点
        if(nopde.left == null && node,right == null) {
            node = null
            return node
        }
        // 移除有一个左侧或右侧子节点的节点
        if(node.left == null) {
            node = node.right
            return node
        }else if(node.right == null) {
            node = node.left
            return node
        }
        // 移除有两个子节点的节点
        const aux = this.minNode(node.right)
        node.key = aux.key
        node.right = this.removeNode(node.right, aux.key)
        return node
    }
}
```

**移除有两个子节点的节点**:  

要移除有两个子节点的节点，需要执行四个步骤。

(1) 当找到了要移除的节点后，需要找到它右边子树中最小的节点。(2) 然后，用它右侧子树中最小节点的键去更新这个节点的值。通过这一步，我们改变了这个节点的键，也就是说它被移除了。

(3) 但是，这样在树中就有两个拥有相同键的节点了，这是不行的。要继续把右侧子树中的最小节点移除，毕竟它已经被移至要移除的节点的位置了。

(4) 最后，向它的父节点返回更新后节点的引用。findMinNode方法的实现和min方法的实现方式是一样的。唯一的不同之处在于，在min方法中只返回键，而在findMinNode中返回了节点。