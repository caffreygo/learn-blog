# 零碎笔记

## font-size

- `px` (像素): 将像素的值赋予给你的文本。这是一个绝对单位， 它导致了在任何情况下，页面上的文本所计算出来的像素值都是一样的。
- `em`: 1em 等于我们设计的当前元素的父元素上设置的字体大小 (更加具体的话，比如包含在父元素中的大写字母 M 的宽度) 如果你有大量设置了不同字体大小的嵌套元素，这可能会变得棘手, 但它是可行的，如下图所示。为什么要使用这个麻烦的单位呢? 当你习惯这样做时，那么就会变得很自然，你可以使用`em`调整任何东西的大小，不只是文本。你可以有一个单位全部都使用 em 的网站，这样维护起来会很简单。
- `rem`: 这个单位的效果和 `em` 差不多，除了 1`rem` 等于 HTML 中的根元素的字体大小， (i.e. [``](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/html)) ，而不是父元素。这可以让你更容易计算字体大小，但是遗憾的是， `rem` 不支持 Internet Explorer 8 和以下的版本。如果你的项目需要支持较老的浏览器，你可以坚持使用`em` 或 `px`, 或者是 [polyfill](https://developer.mozilla.org/en-US/docs/Glossary/polyfill) 就像 [REM-unit-polyfill](https://github.com/chuckcarpenter/REM-unit-polyfill). 



## $nextTick()

- 数据的改变并不会马上触发DOM的更新，此时组件不会立即渲染，要想在DOM更新后操作（例如获取新的DOM内的数据`innerHTML`，需要使用`$nextTick()`的回调函数, 在下一个的数据改变的事件队列内中获取。

- 在`created`周期函数中的DOM操作也是如此，而在`mounted`中则没有问题。
  

