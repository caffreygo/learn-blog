# JavaScript解答

## JavaScript基础面试题

### new的过程

无论是通过字面量还是通过`new`进行构造函数调用创建出来的对象，其实都一样。调用`new`的过程如下：

1. 创建一个新对象
2. 原型绑定
3. 绑定this到这个新对象上
4. 返回新对象

### this全解析

`JavaScript`中的`this`只有如下几种情况，并按他们的优先级从低到高划分如下：

1. 独立函数调用，例如`getUserInfo()`，此时`this`指向全局对象`window`
2. 对象调用，例如`stu.getStudentName()`，此时`this`指向调用的对象`stu`
3. `call()`、`apply()`和`bind()`改变上下文的方法，`this`指向取决于这些方法的第一个参数，当第一个参数为`null`时，`this`指向全局对象`window`
4. 箭头函数没有`this`，箭头函数里面的`this`只取决于包裹箭头函数的第一个普通函数的`this`
5. `new`构造函数调用，`this`永远指向构造函数返回的实例上，优先级最高。

```js
var name = 'global name';
var foo = function() {
  console.log(this.name);
}
var Person = function(name) {
  this.name = name;
}
Person.prototype.getName = function() {
  console.log(this.name);
}
var obj = {
  name: 'obj name',
  foo: foo
}
var obj1 = {
  name: 'obj1 name'
}

// 独立函数调用，输出：global name
foo();
// 对象调用，输出：obj name
obj.foo();
// apply()，输出：obj1 name
obj.foo.apply(obj1);
// new 构造函数调用，输出：p1 name
var p1 = new Person('p1 name');
p1.getName();
```

![this解析](../img/javascript/this.png)

## 运行环境

### 加载资源的过程

- 浏览器根据DNS服务器得到域名的IP地址
- 向这个IP的机器发送http请求
- 服务器收到、处理并返回http请求
- 浏览器得到返回内容

### 浏览器渲染页面的过程

- 根据HTML结构生成DOM Tree
- 根据CSS生成CSSOM
- 将DOM和CSSOM整合形成RenderTree
- 根据RenderTree开始渲染和展示
- 遇到`<script>`时，会执行并阻塞渲染

### window.onload和DOMContentLoaded

```js
window.addEventListener('load', function (){
	// 页面的全资源加载完才会执行，包括图片、视频等
})

window.addEventListener('DOMContentLoaded', function() {
    // DOM 渲染完即可执行，此时图片、视频还可能没加载完
})
```

### 性能优化策略

::: tip **原则**

- 多使用内存、缓存或者其他方法
- 减少CPU计算量，减少网络加载耗时
- 使用于所有编程的性能优化--空间换时间

:::

#### 加载资源优化

- 减少资源体积
- 减少访问次数
- 使用更快的网络

1. 静态资源的压缩合并（webpack生成环境的压缩打包、雪碧图...）
2. 静态资源缓存（contentHash通过链接名称控制缓存，只有内容改变的时候链接名称才会改变）
3. 使用CDN让资源加载更快
4. 使用SSR后端渲染，数据直接输出到HTML中（SSR在vue、React的应用，php jsp asp都是后端渲染）

#### 渲染优化

- CSS放在head，JS放在body最下面
- 尽早执行操作（如DOMContentLoaded）
- 懒加载（图片懒加载，下拉加载更多）
- 减少DOM查询，对DOM查询做缓存
- 减少DOM操作，多个操作尽量合并在一起执行
- 事件的节流throttle、防抖debounce

```html
// 图片懒加载
<img id="img1" src="preview.png" data-realsrc="abc.png"/>
<script type="text/javascript">
    var img1 = document.getElementById("img1")
    img1.src = img1.getAttribute("data-realsrc")	
</script>
```

```js
// 缓存dom查询
for(let i=0; i<document.getElementByTagName('p').length; i++) {
    ...
}

var pList = document.getElementByTagName('p')
for(let i=0; i<pList.length; i++){
	...    
}
    
// 合并DOM插入
var list = document.getElementById("list")

var frag = document.createDocumentFragment();
for(let i=0; i<10; i++) {
    let li = document.crateElement("li")
    li.innerHTML = "List item "+i
    frag.appendChild(li)
}
    
list.appendChild(frag)
    
// 简单事件节流
var textarea = document.getElementById("text")
var timer
textarea.addEventListener("keyup",function() {
    if(timer) {
        clearTimeout(timer)
    }
    timer = setTimeout(function() {
        // 触发change事件
    },200)
})
```

