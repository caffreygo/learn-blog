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



::: tip 思考

- 命名式开发: 直接操作dom（jQuery、原生），声名式开发: 面向数据编程（React）

- 可以与其它框架并存，React只影响其绑定的原生dom标签下的区域

- 组件化（React的组件首字母大写，属性传值，方法传递）

- 单向数据流，子组件不允许改变父组件的值（只读，当数据被多个子组件共用且允许被子组件改变数据时，会导致维护困难）
- 视图层框架（需要redux等其它辅助状态管理）
- 函数式编程（有利于单元测试）

:::