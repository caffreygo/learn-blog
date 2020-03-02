# Vue

## Dom元素获取

### 绑定

​		通过ref="selector"绑定元素

### 获取并触发事件

​		如果元素是一个原生的**HTML元素**，通过this.$refs['selector'].click() 触发。

​		如果元素是一个**组件**，通过绑定ref="selector"。需要通过this.$refs['selector'].$el.click() 触发。



## $nextTick()

​		数据的改变并不会马上触发DOM的更新，此时组件不会立即渲染，要想在DOM更新后操作（例如获取新的DOM内的数据`innerHTML`，需要使用`$nextTick()`的回调函数, 在下一个的数据改变的事件队列内中获取。

​		在`created`周期函数中的DOM操作也是如此，而在`mounted`中则没有问题。