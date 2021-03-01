# Vue.js 高级语法

## Mixin 混入

```js
mixins: [myMixin]    // 局部的mixin
```

- 组件data、methods优先级高于mixin数据优先级 (合并策略：覆盖)
- 声明周期函数，先执行mixin里面的，再执行组件里面的

### 全局mixin

- 局部的mixin只能在混入的组件内使用mixin的内容
- 全局的mixin可以在任何组件位置内使用（自动注入）
- 代码维护性不高

```js
app.mixin({
    data() {
        return {
            // ...
        }
    },
    created() {
      	// ...  
    },
    methods: {
        // ...
    }
})
```

### 自定义优先级

自定义属性的优先级高于mixin属性的优先级 （和data、methods一样）

```js
const myMixin = {
    number: 1
}
const app = Vue.createApp({
    minxins: [myMixin],
    number: 2,
    data() {
        return {
        }
    },
    template: '<div>{{ this.$options.number }} </div>'
})

const vm = app.mount('#root');
```

以上页面将会展示 **2**，我们也可以重写属性的合并策略，在声明optionMergeStrategies的number合并策略后，将显示 **1**

```js
const myMixin = {
    number: 1
}

const app = Vue.createApp({
    mixins: [myMixin],
    number: 2,
    template: `
    <div>
    	<div>{{this.$options.number}}</div>
    </div>
`
});

app.config.optionMergeStrategies.number = (mixinVal, appValue) => {
    return mixinVal || appValue;
}

const vm = app.mount('#root');
```

