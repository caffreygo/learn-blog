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

