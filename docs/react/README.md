# React

## this

### 官方

```js
class Toggle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {isToggleOn: true};

    // 为了在回调中使用 `this`，这个绑定是必不可少的
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState(state => ({
      isToggleOn: !state.isToggleOn
    }));
  }

  render() {
    return (
      <button onClick={this.handleClick}>
        {this.state.isToggleOn ? 'ON' : 'OFF'}
      </button>
    );
  }
}

ReactDOM.render(
  <Toggle />,
  document.getElementById('root')
);
```

你必须谨慎对待 JSX 回调函数中的 `this`，在 JavaScript 中，class 的方法默认不会绑定 `this`。如果你忘记绑定 `this.handleClick` 并把它传入了 `onClick`，当你调用这个函数的时候 `this` 的值为 `undefined`。

这并不是 React 特有的行为；这其实与 JavaScript 函数工作原理有关。通常情况下，如果你没有在方法后面添加 `()`，例如 `onClick={this.handleClick}`，你应该为这个方法绑定 `this`。

### 理解

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <script>
      function handleClick() {
        console.log(this);   // window
      }
    </script>
  </head>
  <body>
    <button onclick="handleClick()">按钮</button>
  </body>
</html>
```

::: tip this

​	JSX语法中的this指向当前组件

:::

- JSX中的this执行当前Reack组件,所以onClick = { this.handleClick }可以拿到当前组件的函数

- class定义中，当定义React组件时，`extends React.Component`时，不会将`this`继承下来。所以handClick函数中如果使用`this`是`undefined`。 以下两种方式可以指定`this`:
  1. `this.handleClick = this.handleClick.bind(this)` ，推荐这种在构造函数绑定的方式
  2. ` <button onClick={this.handleClick.bind(this)}></button>`

- ES6中的arrow function，默认在定义的时候会绑定`this`, 指向了当前事件触发的上下文

  `<div onScroll={ ()=> {this.scroll() } } className="field-wrap"></div>`

## 基础

### PWA

::: tip progressive web application

在https协议的服务器上，在用户二次访问网页的，即使是断网也能够访问，serviceWorker能够缓存网页

:::

::: tip mainfest.json

如果配置了pwa设置，那么便可以把网页创建一个桌面快捷方式进行访问

:::

icons src设置了桌面快捷图标的icon

```json
{
  "short_name": "React App",
  "name": "Create React App Sample",
  "icons": [
    {
      "src": "favicon.ico",
      "sizes": "64x64 32x32 24x24 16x16",
      "type": "image/x-icon"
    },
    {
      "src": "logo192.png",
      "type": "image/png",
      "sizes": "192x192"
    },
    {
      "src": "logo512.png",
      "type": "image/png",
      "sizes": "512x512"
    }
  ],
  "start_url": ".",
  "display": "standalone",
  "theme_color": "#000000",
  "background_color": "#ffffff"
}
```

### class component

render函数返回JSX

```js
import React, { Component } from 'react';

class App extends Component {
  render() {
    return (
      <div>
        hello world..
      </div>
    )
  }
}
export default App;
```

### ReactDOM.render

- ReactDOM的render方法能够实现将一个React组件挂载到DOM节点上
- ReactDOM展示组件内容的时候，`<App />`使用了JSX语法，必需引入React，才能进行编译

```js
import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';

ReactDOM.render(
  // JSX
  <App />,
  document.getElementById('root')
);
```

### JSX语法

- JSX语法直接写标签，不需要引号包裹 

  ```jsx
  render() {
      return <div>hello world..</div>
  }
  ```

- JSX语法中的标签不仅可以是**原生标签**，也可以使用**组件**，组件开头必需**大写字母**开头`<App />`，Fragment也是一个组件

  ```jsx
  import App from './App';  // 大写字母开头
  ReactDOM.render(<App />, document.getElementById('root'));
  ```


- JSX注释

  ```jsx
  {/* 开发模式下的注释，不会显示在页面上 */}
  ```

  ```jsx
  {
  	//单行注释要把花括号单独放一行
  }
  ```

- 引入和添加class, for等属性

  ::: tip 关键字

  ​	class使用className, for使用htmlFor

  :::

  ```js
  import './style.css'
  ```

  ```jsx
  <label htmlFor="insertArea">输入内容</label>
  <input
      id="insertArea"
      className="input"
      value={this.state.inputValue}
      onChange={this.handleInputChange.bind(this)}
  />
  ```

- innerHtml

  外层花括号表示JSX语法，内层花括号表示接受一个对象

  ```jsx
  <li
      key={index}
      onClick={this.handleItemDelete.bind(this, index)}
      dangerouslySetInnerHTML={{ __html: item }}
      >
  </li>
  ```

### immutable

::: tip immutable

​	react建议state不允许我们做任何的改变（直接改变会影响性能）

​	可以考虑拷贝一个副本, 然后操作赋值 [...this.state.list] ）

:::

```js
  handleItemDelete(index) {
    const list = [...this.state.list]  // 拷贝
    list.splice(index, 1)
    this.setState({
      list: list
    })
  }
```

### 拆分组件和组件传值

::: tip 组件

​	在constructor里面做this统一绑定，会比在jsx中绑定的性能好

​	父组件通过属性向子组件传值，子组件通过props接收

​	子组件通过属性获取父组件方法，调用向外传递事件（父组件在传递方法时, 要记得绑定父组件的this）

​	setState可以传递一个函数实现异步，并且带来性能提升，函数参数prevState(修改之前的state)

:::

```jsx
// TodoList.js
import React, { Component, Fragment } from 'react';
import './style.css'
import TodoItem from "./TodoItem"

class TodoList extends Component {

  constructor(props) {
    super(props)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleBtnClick = this.handleBtnClick.bind(this)
    this.handleItemDelete = this.handleItemDelete.bind(this)
    this.state = {
      inputValue: '',
      list: []
    }
  }

  render() {
    return (
      <Fragment>
        <div>
          <label htmlFor="insertArea">输入内容</label>
          <input
            id="insertArea"
            className="input"
            value={this.state.inputValue}
            onChange={this.handleInputChange}
          />
          <button onClick={this.handleBtnClick}>提交</button>
        </div>
        <ul>
          {this.getTodoItem()}
        </ul>
      </Fragment>
    )
  }

  getTodoItem() {
    return (
      this.state.list.map((item, index) => {
        return (
          <TodoItem
            content={item}
            key={index}
            index={index}
            deleteItem={this.handleItemDelete}
          />
        )
      })
    )
  }

  handleInputChange(e) {
    const value = e.target.value
    this.setState(() => ({
      inputValue: value
    }))
  }

  handleBtnClick() {
    if (this.state.inputValue.trim().length === 0) return
    this.setState((prevState) => ({
      list: [...prevState.list, prevState.inputValue],
      inputValue: ''
    }))
  }

  handleItemDelete(index) {
    this.setState((prevState) => {
      const list = [...prevState.list]
      list.splice(index, 1)
      return { list }
    })
  }
}

export default TodoList
```

```jsx
// TodoItem.js
import React, { Component } from 'react'

class TodoItem extends Component {
    constructor(props) {
        super(props)
        this.handleClick = this.handleClick.bind(this)
    }

    render() {
        const { content } = this.props
        return (
            <li onClick={this.handleClick}>{content}</li>
        )
    }

    handleClick() {
        const { deleteItem, index } = this.props
        deleteItem(index)
    }
}

export default TodoItem
```

### 总结

::: tip 思考

- 命名式开发: 直接操作dom（jQuery、原生），声名式开发: 面向数据编程（React）

- 可以与其它框架并存，React只影响其绑定的原生dom标签下的区域

- 组件化（React的组件首字母大写，属性传值，方法传递）

- 单向数据流，子组件不允许改变父组件的值（只读，当数据被多个子组件共用且允许被子组件改变数据时，会导致维护困难）
- 视图层框架（需要redux等其它辅助状态管理）
- 函数式编程（有利于单元测试）

:::

## 进阶

### PropTypes与DefaultProps

- 使用

  [PropTypes]: https://reactjs.org/docs/typechecking-with-proptypes.html

  实现**类型校验**(开发环境下的warning)

```js
import React, { Component } from 'react'
import PropTypes from 'prop-types'

class TodoItem extends Component {
    // ...
}

TodoItem.propTypes = {
    content: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    deleteItem: PropTypes.func
    index: PropTypes.number
}

export default TodoItem
```

isRequired实现必传`test: PropTypes.string.isRequired`

```shell
Warning: Failed prop type: The prop `test` is marked as required in `TodoItem`, but its value is `undefined`.
```

- 使用defaultProps**提供默认值**(例如在isRequired下)

```js
TodoItem.defaultProps = {
    test: "hello world"
}
```

### Props、State与render函数

- 当组件当中的Props或者State发生改变的时候，会触发render函数重新执行
- 当父组件的render函数被运行时，它的子组件的render都将被重新执行

### 什么是虚拟DOM

#### 方案1

1. state 数据
2. 模板 （render函数中返回的JSX）
3. 数据 + 模板 = 真实的DOM显示
4. state 发生改变
5. 数据 + 模板 = 真实的DOM，替换原始的DOM

::: warning 缺陷

- 第一次生成了一个完整的DOM片段
- 第二次生成了一个完整的DOM片段
- 第二次生成的DOM替换第一次的DOM，非常耗性能

:::

#### 方案2

1. state 数据
2. JSX 模板 
3. 数据 + 模板 结合，生成真实的DOM，来显示
4. state 发生改变
5. 数据 + 模板 结合，生成真实的DOM，并不直接替换原始的DOM
6. 新的DOM（DocumentFragment文档碎片）和原始的DOM做对比，找差异、
7. 找出input框发生了变化
8. 只用新的DOM中的input元素，替换掉老的DOM中的input元素

::: tip 结果 

- 只修改部分DOM元素节约了一部分性能
- 对比DOM的过程又损耗了一部分性能
- 性能提升并不明显

:::

#### 方案3

1. state 数据

2. JSX 模板 

3. 数据 + 模板 结合，生成真实的DOM，来显示

   `<div id='abc'><span>hello world</span></div>`

4. 生成虚拟DOM（虚拟DOM是一个数组结构的对象，用它开描述真实DOM）

   `['div',{id:'abc'},['span',{},'hello world']]`

5. state发生变化

6. 生成新的虚拟DOM

   `['div',{id:'abc'},['span',{},'bye bye']]`

7. 比较原始虚拟DOM和新的虚拟DOM的区别，找到区别是span中的内容

8. 直接操作DOM，改变span中的内容

::: tip 优化

- 第4步，生成虚拟DOM损耗了一些性能，但是生成JS对象的虚拟DOM与生成真实DOM的损耗相比是很小的（js创建js对象很简单，创建DOM的时候需要调用WebApplication级别的API的损耗就比较大）
- 第6步生成虚拟DOM对比方案2第5步生成DOM极大提升了性能
- 第7步比较JS对象，和真实DOM的对比也极大提升了性能

:::

### 虚拟DOM深入

- react的实现是在生成虚拟DOM后才生成真实DOM

- JSX => createElement => 虚拟DOM（JS对象） => 真实的DOM

  ```jsx
  render() {
  	return (
      	<div>item</div>
      )
      // return React.createElement('div', {}, 'item')
  }
  ```

1. state 数据

2. JSX 模板 

3. 生成虚拟DOM（虚拟DOM是一个数组结构的对象，用它开描述真实DOM）

   `['div',{id:'abc'},['span',{},'hello world']]`

4. 通过虚拟DOM来生成真实的DOM，来显示

   `<div id='abc'><span>hello world</span></div>`

5. state发生变化

6. 生成新的虚拟DOM

   `['div',{id:'abc'},['span',{},'bye bye']]`

7. 比较原始虚拟DOM和新的虚拟DOM的区别，找到区别是span中的内容

8. 直接操作DOM，改变span中的内容

::: tip 虚拟DOM的优点

- 性能提升

- 跨端应用得以实现。React Native

  DOM只存在于浏览器，虚拟DOM作为JS对象在原生应用和浏览器都可以复用

:::

### 虚拟DOM中的diff算法

比较虚拟DOM区别的算法（第7步）

- setState作为异步函数提供了多个state更新（很短间隔时间内）只执行一次setState，一次虚拟DOM的比对提升性能

  ![](../img/react/diff.png)

- 同级比较，两个虚拟DOM的比对首先是同级的比对，第一层、第二层......如果有一级不同则不再比较，直接替换后面的全部DOM。（虽然可能会造成DOM渲染的浪费，但是大大减少了两个虚拟DOM之间对比算法的性能损耗）

- 每个虚拟DOM节点的比较通过key值做关联（比较性能提升的前提，要保证前后虚拟DOM前后的key值一致，如果使用index作为key值就无法保证前后key值的一致，失去了key值存在的意义）

  ![](../img/react/key.png)

### React中ref的使用

#### DOM获取

（在React中除了e.target可以获取到DOM元素之外，ref也可以）

ref参数等于一个函数(箭头函数传递this)，如下我们构建了一个ref的引用（this.inopt），指向input这个节点

```jsx
<input
    id="insertArea"
    className="input"
    ref={(input)=>{this.input = input}}
    value={this.state.inputValue}
    onChange={this.handleInputChange}
    />
// this.input === <input id="insertArea" class="input" value>
```

#### setState异步问题

- ref与setState共同使用可能出现的问题，setState是异步函数不会立即执行

  ```jsx
  // jsx
      <ul ref={(ul) => { this.ul = ul }}>
          {this.getTodoItem()}
      </ul>
  
  // click event
        handleBtnClick() {
            if (this.state.inputValue.trim().length === 0) return
            this.setState((prevState) => ({
                list: [...prevState.list, prevState.inputValue],
                inputValue: ''
            }))
            console.log(this.ul.querySelectorAll('li').length)
        }
  ```

![](../img/react/ref.png)

- 如果希望在setState后获取到正确的DOM，setState接受第二个参数，是执行完的回调函数

  ```jsx
  handleBtnClick() {
      if (this.state.inputValue.trim().length === 0) return
      this.setState((prevState) => ({
          list: [...prevState.list, prevState.inputValue],
          inputValue: ''
      }), () => {
          console.log(this.ul.querySelectorAll('li').length)
      })
  }
  ```

  