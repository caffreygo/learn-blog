# Vue

## 响应式数据原理

### 构造函数

传入的参数就是一个对象: **options**

```js
new Vue({
  el: "#app",
  router,
  store,
  render: (h) => h(App),
});
```

- 挂载init方法

  ```js
  // src/index.js
  import { initMixin } from "./init.js";
  
  // Vue就是一个构造函数 通过new关键字进行实例化
  function Vue(options) {
    // 这里开始进行Vue初始化工作
    this._init(options);
  }
  // _init方法是挂载在Vue原型的方法 通过引入文件的方式进行原型挂载需要传入Vue
  // 此做法有利于代码分割
  initMixin(Vue);
  
  export default Vue;
  ```

- initMixin实现：在Vue构造函数的原型对象上声明**_init**方法，供 Vue 实例调用

  ```js
  // src/init.js
  import { initState } from "./state";
  export function initMixin(Vue) {
    Vue.prototype._init = function (options) {
      const vm = this;
      // 这里的this代表调用_init方法的对象(实例对象)
      // this.$options就是用户new Vue的时候传入的属性
      vm.$options = options;
      // 初始化状态
      initState(vm);
    };
  }
  ```

### initState初始化状态

顺序：**prop > methods > data > computed > watch**

```javascript
export function initState(vm) {
  // 获取传入的数据对象
  const opts = vm.$options;
  if (opts.props) {
    initProps(vm);
  }
  if (opts.methods) {
    initMethod(vm);
  }
  if (opts.data) {
    // 初始化data
    initData(vm);
  }
  if (opts.computed) {
    initComputed(vm);
  }
  if (opts.watch) {
    initWatch(vm);
  }
}
```

### initData

- 初始化 **_data**
- 数据代理
- 数据观测

```js
// 初始化data数据
function initData(vm) {
  let data = vm.$options.data;
  // 实例的_data属性就是传入的data
  // vue组件data推荐使用函数 防止数据在组件之间共享
  data = vm._data = typeof data === "function" ? data.call(vm) : data || {};

  // 把data数据代理到vm 也就是Vue实例上面 我们可以使用this.a来访问this._data.a
  for (let key in data) {
    proxy(vm, `_data`, key);
  }
  // 对数据进行观测 --响应式数据核心
  observe(data);
}
// 数据代理
function proxy(object, sourceKey, key) {
  Object.defineProperty(object, key, {
    get() {
      return object[sourceKey][key];
    },
    set(newValue) {
      object[sourceKey][key] = newValue;
    },
  });
}
```

### Observer 数据劫持

```js
// src/obserber/index.js
class Observer {
  // 观测值
  constructor(value) {
    this.walk(value);
  }
  walk(data) {
    // 对象上的所有属性依次进行观测
    let keys = Object.keys(data);
    for (let i = 0; i < keys.length; i++) {
      let key = keys[i];
      let value = data[key];
      defineReactive(data, key, value);
    }
  }
}
// Object.defineProperty数据劫持核心 兼容性在ie9以及以上
function defineReactive(data, key, value) {
  observe(value); // 递归关键
  // --如果value还是一个对象会继续走一遍odefineReactive 层层遍历一直到value不是对象才停止
  //   思考？如果Vue数据嵌套层级过深 >>性能会受影响
  Object.defineProperty(data, key, {
    get() {
      console.log("获取值");
      return value;
    },
    set(newValue) {
      if (newValue === value) return;
      console.log("设置值");
      // 此处可以进行对应的视图更新通知
      value = newValue;
    },
  });
}
export function observe(value) {
  // 如果传过来的是对象或者数组 进行属性劫持
  if (
    Object.prototype.toString.call(value) === "[object Object]" ||
    Array.isArray(value)
  ) {
    return new Observer(value);
  }
}
```

#### 缺点

`Object.defineProperty`

- 对象新增或者删除的属性无法被 set 监听到
- 只有对象本身存在的属性修改才会被劫持

#### 数组数据劫持

1. 这样递归的方式其实无论是对象还是数组都进行了观测 
2. 但是我们想一下此时如果 data 包含数组比如 a:[1,2,3,4,5] 那么我们根据下标可以直接修改数据也能触发 set 
3. 但是如果一个数组里面有上千上万个元素 每一个元素下标都添加 get 和 set 方法 这样对于**性能**来说是承担不起的
4. 所以此方法只用来劫持对象

```js
// src/obserber/index.js
import { arrayMethods } from "./array";
class Observer {
  constructor(value) {
    if (Array.isArray(value)) {
      // 这里对数组做了额外判断
      // 通过重写数组原型方法来对数组的七种方法进行拦截   value.__proto__ === Array.prototype
      value.__proto__ = arrayMethods; 
      // 如果数组里面还包含数组 需要递归判断
      this.observeArray(value);
    } else {
      this.walk(value);
    }
  }
  observeArray(items) {
    for (let i = 0; i < items.length; i++) {
      observe(items[i]);
    }
  }
}
```

因为对数组下标的拦截太**浪费性能** 对 Observer 构造函数传入的数据参数增加了数组的判断

```javascript
// src/obserber/index.js
class Observer {
  // 观测值
  constructor(value) {
    Object.defineProperty(value, "__ob__", {
      //  值指代的就是Observer的实例
      value: this,
      //  不可枚举
      enumerable: false,
      writable: true,
      configurable: true,
    });
  }
}
```

对数组原型重写之前咱们先要理解这段代码：

1. 这段代码的意思就是给每个响应式数据增加了一个不可枚举的__ob__属性
2. 并且指向了 Observer 实例 （指向自身value）
3. 那么我们首先可以根据这个属性来防止已经被响应式观察的数据反复被观测 (响应式标记)
4. 其次 响应式数据可以使用__ob__来获取 Observer 实例的相关方法 这对数组很关键

```javascript
// src/obserber/array.js
// 先保留数组原型
const arrayProto = Array.prototype;
// 然后将arrayMethods继承自数组原型
// 这里是面向切片编程思想（AOP）--不破坏封装的前提下，动态的扩展功能
export const arrayMethods = Object.create(arrayProto);
let methodsToPatch = [
  "push",
  "pop",
  "shift",
  "unshift",
  "splice",
  "reverse",
  "sort",
];
methodsToPatch.forEach((method) => {
  arrayMethods[method] = function (...args) {
    //   这里保留原型方法的执行结果
    const result = arrayProto[method].apply(this, args);
    // 这句话是关键
    // this代表的就是数据本身 比如数据是{a:[1,2,3]} 那么我们使用a.push(4)  this就是a  ob就是a.__ob__ 这个属性就是上段代码增加的 代表的是该数据已经被响应式观察过了指向Observer实例
    const ob = this.__ob__;

    // 这里的标志就是代表数组有新增操作
    let inserted;
    switch (method) {
      case "push":
      case "unshift":
        inserted = args;
        break;
      case "splice":
        inserted = args.slice(2);
      default:
        break;
    }
    // 如果有新增的元素 inserted是一个数组 调用Observer实例的observeArray对数组每一项进行观测
    if (inserted) ob.observeArray(inserted);
    // 之后咱们还可以在这里检测到数组改变了之后从而触发视图更新的操作--后续源码会揭晓
    return result;
  };
});
```

### 总结

![](./img/initData.png)

## props处理

### props规范化

::: tip

- props规范化：把各种不是规范格式的形式，规范化为规范格式，方便`Vue.js`在后续的过程中处理`props`
- `props`规范化的过程发生在`this._init()`方法中的`mergeOptions`合并配置中，调用normalizeProps，针对数组和对象进行不同的处理

:::

```javascript
function normalizeProps (options: Object, vm: ?Component) {
  const props = options.props
  if (!props) return
  const res = {}
  let i, val, name
  if (Array.isArray(props)) {
    i = props.length
    while (i--) {
      val = props[i]
      if (typeof val === 'string') {
        name = camelize(val)
        res[name] = { type: null }
      } else if (process.env.NODE_ENV !== 'production') {
        // 如果prop不是字符串表示的键名，报错
        warn('props must be strings when using array syntax.')
      }
    }
  } else if (isPlainObject(props)) {
    for (const key in props) {
      val = props[key]
      name = camelize(key)
      res[name] = isPlainObject(val)
        ? val
        : { type: val }
    }
  } else if (process.env.NODE_ENV !== 'production') {
    warn(
      `Invalid value for option "props": expected an Array or an Object, ` +
      `but got ${toRawType(props)}.`,
      vm
    )
  }
  options.props = res
}
```

- 数组：类型检测、驼峰处理、生成固定键值对的对象

  ```js
  // 规范化前
  export default {
    props: ['age', 'nick-name']
  }
  
  // 规范化后
  export default {
    props: {
      age: {
        type: null
      },
      nickName: {
        type: null
      }
    }
  }
  ```

- 对象：遍历驼峰处理、直接使用普通对象值或者创建`{ type: Type }`格式的对象

  ```js
  // 规范化前
  export default {
    props: {
      name: String,
      age: Number
    }
  }
  
  // 规范化后
  export default {
    props: {
      name: {
        type: String
      },
      age: {
        type: Number
      }
    }
  }
  ```

### props初始化

![](./img/initProps.png)

::: tip props响应式

​		在开发环境下，props的响应式劫持了setter方法
​		这样做是为了保证props为**单项数据流：**既我们不能在子组件中直接修改父组件传递的props值

::: 