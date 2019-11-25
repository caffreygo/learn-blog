

## Alert组件

添加`install`方法来方便alert作为插件使用。

```javascript
import Alert from './src/main';

/* istanbul ignore next */
Alert.install = function(Vue) {
  Vue.component(Alert.name, Alert);
};

export default Alert;
```

## 整体main.vue

首先分析一下其模板结构。

```html
<template>
  <transition name="el-alert-fade">
    <div
      class="el-alert"
      :class="[typeClass, center ? 'is-center' : '', 'is-' + effect]"
      v-show="visible"
      role="alert"
    >
      <i class="el-alert__icon" :class="[ iconClass, isBigIcon ]" v-if="showIcon"></i>
      <div class="el-alert__content">
        <span class="el-alert__title" :class="[ isBoldTitle ]" v-if="title || $slots.title">
          <slot name="title">{{ title }}</slot>
        </span>
        <p class="el-alert__description" v-if="$slots.default && !description"><slot></slot></p>
        <p class="el-alert__description" v-if="description && !$slots.default">{{ description }}</p>
        <i class="el-alert__closebtn" :class="{ 'is-customed': closeText !== '', 'el-icon-close': closeText === '' }" v-show="closable" @click="close()">{{closeText}}</i>
      </div>
    </div>
  </transition>
</template>
```

## 最外层transition

首先，最外层是一个名为`el-alert-fade`的过渡动画，查询发现，它只是简单的改变了透明度。

~~~html
<transition name="el-alert-fade">
</transition>
  .el-alert-fade-enter,
  .el-alert-fade-leave-active {
    opacity: 0;
  }````

## el-alert包裹
然后，里面是一层`el-alert 类`的`div`用来包裹整个组件，其中一个属性是根据传递`props`的`type`类型改变样式，另一个是根据`visible`决定是否显示。

```html
<div class="el-alert" :class="[ typeClass ]" v-show="visible">
</div>
~~~

`is-effect`样式控制alert组件的主题，分别是默认的light主题和dark主题。

```javascript
effect: {
    type: String,
    default: 'light',
    validator: function(value) {
        return ['light', 'dark'].indexOf(value) !== -1;
    }
}
```

`type`是一个`计算属性`，代码如下：

```javascript
props: {
  type: {
    type: String,
    default: 'info'
  }
}

computed: {
  typeClass() {
    return `el-alert--${ this.type }`;  // 根据传递的type返回不同的类
  }
}
```

再往里面，是一个`i`标签和一个`div`标签，前者是相应的图标，后者是警告具体的内容。

## 图标

图标通过两个类控制样式，它们都是`计算属性`，其中`iconClass`决定图标类型，`isBigIcon`决定图标大小，而`showIcon`是传递来的`props`决定是否显示这个图标。其代码如下：

```html
<i class="el-alert__icon" :class="[ iconClass, isBigIcon ]" v-if="showIcon"></i>
props: {
  showIcon: Boolean
}

computed: {
  iconClass() {
    return TYPE_CLASSES_MAP[this.type] || 'el-icon-info';
  },

  isBigIcon() {
    return this.description || this.$slots.default ? 'is-big' : '';
  },
}
```

其中`TYPE_CLASSES_MAP`是一个常量对象，用来做`map`，根据传递的`type`来决定相应的类名。

```javascript
const TYPE_CLASSES_MAP = {
  'success': 'el-icon-circle-check',
  'warning': 'el-icon-warning',
  'error': 'el-icon-circle-cross'
};
```

而`isBigIcon`是根据`props`中的`description`来决定的，当存在描述内容的时候就使用大的图标。具体显示效果可以查看官网的demo。

```javascript
props: {
  description: {
    type: String,
    default: ''
  },
}
```

## 主体内容

接下来是主要的内容部分，包括标题、内容和关闭按钮三个部分。

### 标题

标题是由名为`title`的`prop`来决定的，包含一个`isBoldTitle`的计算属性来决定是否粗体，以及根据`title`是否存在来决定是否显示这一部分。

```html
<span class="el-alert__title" :class="[ isBoldTitle ]" v-if="title">{{ title }}</span>
computed: {
	isBoldTitle() {
		return this.description || this.$slots.default ? 'is-bold' : '';
	}
}
```

### 警告描述

然后是最为主要的描述部分，这部分是一个`slot`，这使得，这一部分可以自定义，也可以通过传递`description`这一`prop`来决定内容。

```html
<p class="el-alert__description" v-if="$slots.default && !description">
    <slot></slot>
</p>
<p class="el-alert__description" v-if="description && !$slots.default">
    {{ description }}
</p>
```

### 关闭按钮

最后是关闭按钮的实现。

```html
<i class="el-alert__closebtn" 
   :class="{ 'is-customed': closeText !== '', 'el-icon-close': closeText === '' }" 
   v-show="closable" 
   @click="close()">
    {{closeText}}
</i>
```

不难看出，做了如下处理：

1. 存在`closeText`这一`prop`的内容的话，会自定义关闭内容；
2. 会根据`closable`这一`prop`决定是否显示该关闭按钮；
3. 绑定单击时触发事件`close()`

其中`closeText`和`closable`的代码如下：

```javascript
props: {
  closable: {
    type: Boolean,
    default: true
  },
  closeText: {
    type: String,
    default: ''
  },
}
```

`close`会将`visible`设置为`false`从而关闭该警告，并且触发`close`事件。

```javascript
methods: {
  close() {
    this.visible = false;
    this.$emit('close');
  }
},
```