# Vue

## 事件

- 单次点击触发两次事件：`@click=“handleClick1()，habdleClick2()”`
- 不响应子元素的点击：`@click.self`
- `@scroll.passive`增加滚动性能（解决chrome性能警告）
- 键盘修饰符`@keydown.enter deleye`
- 鼠标修饰符`@click.left right middle`
- 精确修饰符, 单独点击ctrl触发`@clock.ctrl.exact`

### V-model修饰符

`v-model. lazy number trim`

### 组件

- 局部组件： `components: { name: componentObj }`
- 全局组件：`app. component(name, configObj) `

```js
const component = {
	data() {},
    template: '<div>child component</div>'
}
```

