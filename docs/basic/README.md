# 笔记

## Vue

### Dom元素获取



::: tip 绑定: 通过ref="selector"绑定元素

1. 如果元素是一个原生的**HTML元素**，通过this.$refs['selector'].click() 触发。
2. 如果元素是一个**组件**，通过绑定ref="selector"。需要通过this.$refs['selector'].$el.click() 触发。

:::

### $nextTick()

​		数据的改变并不会马上触发DOM的更新，此时组件不会立即渲染，要想在DOM更新后操作（例如获取新的DOM内的数据`innerHTML`，需要使用`$nextTick()`的回调函数, 在下一个的数据改变的事件队列内中获取。

​		在`created`周期函数中的DOM操作也是如此，而在`mounted`中则没有问题。

## Vue 3.0

### 项目升级

```sh
vue add vue-next
```

下载新版本vue的依赖，同时将项目代码的语法进行升级

```json
"vue-router": "^4.0.0-alpha.6",
"vuex": "^4.0.0-alpha.1"
```

- template模板内不能再使用this

  ```html
  <!-- <div class="banner-tittle">{{this.sightName}}</div> -->
  <div class="banner-tittle">{{sightName}}</div>
  ```

- ref元素获取

  ```js
  // this.$refs['A'][0].offsetTop 
  this.$refs['A'].offsetTop
  ```

### ref / reactive

模板上使用的数据需要转化成**响应式**并**返回**

1. 对象(**深度reactive**)

   通过`reactive`方法实现数据的响应式，在`setup`返回

   ```js
   import { reactive } from 'vue';
   
   export default {
       // ...
       setup() {
           const data = reactive({
               lastCity: '',
           });
           return {
               data
           };
       }
   }
   ```

2. 变量`ref()`

   通过ref实现响应式的数据赋值需要通过**value**属性，使用时也需要value属性，但是vue在编译**模板**的时候会自己实现

   ```js
   const iconList = ref([]);
   
   // iconList.value = result
   ```

### Props

```js
export default {
    // setup接收props,context参数，直接使用即可
    setup(props) {
	
    }
}
```

- 注意: setup函数传递的props是响应式数据，但是结构之后就不是了

  ```js
  export default {
      setup({list}) {
  		// 不要在setup参数做结构
      }
  }
  ```

### store/computed

1. `usestore()`方法使用store
2. `computed()`实现计算属性
3. `store.commit(mutation, data)`

```js
import { computed } from 'vue';
import { useStore } from 'vuex';

export default {
    // ...
    setup() {
        const store = useStore();
        const city = computed(() => {
            return store.state.city;
        });
        return {
            city
        };
    }
}
```

### watch

watch第二个参数是`callback(value, prevValue)`

```js
import { watch } from 'vue'

export default {
    setup(props) {
        // 函数式返回props.letter能够实现自动将letter实现reactive/ref
        watch(() => props.letter, (letter, prevLetter) => {
            if (letter && scroll) {
                const element = elems.value[letter]
                scroll.scrollToElement(element)
            }
        })
    }
}
```

```js
watch(keyword, (keyword, prevKeyword) => {
    if (timer) {
        clearTimeout(timer)
        timer = null
    }
    // 这边的keyword是watch传递进来的具体的值，不需要加value属性
    if (!keyword) {
        // ref数据赋值  ~.value = ~
        list.value = []
        return
    }
    timer = setTimeout(() => {
        const result = []
        for (let i in props.cities) {
            props.cities[i].forEach((value) => {
                if (value.spell.indexOf(keyword)>-1 || value.name.indexOf(keyword)>-1) {
                    result.push(value)
                }
            })
        }
        list.value = result
    }, 100)
})
```



### Methods

函数方法直接在`setup() { ... }`内定义，没有this关键字

### 生命周期

destroyed生命周期现在变成了**onUnmounted**

```js
import { onMounted } from 'vue

export default {
    // ...
    setup() {
        onMounted(() =>{
            // getHomeInfo()
        })
    }
}
```

### 逻辑统一管理

1. 将不同功能的数据逻辑代码放在函数中统一定义和方法操作
2. 在`setup`函数中使用返回

```vue
<script>
import { reactive, ref, onMounted } from 'vue'
import axios from 'axios'

export default {
  name: 'City',
  setup() {
    const { letter, handleLetterChange } = useLetterLogic()
    const { data } = useCityLogic()
    return { data, letter, handleLetterChange }
  }
}

function useCityLogic() {
  const data = reactive({
    cities: {},
    hotCities: [],
  })
  async function getCityInfo() {
    let res = await axios.get('/api/city.json')
    res = res.data
    if (res.ret && res.data) {
      const result = res.data
      data.cities = result.cities
      data.hotCities = result.hotCities
    }
  }
  onMounted(() => { getCityInfo() })
  return { data }
}

function useLetterLogic() {
  const letter = ref('')
  function handleLetterChange(selected) {
    letter.value = selected
  }
  return { letter, handleLetterChange }
}

</script>
```

### refs元素绑定

#### 单个元素

```html
<template>
    <div class="list" ref="wrapper">
</template>
```

```js
import { ref } from 'vue'
setup(props) {
    // vue会自动将wrapper和模板中的ref元素绑定,使用：wrapper.value  (即this.$refs['wrapper'])
    const wrapper = ref(null)
    return { wrapper }
}
```

#### 循环refs

- 模板绑定`:ref="elem => elems[item] = elem"`
- 数据定义elems：`const elems = ref([])`
- value使用`startY = elems.value['A'].offsetTop`

```vue
<template>
  <ul class="list">
    <li
      v-for="item of letters"
      :key="item"
      :ref="elem => elems[item] = elem"
    >
      {{item}}
    </li>
  </ul>
</template>

<script>
import { computed, onUpdated, ref } from 'vue'
export default {
  name: 'CityAlphabet',
  props: {
    cities: Object
  },
  setup(props, context) {
    let touchStatus = false
    let startY = 0
    let timer = null
    const elems = ref([])

    const letters = computed(() => {
      const letters = []
      for (let i in props.cities) {
        letters.push(i)
      }
      return letters
    })

    onUpdated(() => {
      startY = elems.value['A'].offsetTop
    })

    function handleLetterClick(e) {
      context.emit('change', e.target.innerText)
    }

    return { elems, letters, handleLetterClick }
  }
}
</script>
```

### emit

- `setup(props, context)`
- `context.emit('change', data)`

### router

```js
import { useRouter } from 'vue-router'

export default {
  setup(props) {
    const router = useRouter()
    // router.push('/')
  }
}
```

### async swait

```js
async function getHomeInfo() {
    let res = await axios.get('/api/index.json?city=' + city);
    res = res.data
}
```

## jQuery

### 根据元素css状态获取元素

- :selected

```html
<select id="reserve-membershipSize" class="listSelect" name="">
    <option value="未选择">-- 请选择贵司的会员数据库规模-- </option>
    <option value="2万人以内">2万人以内</option>
    <option value="2万~10万人">2万~10万人</option>
    <option value="10万人以上">10万人以上</option>
</select>
```

```js
$("#reserve-membershipSize option:selected").val();
```

- :checked

```html
<input type="checkbox" value="全域数据互通">
<input type="checkbox" value="数据深度洞察">
```

```js
 $('input:checkbox').each(function() { 
     if ($(this).is(':checked') ==true) { 
         interestedService.push($(this).val())
     } 
 })
```

**is(':checked')对应于原生js的matches**

### 根据属性操作元素

```js
$("#j-reserve div[data-name='reserve-tip']").show();
```

## form原生校验

### 简单校验

form标签下的表单元素，设置required实现**必填**校验

```html
<form id="subscribe-form">
    <button type="submit">订阅</button>
    <input type="email" id="subscribe-email" required="" placeholder="请输入您的邮箱">
</form>
```

邮件必填校验

```html
<input id="reserve-email" type="email" required="">
```

### submit事件

```js
$(document).ready(function(){
    $("#subscribe-form").submit(function(e){
        // 没有action属性，阻止默认提交事件
        e.preventDefault();
        var email = $("#subscribe-email").val();
    })
})
```

## React

### JSX

::: tip 

因为 JSX 语法上更接近 JavaScript 而不是 HTML，所以 React DOM 使用 `camelCase`（小驼峰命名）来定义属性的名称，而不使用 HTML 属性名称的命名约定。

例如，JSX 里的 `class` 变成了 [`className`](https://developer.mozilla.org/en-US/docs/Web/API/Element/className)，而 `tabindex` 则变为 [`tabIndex`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/tabIndex)。

:::

Babel 会把 JSX 转译成一个名为 `React.createElement()` 函数调用。

以下两种示例代码完全等效：

```js
const element = (
  <h1 className="greeting">
    Hello, world!
  </h1>
);
const element1 = React.createElement(
  'h1',
  {className: 'greeting'},
  'Hello, world!'
);
```

`React.createElement()` 会预先执行一些检查，以帮助你编写无错代码，但实际上它创建了一个这样的对象：

```js
// 注意：这是简化过的结构
const element = {
  type: 'h1',
  props: {
    className: 'greeting',
    children: 'Hello, world!'
  }
};
```

这些对象被称为 “React 元素”。它们描述了你希望在屏幕上看到的内容。React 通过读取这些对象，然后使用它们来构建 DOM 以及保持随时更新。

### 元素渲染

`ReactDOM.render`

```js
const element = <h1>Hello, world</h1>;
ReactDOM.render(element, document.getElementById('root'));
```

### 组件

#### 函数组件、class组件

```js
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}

class Welcome1 extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```

#### 渲染组件

```js
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}

const element = <Welcome name="Sara" />;
ReactDOM.render(
  element,
  document.getElementById('root')
);
```

- **注意：** 组件名称必须以大写字母开头。

  React 会将以小写字母开头的组件视为原生 DOM 标签。例如，`` 代表 HTML 的 div 标签，而 `` 则代表一个组件，并且需在作用域内使用 `Welcome`。

### state、生命周期

官网实现更新时间的时间显示器：

```js
// ReactDom.render(JSX, rootElement)

class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }

  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
    this.setState({
      date: new Date()
    });
  }

  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}

ReactDOM.render(
  <Clock />,
  document.getElementById('root')
);
```

- 修改state:

```js
// Wrong
this.state.comment = 'Hello';

// Correct
this.setState({comment: 'Hello'});
```

## vue-cli 4

### 设置路径别名

```js
 // vue.config.js
 chainWebpack: config => {
    config.resolve.alias
      .set('@', resolve('./src'))
      .set('@c', resolve('./src/components'))
      .set('img', resolve('./src/common/images'))
  },
```

### 设置页面title

```js
 // vue.config.js
 chainWebpack: config => {
      config.plugin('html').tap(args => {
        args[0].title = 'OA';
        return args;
      });
  },
```

### 引入scss

安装**node-sas**s和**sass-loader**

#### scss全局变量

1. 安装**style-resources-loader**

2. 设置**vue.config.js**文件

   ```js
     pluginOptions: {
       'style-resources-loader': {
         preProcessor: 'scss',
         patterns: ['./src/common/style/variable.scss']
       }
     }
   ```

### 引入vuex

1. 命令行输入 `vue add vuex`

2. 模块化状态管理

   ```js
   // store/index.js
   import Vue from 'vue'
   import Vuex from 'vuex'
   import account from './account'
   Vue.use(Vuex)
   
   export default new Vuex.Store({
     modules: {
       account
     }
   })
   ```

   ```js
   // store/account.js
   const state = {
     token: localStorage.getItem('token') ? localStorage.getItem('token') : ''
   }
   
   const getters = {
     token: state => {
       return state.token
     }
   }
   
   const mutations = {
     setToken(state, token) {
       state.token = token
       localStorage.setItem('token', token);
     }
   }
   
   export default {
     namespaced: true,
     state,
     getters,
     mutations
   }
   ```

3. 使用

   ```js
   import { mapGetters, mapMutations } from 'vuex';
   
     computed: {
       ...mapGetters('account', ['token']);    // this.token获取
     },
     methods: {
       // 获取store内namespace为account下的setToken这个mutations方法
       ...mapMutations('account', ['setToken'])      // this.setToken(token)调用
     }
   ```

### 引入Axios

#### 引入和基本校验配置

`vue add axios`

```js
// plugins/axios.js
"use strict";

import Vue from 'vue';
import axios from "axios";
import router from '../router';

let config = {
  baseURL: 'http://oa.jinrui.kooboo.site/api',
  timeout: 60 * 1000,
  withCredentials: true,
};

const _axios = axios.create(config);

_axios.interceptors.request.use(
  function (config) {
    // 为请求带上token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = token;
    }
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
_axios.interceptors.response.use(
  function (response) {
    // 响应失败且isLogin===false跳转到登录页
    if (!response.data.success) {
      const isServerLogin = response.data.isLogin
      if (!isServerLogin && router.history.current.path !== '/login') {
        router.push('/login')
      }
    }

    return response;
  },
  function (error) {
    // Do something with response error
    return Promise.reject(error);
  }
);

// Plugin.install = function(Vue, options) {
Plugin.install = function (Vue) {
  Vue.axios = _axios;
  window.axios = _axios;
  Object.defineProperties(Vue.prototype, {
    axios: {
      get() {
        return _axios;
      }
    },
    $axios: {
      get() {
        return _axios;
      }
    },
  });
};

Vue.use(Plugin)

export default Plugin;
```

#### 使用

```js
this.axios
	.post('/login', data).then(res => {
		if (res.data.success) {
        	this.$message.success(this.$t('login.successTips'));
            let token = res.data.token;
            if (token) {
            	this.setToken(res.data.token);
            }
        	this.$router.push({ path: '/home' });
    	} else {
        	this.$message.error(this.$t('login.failedTips'));
        }
     }).catch(err => {console.log(err);});
```

### 引入i18n

`vue add i18n`自动生成配置文件

```js
// pungins/i18n.js
import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

function loadLocaleMessages () {
  const locales = require.context('@/locales', true, /[A-Za-z0-9-_,\s]+\.json$/i)
  const messages = {}
  locales.keys().forEach(key => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i)
    if (matched && matched.length > 1) {
      const locale = matched[1]
      messages[locale] = locales(key)
    }
  })
  return messages
}

export default new VueI18n({
  locale: process.env.VUE_APP_I18N_LOCALE || 'zh',
  fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || 'zh',
  messages: loadLocaleMessages()
})


// this.$i18n.locale = 'en'可以显示获取和设置，或者通过浏览器cookie自动设置
```

### 引入vue router

`npm install vue-router` || 初始化时选择安装

```js
import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)  // 在vue中注入Router
import Login from '@c/login/Login'
import HomePage from '@c/main/HomePage'


const routes = [
    {
        path: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        name: 'login',
        component: Login
    },
    {
        path: '/date',
        name: '/date',
        component: HomePage,
        meta: {
            requireAuth: true
        }
    }
]


// 将路径注入到Router中
var router = new Router({
    'mode': 'history',
    routes
})

const isLogin = () => Boolean(localStorage.getItem('token') || sessionStorage.getItem('token'))
router.beforeEach((to, from, next) => {
    // matched   date及其子页面requireAuth: true
    if (to.matched.some(item => item.meta.requireAuth)) {
        if (!isLogin()) {
            next({
                path: '/',
                replace: true
            })
        } else {
            next()
        }
    } else {
        next()
    }
})
// 导出路由
export default router;
```

### 打包优化

安装`vue add webpack-bundle-analyzer`可以发现直接install的ElementUI占具了过大的体积，vender-chunk太大导致spa页面首屏加载缓慢

#### CDN引入ElementUI

- 删除main.js文件内Vue.use(ElementUI)

```js
// main.js
import Vue from 'vue'
import router from './router'
import store from './store'
import './plugins/axios'
import ELEMENT from 'element-ui';
import App from './App.vue'
import i18n from './plugins/i18n'

Vue.use(ELEMENT);
Vue.config.productionTip = false

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
```

- CDN引入Vue和ElemntUI的资源, 通过打包环境判断引入的是压缩版还是开发版的vue

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width,initial-scale=1.0">
    <link rel="icon" href="<%= BASE_URL %>favicon.ico">
    <title><%= htmlWebpackPlugin.options.title %></title>
    <link rel="stylesheet" href="https://unpkg.com/element-ui@2.13.0/lib/theme-chalk/index.css"></link>
  </head>
  <body>
    <noscript>
      <strong>We're sorry but <%= htmlWebpackPlugin.options.title %> doesn't work properly without JavaScript enabled. Please enable it to continue.</strong>
    </noscript>
    <div id="app"></div>
    <script src="https://unpkg.com/vue@2.6.11/dist/vue<%= process.env.NODE_ENV==='development'?'.js':'.min.js' %>"></script>
    <script src="https://unpkg.com/element-ui@2.13.0/lib/index.js"></script>
  </body>
</html>
```

- 修改`vue.config.js`,同时如果不希望生产模式下看到vue源码，不生产对应的map文件，可以设置productionSourceMap为false

```js
  configureWebpack: {
    externals: {
      'vue': 'Vue',
      'element-ui': 'ELEMENT'
    }
  },
  productionSourceMap: false,
```

#### 大组件按需引入

组件的按需引入能够让webpack打包时生成不同模块的JS文件，在使用时进行引入。注意不需要将组件都按需引入，这样会导致生成过多的chunk,太多的模块js请求反而得不偿失。

ES6的import,组件由一个函数返回，只有在使用时执行导入

```js
// 组件懒加载  vue组件内引用
const FullCalendar = ()=>import("./schedule/FullCalendar");
```

#### 路由懒加载

```js
// 路由懒加载  router  index.js
const Login = ()=>import("@c/login/Login")
const PageHeader = ()=>import("@c/PageHeader")
const ScheduleView = ()=>import("@c/ScheduleView")
```



## Promise

### Promise用法讲解

Promise是一个构造函数，自己身上有all、reject、resolve这几个眼熟的方法，原型上有then、catch等同样很眼熟的方法。那就new一个：

```js
var p = new Promise(function(resolve, reject){
    //做一些异步操作
    setTimeout(function(){
        console.log('执行完成');
        resolve('随便什么数据');
    }, 2000);
});
```

Promise的构造函数接收一个参数，是函数，并且传入两个参数：`resolve`，`reject`，分别表示异步操作执行成功后的回调函数和异步操作执行失败后的回调函数。其实这里用“成功”和“失败”来描述并不准确，按照标准来讲，resolve是将Promise的状态置为fullfiled，reject是将Promise的状态置为rejected。不过在我们开始阶段可以先这么理解，后面再细究概念。

在上面的代码中，我们执行了一个异步操作，也就是setTimeout，2秒后，输出“执行完成”，并且调用resolve方法。

运行代码，会在2秒后输出“执行完成”。注意！我只是new了一个对象，并没有调用它，我们传进去的函数就已经执行了，这是需要注意的一个细节。所以我们用Promise的时候一般是包在一个函数中，在需要的时候去运行这个函数，如：

```
function runAsync(){
    var p = new Promise(function(resolve, reject){
        //做一些异步操作
        setTimeout(function(){
            console.log('执行完成');
            resolve('随便什么数据');
        }, 2000);
    });
    return p;            
}
runAsync()
```

这时候你应该有两个疑问：1.包装这么一个函数有毛线用？2.resolve('随便什么数据');这是干毛的？

 

我们继续来讲。在我们包装好的函数最后，会return出Promise对象，也就是说，执行这个函数我们得到了一个Promise对象。还记得Promise对象上有then、catch方法吧？这就是强大之处了，看下面的代码：

```js
runAsync().then(function(data){
    console.log(data);
    //后面可以用传过来的数据做些其他操作
    //......
});
```

在runAsync()的返回上直接调用then方法，then接收一个参数，是函数，并且会拿到我们在runAsync中调用resolve时传的的参数。运行这段代码，会在2秒后输出“执行完成”，紧接着输出“随便什么数据”。

 

这时候你应该有所领悟了，原来then里面的函数就跟我们平时的回调函数一个意思，能够在runAsync这个异步任务执行完成之后被执行。这就是Promise的作用了，简单来讲，就是能把原来的回调写法分离出来，在异步操作执行完后，用链式调用的方式执行回调函数。

 

你可能会不屑一顾，那么牛逼轰轰的Promise就这点能耐？我把回调函数封装一下，给runAsync传进去不也一样吗，就像这样：

```js
function runAsync(callback){
    setTimeout(function(){
        console.log('执行完成');
        callback('随便什么数据');
    }, 2000);
}

runAsync(function(data){
    console.log(data);
});
```

效果也是一样的，还费劲用Promise干嘛。那么问题来了，有多层回调该怎么办？如果callback也是一个异步操作，而且执行完后也需要有相应的回调函数，该怎么办呢？总不能再定义一个callback2，然后给callback传进去吧。而Promise的优势在于，可以在then方法中继续写Promise对象并返回，然后继续调用then来进行回调操作。

 

#### **链式操作的用法**

所以，从表面上看，Promise只是能够简化层层回调的写法，而实质上，Promise的精髓是“状态”，用维护状态、传递状态的方式来使得回调函数能够及时调用，它比传递callback函数要简单、灵活的多。所以使用Promise的正确场景是这样的：

```
runAsync1()
.then(function(data){
    console.log(data);
    return runAsync2();
})
.then(function(data){
    console.log(data);
    return runAsync3();
})
.then(function(data){
    console.log(data);
});
```

这样能够按顺序，每隔两秒输出每个异步回调中的内容，在runAsync2中传给resolve的数据，能在接下来的then方法中拿到。运行结果如下：

```
异步任务1执行完成

随便什么数据1

异步任务2执行完成

随便什么数据2

异步任务3执行完成

随便什么数据3
```



猜猜runAsync1、runAsync2、runAsync3这三个函数都是如何定义的？没错，就是下面这样：

```js
function runAsync1(){
    var p = new Promise(function(resolve, reject){
        //做一些异步操作
        setTimeout(function(){
            console.log('异步任务1执行完成');
            resolve('随便什么数据1');
        }, 1000);
    });
    return p;            
}
function runAsync2(){
    var p = new Promise(function(resolve, reject){
        //做一些异步操作
        setTimeout(function(){
            console.log('异步任务2执行完成');
            resolve('随便什么数据2');
        }, 2000);
    });
    return p;            
}
function runAsync3(){
    var p = new Promise(function(resolve, reject){
        //做一些异步操作
        setTimeout(function(){
            console.log('异步任务3执行完成');
            resolve('随便什么数据3');
        }, 2000);
    });
    return p;            
}
```



在then方法中，你也可以直接return数据而不是Promise对象，在后面的then中就可以接收到数据了，比如我们把上面的代码修改成这样：

```
runAsync1()
.then(function(data){
    console.log(data);
    return runAsync2();
})
.then(function(data){
    console.log(data);
    return '直接返回数据';  //这里直接返回数据
})
.then(function(data){
    console.log(data);
});
```

```
那么输出就变成了这样：

异步任务1执行完成

随便什么数据1

异步任务2执行完成

随便什么数据2

直接返回数据
```

#### **reject的用法**

到这里，你应该对“Promise是什么玩意”有了最基本的了解。那么我们接着来看看ES6的Promise还有哪些功能。我们光用了resolve，还没用reject呢，它是做什么的呢？事实上，我们前面的例子都是只有“执行成功”的回调，还没有“失败”的情况，reject的作用就是把Promise的状态置为rejected，这样我们在then中就能捕捉到，然后执行“失败”情况的回调。看下面的代码。

```js
function getNumber(){
    var p = new Promise(function(resolve, reject){
        //做一些异步操作
        setTimeout(function(){
            var num = Math.ceil(Math.random()*10); //生成1-10的随机数
            if(num<=5){
                resolve(num);
            }
            else{
                reject('数字太大了');
            }
        }, 2000);
    });
    return p;            
}

getNumber()
.then(
    function(data){
        console.log('resolved');
        console.log(data);
    }, 
    function(reason, data){
        console.log('rejected');
        console.log(reason);
    }
);
```

getNumber函数用来异步获取一个数字，2秒后执行完成，如果数字小于等于5，我们认为是“成功”了，调用resolve修改Promise的状态。否则我们认为是“失败”了，调用reject并传递一个参数，作为失败的原因。

 

运行getNumber并且在then中传了两个参数，then方法可以接受两个参数，第一个对应resolve的回调，第二个对应reject的回调。所以我们能够分别拿到他们传过来的数据。多次运行这段代码，你会随机得到下面两种结果：

`resolved   1`    或者  `rejected 数字太大了`

#### **catch的用法**

我们知道Promise对象除了then方法，还有一个catch方法，它是做什么用的呢？其实它和then的第二个参数一样，用来指定reject的回调，用法是这样：

```js
getNumber()
.then(function(data){
    console.log('resolved');
    console.log(data);
})
.catch(function(reason){
    console.log('rejected');
    console.log(reason);
});
```

效果和写在then的第二个参数里面一样。不过它还有另外一个作用：在执行resolve的回调（也就是上面then中的第一个参数）时，如果抛出异常了（代码出错了），那么并不会报错卡死js，而是会进到这个catch方法中。请看下面的代码：

```js
getNumber()
.then(function(data){
    console.log('resolved');
    console.log(data);
    console.log(somedata); //此处的somedata未定义
})
.catch(function(reason){
    console.log('rejected');
    console.log(reason);
});
```

在resolve的回调中，我们console.log(somedata);而somedata这个变量是没有被定义的。如果我们不用Promise，代码运行到这里就直接在控制台报错了，不往下运行了。但是在这里，会得到这样的结果：

```
resolved

4

rejected

ReferenceError: somedata is not defined(...) 
```

也就是说进到catch方法里面去了，而且把错误原因传到了reason参数中。即便是有错误的代码也不会报错了，这与我们的try/catch语句有相同的功能。

#### **all的用法**

Promise的all方法提供了并行执行异步操作的能力，并且在所有异步操作执行完后才执行回调。我们仍旧使用上面定义好的runAsync1、runAsync2、runAsync3这三个函数，看下面的例子：

```js
Promise
.all([runAsync1(), runAsync2(), runAsync3()])
.then(function(results){
    console.log(results);
});
```



用Promise.all来执行，all接收一个数组参数，里面的值最终都算返回Promise对象。这样，三个异步操作的并行执行的，等到它们都执行完后才会进到then里面。那么，三个异步操作返回的数据哪里去了呢？都在then里面呢，all会把所有异步操作的结果放进一个数组中传给then，就是上面的results。所以上面代码的输出结果就是：

```
异步任务1执行完成

异步任务2执行完成

异步任务3执行完成

["随便什么数据1"，"随便什么数据2"，"随便什么数据3"]
```

 

有了all，你就可以并行执行多个异步操作，并且在一个回调中处理所有的返回数据，是不是很酷？有一个场景是很适合用这个的，一些游戏类的素材比较多的应用，打开网页时，预先加载需要用到的各种资源如图片、flash以及各种静态文件。所有的都加载完后，我们再进行页面的初始化。

 

#### **race的用法**

all方法的效果实际上是「谁跑的慢，以谁为准执行回调」，那么相对的就有另一个方法「谁跑的快，以谁为准执行回调」，这就是race方法，这个词本来就是赛跑的意思。race的用法与all一样，我们把上面runAsync1的延时改为1秒来看一下：

```js
Promise
.race([runAsync1(), runAsync2(), runAsync3()])
.then(function(results){
    console.log(results);
});
```



这三个异步操作同样是并行执行的。结果你应该可以猜到，1秒后runAsync1已经执行完了，此时then里面的就执行了。结果是这样的：

```
异步任务1执行完成

随便什么数据1

异步任务2执行完成

异步任务3执行完成
```

 

你猜对了吗？不完全，是吧。在then里面的回调开始执行时，runAsync2()和runAsync3()并没有停止，仍旧再执行。于是再过1秒后，输出了他们结束的标志。

 

这个race有什么用呢？使用场景还是很多的，比如我们可以用race给某个异步请求设置超时时间，并且在超时后执行相应的操作，代码如下：

```js
//请求某个图片资源
function requestImg(){
    var p = new Promise(function(resolve, reject){
        var img = new Image();
        img.onload = function(){
            resolve(img);
        }
        img.src = 'xxxxxx';
    });
    return p;
}

//延时函数，用于给请求计时
function timeout(){
    var p = new Promise(function(resolve, reject){
        setTimeout(function(){
            reject('图片请求超时');
        }, 5000);
    });
    return p;
}

Promise
.race([requestImg(), timeout()])
.then(function(results){
    console.log(results);
})
.catch(function(reason){
    console.log(reason);
});
```



requestImg函数会异步请求一张图片，我把地址写为"xxxxxx"，所以肯定是无法成功请求到的。timeout函数是一个延时5秒的异步操作。我们把这两个返回Promise对象的函数放进race，于是他俩就会赛跑，如果5秒之内图片请求成功了，那么遍进入then方法，执行正常的流程。如果5秒钟图片还未成功返回，那么timeout就跑赢了，则进入catch，报出“图片请求超时”的信息。

### 八段代码解析 Promise

#### 1.Promise的立即执行性

```javascript
var p = new Promise(function(resolve, reject){
  console.log("create a promise");
  resolve("success");
});

console.log("after new Promise");

p.then(function(value){
  console.log(value);
});
复制代码
```

控制台输出：

```javascript
"create a promise"
"after new Promise"
"success"
复制代码
```

Promise对象表示未来某个将要发生的事件，但在创建（new）Promise时，作为Promise参数传入的函数是会被立即执行的，只是其中执行的代码可以是异步代码。有些同学会认为，当Promise对象调用then方法时，Promise接收的函数才会执行，这是错误的。因此，代码中"create a promise"先于"after new Promise"输出。

#### 2.Promise 三种状态

```javascript
var p1 = new Promise(function(resolve,reject){
  resolve(1);
});
var p2 = new Promise(function(resolve,reject){
  setTimeout(function(){
    resolve(2);  
  }, 500);      
});
var p3 = new Promise(function(resolve,reject){
  setTimeout(function(){
    reject(3);  
  }, 500);      
});

console.log(p1);
console.log(p2);
console.log(p3);
setTimeout(function(){
  console.log(p2);
}, 1000);
setTimeout(function(){
  console.log(p3);
}, 1000);

p1.then(function(value){
  console.log(value);
});
p2.then(function(value){
  console.log(value);
});
p3.catch(function(err){
  console.log(err);
});
复制代码
```

控制台输出：

```javascript
Promise {[[PromiseStatus]]: "resolved", [[PromiseValue]]: 1}
Promise {[[PromiseStatus]]: "pending", [[PromiseValue]]: undefined}
Promise {[[PromiseStatus]]: "pending", [[PromiseValue]]: undefined}
1
2
3
Promise {[[PromiseStatus]]: "resolved", [[PromiseValue]]: 2}
Promise {[[PromiseStatus]]: "rejected", [[PromiseValue]]: 3}
复制代码
```

Promise的内部实现是一个状态机。Promise有三种状态：pending，resolved，rejected。当Promise刚创建完成时，处于pending状态；当Promise中的函数参数执行了resolve后，Promise由pending状态变成resolved状态；如果在Promise的函数参数中执行的不是resolve方法，而是reject方法，那么Promise会由pending状态变成rejected状态。

p2、p3刚创建完成时，控制台输出的这两台Promise都处于pending状态，但为什么p1是resolved状态呢？ 这是因为p1 的函数参数中执行的是一段同步代码，Promise刚创建完成，resolve方法就已经被调用了，因而紧跟着的输出显示p1是resolved状态。我们通过两个`setTimeout`函数，延迟1s后再次输出p2、p3的状态，此时p2、p3已经执行完成，状态分别变成resolved和rejected。

#### 3.Promise 状态的不可逆性

```javascript
var p1 = new Promise(function(resolve, reject){
  resolve("success1");
  resolve("success2");
});

var p2 = new Promise(function(resolve, reject){
  resolve("success");
  reject("reject");
});

p1.then(function(value){
  console.log(value);
});

p2.then(function(value){
  console.log(value);
});
复制代码
```

控制台输出：

```javascript
"success1"
"success"
复制代码
```

Promise状态的一旦变成resolved或rejected时，Promise的状态和值就固定下来了，不论你后续再怎么调用resolve或reject方法，都不能改变它的状态和值。因此，p1中`resolve("success2")`并不能将p1的值更改为`success2`，p2中`reject("reject")`也不能将p2的状态由resolved改变为rejected.

#### 4.链式调用

```javascript
var p = new Promise(function(resolve, reject){
  resolve(1);
});
p.then(function(value){               //第一个then
  console.log(value);
  return value*2;
}).then(function(value){              //第二个then
  console.log(value);
}).then(function(value){              //第三个then
  console.log(value);
  return Promise.resolve('resolve'); 
}).then(function(value){              //第四个then
  console.log(value);
  return Promise.reject('reject');
}).then(function(value){              //第五个then
  console.log('resolve: '+ value);
}, function(err){
  console.log('reject: ' + err);
})
复制代码
```

控制台输出：

```javascript
1
2
undefined
"resolve"
"reject: reject"
复制代码
```

Promise对象的then方法返回一个新的Promise对象，因此可以通过链式调用then方法。then方法接收两个函数作为参数，第一个参数是Promise执行成功时的回调，第二个参数是Promise执行失败时的回调。两个函数只会有一个被调用，函数的返回值将被用作创建then返回的Promise对象。这两个参数的返回值可以是以下三种情况中的一种：

- `return` 一个同步的值 ，或者 `undefined`（当没有返回一个有效值时，默认返回undefined），`then`方法将返回一个resolved状态的Promise对象，Promise对象的值就是这个返回值。
- `return` 另一个 Promise，`then`方法将根据这个Promise的状态和值创建一个新的Promise对象返回。
- `throw` 一个同步异常，`then`方法将返回一个rejected状态的Promise, 值是该异常。

根据以上分析，代码中第一个`then`会返回一个值为2（1*2），状态为resolved的Promise对象，于是第二个`then`输出的值是2。第二个`then`中没有返回值，因此将返回默认的undefined，于是在第三个`then`中输出undefined。第三个`then`和第四个`then`中分别返回一个状态是resolved的Promise和一个状态是rejected的Promise，依次由第四个`then`中成功的回调函数和第五个`then`中失败的回调函数处理。

#### 5.Promise then() 回调异步性

```javascript
var p = new Promise(function(resolve, reject){
  resolve("success");
});

p.then(function(value){
  console.log(value);
});

console.log("which one is called first ?");
复制代码
```

控制台输出：

```javascript
"which one is called first ?"
"success"
复制代码
```

Promise接收的函数参数是同步执行的，但`then`方法中的回调函数执行则是异步的，因此，"success"会在后面输出。

#### 6.Promise 中的异常

```javascript
var p1 = new Promise( function(resolve,reject){
  foo.bar();
  // 此时报错跳reject  下面resolve(1)不执行
  resolve( 1 );	  
});

p1.then(
  function(value){
    console.log('p1 then value: ' + value);   
  },
  function(err){
    console.log('p1 then err: ' + err);   // this way
  }
).then(
  function(value){
    console.log('p1 then then value: '+value);   // value无return则undefined
  },
  function(err){
    console.log('p1 then then err: ' + err);
  }
);

var p2 = new Promise(function(resolve,reject){
  resolve( 2 );	
});

p2.then(
  function(value){
    console.log('p2 then value: ' + value);  // this way
    foo.bar();   // reject
  }, 
  function(err){
    console.log('p2 then err: ' + err);
  }
).then(
  function(value){
    console.log('p2 then then value: ' + value);
  },
  function(err){
    console.log('p2 then then err: ' + err);   // this way     传递参数 1
    return 1;
  }
).then(
  function(value){
    console.log('p2 then then then value: ' + value);   // this way
  },
  function(err){
    console.log('p2 then then then err: ' + err);
  }
);

// 需要  return 参数  才能传递给下一个then的Promise对象
```

控制台输出：

```javascript
p1 then err: ReferenceError: foo is not defined
p2 then value: 2
p1 then then value: undefined
p2 then then err: ReferenceError: foo is not defined
p2 then then then value: 1
复制代码
```

Promise中的异常由`then`参数中第二个回调函数（Promise执行失败的回调）处理，异常信息将作为Promise的值。异常一旦得到处理，`then`返回的后续Promise对象将恢复正常，并会被Promise执行成功的回调函数处理。另外，需要注意p1、p2 多级`then`的回调函数是**交替执行**的 ，这正是由Promise `then`回调的异步性决定的。

#### 7.Promise.resolve()

```javascript
var p1 = Promise.resolve( 1 );
var p2 = Promise.resolve( p1 );
var p3 = new Promise(function(resolve, reject){
  resolve(1);
});
var p4 = new Promise(function(resolve, reject){
  resolve(p1);
});

console.log(p1 === p2); 
console.log(p1 === p3);
console.log(p1 === p4);
console.log(p3 === p4);

p4.then(function(value){
  console.log('p4=' + value);
});

p2.then(function(value){
  console.log('p2=' + value);
})

p1.then(function(value){
  console.log('p1=' + value);
})

//  Promise.resolve()
//  方法的参数为Promise对象时直接返回，不会新建，指针不变
//  new Promise()
//  会新建一个Primise对象再返回，此时指针已改变
```

控制台输出：

```javascript
true
false
false
false
p2=1
p1=1
p4=1
```

`Promise.resolve(...)`可以接收一个值或者是一个Promise对象作为参数。当参数是普通值时，它返回一个resolved状态的Promise对象，对象的值就是这个参数；当参数是一个Promise对象时，它直接返回这个Promise参数。因此，p1 === p2。但通过new的方式创建的Promise对象都是一个新的对象，因此后面的三个比较结果都是false。另外，为什么p4的`then`最先调用，但在控制台上是最后输出结果的呢？因为p4的`resolve`中接收的参数是一个Promise对象p1，`resolve`会对p1”拆箱“，获取p1的状态和值，但这个过程是异步的，可参考下一节。

#### 8.resolve vs reject

```javascript
var p1 = new Promise(function(resolve, reject){
  resolve(Promise.resolve('resolve'));
});

var p2 = new Promise(function(resolve, reject){
  resolve(Promise.reject('reject'));
});

var p3 = new Promise(function(resolve, reject){
  reject(Promise.resolve('resolve'));
});

p1.then(
  function fulfilled(value){
    console.log('fulfilled: ' + value);
  }, 
  function rejected(err){
    console.log('rejected: ' + err);
  }
);

p2.then(
  function fulfilled(value){
    console.log('fulfilled: ' + value);
  }, 
  function rejected(err){
    console.log('rejected: ' + err);
  }
);

p3.then(
  function fulfilled(value){
    console.log('fulfilled: ' + value);
  }, 
  function rejected(err){
    console.log('rejected: ' + err);
  }
);
```

控制台输出：

```javascript
p3 rejected: [object Promise]
p1 fulfilled: resolve
p2 rejected: reject

//  reject直接返回参数最快，resolve需要拆箱
```

Promise回调函数中的第一个参数`resolve`，会对Promise执行"拆箱"动作。即当`resolve`的参数是一个Promise对象时，`resolve`会"拆箱"获取这个Promise对象的状态和值，但这个过程是异步的。p1"拆箱"后，获取到Promise对象的状态是resolved，因此`fulfilled`回调被执行；p2"拆箱"后，获取到Promise对象的状态是rejected，因此`rejected`回调被执行。但Promise回调函数中的第二个参数`reject`不具备”拆箱“的能力，reject的参数会直接传递给`then`方法中的`rejected`回调。因此，即使p3 `reject`接收了一个resolved状态的Promise，`then`方法中被调用的依然是`rejected`，并且参数就是`reject`接收到的Promise对象。

## CSS

### hover添加动画

```css
.btn-theme:hover {
    transition-duration: .3s;
    transition-property: all;
    transition-timing-function: cubic-bezier(.7,1,.7,1);
}
```

### background fixed

可以实现背景固定效果

```css
.promo-banner {
    position: relative;
    z-index: 1;
    background: url(/aironepage/HTML/img/1920x1080/02.jpg) center center no-repeat fixed;
    background-size: cover;
    min-height: 100%;
}
```

### 简单旋转动画

```html
<img src={logo} className="App-logo" alt="logo" />
```

```css
/* 
  prefers-reduced-motion:用于检测用户的系统是否被开启了动画减弱功能
  no-preference
  用户未修改系统动画相关特性。
  reduce
  这个值意味着用户修改了系统设置，将动画效果最小化，最好所有的不必要的移动都能被移除。
*/

@media (prefers-reduced-motion: no-preference) {
  .App-logo {
    animation: App-logo-spin infinite 20s linear;
  }
}

@keyframes App-logo-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
```



### font-size

- `px` (像素): 将像素的值赋予给你的文本。这是一个绝对单位， 它导致了在任何情况下，页面上的文本所计算出来的像素值都是一样的。
- `em`: 1em 等于我们设计的当前元素的父元素上设置的字体大小 (更加具体的话，比如包含在父元素中的大写字母 M 的宽度) 如果你有大量设置了不同字体大小的嵌套元素，这可能会变得棘手, 但它是可行的，如下图所示。为什么要使用这个麻烦的单位呢? 当你习惯这样做时，那么就会变得很自然，你可以使用`em`调整任何东西的大小，不只是文本。你可以有一个单位全部都使用 em 的网站，这样维护起来会很简单。
- `rem`: 这个单位的效果和 `em` 差不多，除了 1`rem` 等于 HTML 中的根元素的字体大小， (i.e. [``](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/html)) ，而不是父元素。这可以让你更容易计算字体大小，但是遗憾的是， `rem` 不支持 Internet Explorer 8 和以下的版本。如果你的项目需要支持较老的浏览器，你可以坚持使用`em` 或 `px`, 或者是 [polyfill](https://developer.mozilla.org/en-US/docs/Glossary/polyfill) 就像 [REM-unit-polyfill](https://github.com/chuckcarpenter/REM-unit-polyfill). 

## Tinymce

### 图片上传实现

```js
// 初始化
tinymce.init({
    selector: '#tinymce-editor',
    language_url: "/tinymce/zh_CN.js",
    statusbar: false,
    menubar: false,
    plugins: 'image link code textcolor toc',
    height: 400,
    toolbar: 'formatselect | fontsizeselect | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | undo redo | bold italic | underline | forecolor | link | code |  image | toc',
    image_title: false,
    automatic_uploads: true,
    images_upload_handler: this.imgUpload       // 上传函数绑定
}).then( resolve=>{
    loading.close()
});
```

```js
// 上传函数
imgUpload (blobInfo, success, failure) {
    const formData = new FormData();
    formData.append('files', blobInfo.blob(), blobInfo.filename());
    axios.post('/api/file/post', formData).then((res) => {
        if(res.data.success) {
            this.$message({
                message: '上传成功',
                type: 'success',
                center: true
            });
            let url = res.data.urls[0].url
            // success回调函数返回图片地址
            success(url)
        } else {
            this.$message({
                message: '上传失败',
                type: 'error',
                center: true
            });
            failure('')
        }
    }).catch((err) => {
        this.$message({
            message: '上传失败',
            type: 'error',
            center: true
        });
        failure('')
    })
},
```

