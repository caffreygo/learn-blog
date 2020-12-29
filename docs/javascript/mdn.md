# MDN JS

## 语法和数据类型

### 变量提升

::: tip

let const声明的变量也存在**变量提升**的问题，但是不会被赋予初始值（undefined），引用它会报引用错误（ReferenceError）。

这个变量将从代码块一开始的时候就处在“暂时性死区”，直到这个变量被声明为止。

:::

```js
console. log(x)    // Reference Error
let x = 3

console. log(y)    // undefined
var y = 3
```

1. var let  变量
2. const   常量 （字面量(literals) : 常量，不可更改）

