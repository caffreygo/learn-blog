# Composition API

## setup函数

::: tip setup(props, context)

- setup(props, context)函数在vue实例被初始化之前执行，return返回的数据可以在模板中使用
- setup内部不能使用this这样的关键词来获取实例上的属性和方法等
- 
  组件可以使用 **this.$options.setup**获取调用

:::

```js
const app = Vue.createApp({
    template: `
		<div @click="handleClick">{{name}}</div>
	`,
    methods: {
        test() {
            console.log(this.$options.setup());
        }
    },
    mounted() {
        this.test();
    },
    // created 实例被完全初始化之前
    setup(props, context) {
        return {
            name: 'dell',
            handleClick: () => {
                alert(123)
            }
        }
    }
});
const vm = app.mount('#root');
```

