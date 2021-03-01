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

## 自定义指令

输入框自动聚焦

```js
const app = Vue.createApp({
    mounted() {
        this.$refs.input.focus()
    },
    template: `
    <div>
    	<input ref="input" />
    </div>
`
})
const vm = app.mount('#root');
```

### 自动聚焦指令

```js
const app = Vue.createApp({
    template: `
    <div>
    	<input v-focus />
    </div>
`
})
app.directive('focus', {
    // 当元素被挂载到页面dom之后，mounted函数会自动执行
    mounted(el) {
        el.focus()
    }
})
const vm = app.mount('#root');
```

### 局部自定义指令

```js
const directives = {
    focus: {
        mounted(el) {
            el.focus()
        }
    }
}

const app = Vue.createApp({
    directives,
    template: `
    <div>
    	<input v-focus />
    </div>
`
})
const vm = app.mount('#root');
```

### 声明周期函数

1. 执行`vm.$data.show = false`, beforeUpdate、updated依次打印 （display的变化）
2. 当改成`v-if`时，beforeUnmount、unmounted依次打印

```js
const directives = {
    focus: {
        beforeMount() {
            console.log('beforeMount')
        },
        mounted(el) {
            console.log('mounted')
            el.focus()
        },
        beforeUpdate() {
            console.log("beforeUpdate")
        },
        // 元素已经重新更新渲染
        updated() {
            console.log("updated")
        },
        beforeUnmount() {
            console.log("beforeUnmount")
        },
        unmounted() {
            console.log("unmounted")
        }
    }
}

const app = Vue.createApp({
    directives,
    data() {
        return {
            show: true
        }
    },
    template: `
<div>
<div v-show="show">
<input v-focus />
</div>
</div>
`
})
const vm = app.mount('#root');
```

