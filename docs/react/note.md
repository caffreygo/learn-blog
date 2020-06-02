# Note

## styled-components

::: tip styled-components

- 实现样式独享

- css在某个组件内引入之后，其它组件没有引入但是也会生效（样式全局化）
- 实现样式只在引入的组件内生效

::: 

### 全局样式

- createGlobalStyle实现全局样式导入
- 组件内引入该样式组件，放在需要渲染组件的最上方

```js
import { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`
    html, body, div, span, applet, object, iframe,
    h1, h2, h3, h4, h5, h6, p, blockquote, pre,
    a, abbr, acronym, address, big, cite, code,
    del, dfn, em, img, ins, kbd, q, s, samp,
    small, strike, strong, sub, sup, tt, var,
    b, u, i, center,
    dl, dt, dd, ol, ul, li,
    fieldset, form, label, legend,
    table, caption, tbody, tfoot, thead, tr, th, td,
    article, aside, canvas, details, embed, 
    figure, figcaption, footer, header, hgroup, 
    menu, nav, output, ruby, section, summary,
    time, mark, audio, video {
      margin: 0;
      padding: 0;
      border: 0;
      font-size: 100%;
      font: inherit;
      vertical-align: baseline;
    }
    /* HTML5 display-role reset for older browsers */
    article, aside, details, figcaption, figure, 
    footer, header, hgroup, menu, nav, section {
      display: block;
    }
    body {
      line-height: 1;
    }
    ol, ul {
      list-style: none;
    }
    blockquote, q {
      quotes: none;
    }
    blockquote:before, blockquote:after,
    q:before, q:after {
      content: '';
      content: none;
    }
    table {
      border-collapse: collapse;
      border-spacing: 0;
    }
`
```

```react
import React, { Fragment } from 'react';
import { GlobalStyle } from './style.js';

function App() {
  return (
    <Fragment>
      <GlobalStyle />
      <div className="red">
        hello world
      </div>
    </Fragment>

  );
}

export default App;
```

### 样式组件

1. 创建一个div组件带有样式

   ```js
   import styled from 'styled-components'
   
   export const HeaderWrapper = styled.div`
     height: 56px;
     background: red;
   `
   ```

2. 组件引入使用该组件

   ```react
   import React, { Component } from 'react';
   import { HeaderWrapper } from './style'
   
   class Header extends Component {
     render() {
       return (
         <HeaderWrapper>
           header
         </HeaderWrapper>
       )
     }
   }
   
   export default Header
   ```

### 包含图片组件

- 图片需要先引入然后再使用（相对路径先编译后当前路径是根路径会出错）
- hred这种属性可以直接在组件上写` <Logo href="/" />`，也可以在style的**attr**方法内添加

```js
import styled from 'styled-components'
import LogoPic from '../../statics/logo.png'

export const Logo = styled.a.attrs({
  href: '/'
})`
  position: absolute;
  top: 0;
  left: 0;
  display: block;
  height: 56px;
  width: 100px;
  background: url(${LogoPic});
  background-size: contain;
`
```

### Input组件

`&::placeholder`更改placeholder文字颜色

```js
export const NavSearch = styled.input.attrs({
  placeholder: '搜索'
})`
  width: 160px;
  height: 38px;
  border: none;
  outline: none;
  border-radius: 19px;
  margin-top: 9px;
  margin-left: 20px;
  padding: 0 20px;
  background-color: #eee;
  font-size: 15px;
  box-sizing: border-box;
  &::placeholder {
    color: #999;
  }
`
```

## iconfont的使用

- 在iconfont新建仓库，添加对应图标，下载至本地

- 在src/static下新建iconfont文件夹

  ```shell
  |-- iconfont
  |   |-- iconfont.css
  |   |-- iconfont.eot
  |   |-- iconfont.svg
  |   |-- iconfont.ttf
  |   |-- iconfont.woff
  |   |-- iconfont.woff2
  ```

- 修改iconfont.css中的引用路径为相对路径

- 修改iconfont.css为iconfont.js文件，使用`createGlobalStyle`导出全局iconfont组件

  ```js
  import { createGlobalStyle } from 'styled-components'
  
  export const IconFont = createGlobalStyle`
  @font-face {
    font-family: 'iconfont';
    src: url('./iconfont.eot?t=1591025542556'); /* IE9 */
    src: url('.l/iconfont.eot?t=1591025542556#iefix') format('embedded-opentype'),
      /* IE6-IE8 */
        url('data:application/x-font-woff2;charset=utf-8;base64,d09GMgABAAAAAAP8AAsAAAAACBQAAAOuAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHEIGVgCDHAqDUIMmATYCJAMQCwoABCAFhG0HRxsXB1GUzM0e2cdhHEMuSywmU5QSWtz4ard4+BpL39/9d9kQKlBMksdHRVKBjaiNapWrkBWqwtQC61beZJsVyirsqefM6JoaEmhqMJBztdeanNpL9KV/3Dv9fyc4n2W5jDVpbarzqAswmkABjb3ICihAjLlh7MqLWE9gwLxxqMvE9HzgIRndAvEGKzzwSJllTWZoQrdkbIr3XLXyUGoB8M7/fPwBvuFB0amMvlfPEiQQ/b37x0a/7c1W7iIk4znBJlGxAUjiRan7ETqMbaANKN9xcQRomsL37h+OPrb//6F0L+pm/uURikp0GelD4ACp6olJbB7B90AehR8eGjeJp7bBxAPgEyZnH1WkMuPl0aZZznOKfCv9kGpvL2xtzW9rK1j2MAptWHZsztSHD4uSwoK7tLd3Ygq98hkbW1K6cSCzvXcxf41dBgATzG1maT01p6hojj84vOD8YTD7CLvsHkXZCgovp9tIOHq97uFx29t65BdteBi2y+wZz/lBIWbci9qv5WHUxleWpQf7Pf0x8vzXsGr3jh0rRqlRpnX37q2rpsAVOvOuvXd/XYnSRrd17Lilr1/fALO8/kfP/3BqPlBU6DLNL7HQE8BfBm7LSU2j4ptQx/9CXLs1MqvAFCvgyIf5O9IgD4LNlOsZp44uxB0q2LTo0Hc3RaSmT4/ffYd/Gz4QfNozXjoq45NrnwUhjkppwLoIMnHG0HNJi0+t5dJPlYwrqY47fb0D9d91Cli1veHOojh0fPvvFGr7QWxGKZi6UlUpxGB6+OsvXXPpWqH7vLUDfZ7QAPTu1Nt0jI/+RwHaoA3+re3kcd63qk7hvzzY6yr6/Dt6IfL27iToJ/k3ktaSnyhpmZOqzLBkynJbrHnScaKbggED+HUpJrwYQzvdOp3QTMdQ9JmDqllAk9yAjkEH0NWcwIB1SZMHTdLRIvuxZgGAMOYUFCM+QjWmDk3yOXTM+ARdY0HDgOvoNuegpcBMnI54giQoTIFYVJ2yZSNMkJmLlAl2Xk/KfGYh0g0chD6cdzaZhJxIH2OAMVHxJUSGsq46YCLYDNntKtR01YpEwlkI0ULNZrnsRZyoOgDjgg7hEYgEEkwBYSKVk+wWJpjc+3MhignseHpNVoW/EKIz4NohHxzvFmiS2tkq61ouMUyk8EUQMkimUzlAicCJ2M2YCtLKW1khIoJj6RHRhDKjfHJbNTe/1vGEq2CAMU9GiRoZHQPPeKci8VbsDjfF8Gw2chpTJjh4VcAAAAAA')
        format('woff2'),
      url('./iconfont.woff?t=1591025542556') format('woff'),
      url('./iconfont.ttf?t=1591025542556') format('truetype'),
      /* chrome, firefox, opera, Safari, Android, iOS 4.2+ */
        url('./iconfont.svg?t=1591025542556#iconfont') format('svg'); /* iOS 4.1- */
  }
  
  .iconfont {
    font-family: 'iconfont' !important;
    font-size: 16px;
    font-style: normal;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  .iconfangdajing:before {
    content: '\e614';
  }
  
  .iconAa:before {
    content: '\e636';
  }
  
  .iconPensyumaobi:before {
    content: '\e708';
  }
  `
  ```

- App.js使用IconFont组件

  ```js
  import React, { Fragment } from 'react';
  import Header from './common/header'
  import { GlobalStyle } from './style.js';
  import { IconFont } from './statics/iconfont/iconfont.js'
  
  function App() {
    return (
      <Fragment>
        <GlobalStyle />
        <IconFont />
        <Header />
      </Fragment>
  
    );
  }
  
  export default App;
  ```

## 输入框动画

- 定义事件onFocus、onBlur

  ```js
  handleInpusFocus() {
      this.setState({
          focused: true
      })
  }
  
  handleInpusBlur() {
      this.setState({
          focused: false
      })
  }
  ```

- 引入CSSTransition，设置`classNames`属性

  ```html
  <CSSTransition timeout={200} in={this.state.focused} classNames="slide">
      <NavSearch onFocus={this.handleInpusFocus} onBlur={this.handleInpusBlur} 				className={this.state.focused ? 'focused' : ''}
      ></NavSearch>
  </CSSTransition>
  ```

- 添加动画样式slide-enter、slide-enter-active、slide-exit、slide-exit-active

  ```js
  export const SearchWrapper = styled.div`
    float: left;
    position: relative;
    .slide-enter {
      width: 160px;
      transition: all .3s ease-out;
    }
    .slide-enter-active {
      width: 240px;
    }
    .slide-exit {
      transition: all .3s ease-out;
    }
    .slide-exit-active {
      width: 160px;
    }
    .iconfont {
      position: absolute;
      right: 5px;
      bottom: 5px;
      width: 30px;
      height: 30px;
      border-radius: 15px;
      line-height: 30px;
      text-align: center;
      &.focused {
        background-color: #777;
        color: #fff;
      }
    }
  `
  ```


## redux && react-redux

- 定义store/index.js

  ```js
  import { createStore } from 'redux';
  import reducer from './reducer'
  
  const store = createStore(reducer);
  
  export default store;
  ```

- store/reducer.js

  ```js
  const defaultState = {
    focused: false
  }
  
  export default (state = defaultState, action) => {
    if (action.type === 'search_focus') {
      return {
        focused: true
      }
    }
    if (action.type === 'search_blur') {
      return {
        focused: false
      }
    }
    return state
  }
  ```

- App.js引入store和Provider组件

  ```js
  import React, { Fragment } from 'react';
  import Header from './common/header';
  import store from './store';
  import { Provider } from 'react-redux';
  import { GlobalStyle } from './style.js';
  import { IconFont } from './statics/iconfont/iconfont.js'
  
  function App() {
    return (
      <Fragment>
        <GlobalStyle />
        <IconFont />
        <Provider store={store}>
          <Header />
        </Provider>
      </Fragment>
  
    );
  }
  
  export default App;
  ```

- 对应组件引入connect

  ```react
  import React from 'react';
  import { connect } from 'react-redux';
  
  const Header = (props) => {
    return (
  	......
    )
  }
  
  const mapStateToProps = (state) => {
    return {
      focused: state.focused
    }
  }
  
  const mapDispatchToProps = (dispatch) => {
    return {
    }
  }
  
  export default connect(mapStateToProps, mapDispatchToProps)(Header);
  ```

## redux-devtools-extension

https://github.com/zalmoxisus/redux-devtools-extension

```js
import { createStore, compose } from 'redux';
import reducer from './reducer'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  reducer,
  composeEnhancers()
);

export default store;
```

## reducer拆分

reducer如果存放过多的数据可能会造成代码的不可维护，reducer的拆分和整合

### 拆分

- common/header/store/reducer.js

```js
const defaultState = {
  focused: false
}

export default (state = defaultState, action) => {
  if (action.type === 'search_focus') {
    return {
      focused: true
    }
  }
  if (action.type === 'search_blur') {
    return {
      focused: false
    }
  }
  return state
}
```

- common/header/store/index.js导出

```js
import reducer from './reducer'

export { reducer }
```

### 整合

- store/reducer.js     `combineReducers`方法整合reducer
- as是es6实现的别名

```js
import { combineReducers } from 'redux';
import { reducer as headerReducer } from '../common/header/store';

const reducer = combineReducers({
  header: headerReducer
})

export default reducer
```

- 组件内state路径修改

```js
const mapStateToProps = (state) => {
  return {
    // 整合后的focused在state的header下
    focused: state.header.focused
  }
}
```

## actionCreators

```
|-- header
|   |-- store
|   |   |-- actionCreators.js
|   |   |-- constants.js
|   |   |-- index.js
|   |   |-- reducer.js
|   |-- index.js
|   |-- style.js
```

- actionCreators创建action

  ```js
  import * as constants from './constants'
  
  export const searchFocus = () => ({
    type: constants.SEARCH_FOCUS
  })
  
  export const searchBlur = () => ({
    type: constants.SEARCH_BLUR
  })
  ```

- constants统一定义action types

  ```js
  export const SEARCH_FOCUS = 'header/SEARCH_FOCUS';
  export const SEARCH_BLUR = 'header/SEARCH_BLUR';
  ```

- store/index统一导出

  ```js
  import reducer from './reducer';
  import * as actionCreators from './actionCreators';
  import * as constants from './constants';
  
  export { reducer, actionCreators, constants }
  ```

- reducer

  ```js
  import * as constants from './constants'
  
  const defaultState = {
    focused: false
  }
  
  export default (state = defaultState, action) => {
    if (action.type === constants.SEARCH_FOCUS) {
      return {
        focused: true
      }
    }
    if (action.type === constants.SEARCH_BLUR) {
      return {
        focused: false
      }
    }
    return state
  }
  ```

- header/index.js使用actionCreators创建action

  ```js
  import { actionCreators } from './store';
  
  ......
  
  const mapDispatchToProps = (dispatch) => {
    return {
      handleInpusFocus() {
        dispatch(actionCreators.searchFocus())
      },
      handleInpusBlur() {
        dispatch(actionCreators.searchBlur())
      }
    }
  }
  ```

  

