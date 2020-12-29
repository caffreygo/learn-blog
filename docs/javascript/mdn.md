# MDN JS

## 语法和数据类型

### 变量

在应用程序中，使用变量来作为值的符号名。变量的名字又叫做**标识符**

::: tip 变量提升

let const声明的变量也存在**变量提升**的问题，但是不会被赋予初始值（undefined），引用它会报引用错误（ReferenceError）。

这个变量将从代码块一开始的时候就处在“暂时性死区”，直到这个变量被声明为止。

:::

```js
console. log(x)    // Reference Error 未声明的变量，暂时性死区
let x = 3

console. log(y)    // undefined 声明但未赋值
var y = 3
```

```js
var myvar = "my value";

(function() {
  var myvar;  // 立即执行函数作用域内myvar变量提升，声明但未赋值，不在访问外部的变量
  console.log(myvar); // undefined
  myvar = "local value";
})();
```

::: tip 函数提升:对于函数来说，只有函数声明会被提升到顶部，而函数表达式不会被提升。

```js
/* 函数声明 */

foo(); // "bar"

function foo() {
  console.log("bar");
}


/* 函数表达式 */

baz(); // 类型错误：baz 不是一个函数

var baz = function() {
  console.log("bar2");
};
```

:::

### 常量

::: tip 用关键字 `const` 创建一个只读的常量

常量不可以通过重新赋值改变其值，也不可以在代码运行时重新声明。它必须被初始化为某个值。

常量的作用域规则与 `let` 块级作用域变量相同。若省略`const`关键字，则该标识符将被视为变量。

在同一作用域中，不能使用与变量名或函数名相同的名字来命名常量。

:::

```js
// 这会造成错误
function f() {};
const f = 5;

// 这也会造成错误
function f() {
  const g = 5;
  var g;

  //语句
}
```

### 数据类型

- 七种基本数据类型:
  - 布尔值（Boolean），有2个值分别是：`true` 和 `false`.
  - null ， 一个表明 null 值的特殊关键字。 JavaScript 是大小写敏感的，因此 `null` 与 `Null`、`NULL`或变体完全不同。
  - undefined ，和 null 一样是一个特殊的关键字，undefined 表示变量未赋值时的属性。
  - 数字（Number），整数或浮点数，例如： `42` 或者 `3.14159`。
  - 任意精度的整数 (BigInt) ，可以安全地存储和操作大整数，甚至可以超过数字的安全整数限制。
  - 字符串（String），字符串是一串表示文本值的字符序列，例如："Howdy" 。
  - 代表（Symbol） ( 在 ECMAScript 6 中新添加的类型).。一种实例是唯一且不可改变的数据类型。
- 以及对象（Object）。

### 数据类型的转换

```js
"37" - 7 // 30
"37" + 7 // "377"

// 字符串转换为数字: 使用一元加法运算符 / parseInt()和parseFloat()
"1.1" + "1.1" = "1.11.1"
(+"1.1") + (+"1.1") = 2.2
```

