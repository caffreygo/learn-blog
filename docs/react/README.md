# React

## this

### 官方

```react
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

