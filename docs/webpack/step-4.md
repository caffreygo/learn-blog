# webpack

## performance

- ​	`false`:不提示性能问题（例如当打包后文件超过244kb时会提醒文件过大）

- ​	默认： `true`



## cacheGroups

```javascript
  optimization: {

​    splitChunks: {

​      chunks: 'all',

​      cacheGroups: {

​        vendors: {

​          test: /[\\/]node_modules[\\/]/,    

​          priority: -10,

​          name: 'vendors',

​        }

​      }

​    }

  }
```

- name:  默认vendors~main.js，这里重命名为vendor.js

- test: (正则)从node_modules内引入的文件（lodash、jquery等）



## 浏览器缓存（prod）

- 新上传的文件改变如果与原来的文件同名字会导致浏览器使用缓存文件，`普通刷新`无法获取最新的代码
- 在prod模式的output中设置 `filename` 的 `[contenthash]` ,打包内容发生改变，生成的文件也会改变
- 如果没改变代码打包后文件名有发生改变（老版本）：在common   optimization加上

```javascript
runtimeChunk: {

​	name: 'runtime'

}
```

##### main.js: 业务逻辑

##### vendor.js: 放置库

​		业务逻辑和库的关联处理代码： manifest 默认存在于两个文件内，老版本没改变代码 `contenthash`发生改变是因为关系的 `JS` 文件嵌套在两个文件里，打包时会发生变化。

`runtimeChunk` 将关联的代码放到了runtime文件中，让main和vendor不再存在关联代码



## shimming垫片

​		有时候我们在引入第三方库的时候，不得不处理一些全局变量的问题，例如jquery的`$`，lodash的`_`，但由于一些老的第三方库不能直接修改它的代码，这时我们能不能定义一个全局变量，当文件中存在`$`或者`_`的时候自动的帮他们引入对应的包。



**问题：** 我们发现，根本运行不起来，报错`$ is not defined`
**解答：** 这是因为虽然我们在`index.js`中引入的`jquery`文件，但`$`符号只能在`index.js`才有效，在`jquery.ui.js`无效，报错是因为`jquery.ui.js`中`$`符号找不到引起的。

以上场景完美再现了我们最开始提到的问题，那么我们接下来就通过配置解决，首先在`webpack.common.js`文件中使用`ProvidePlugin`插件(webpack自带的)：

```js
const webpack = require('webpack');
module.exports = {
  // 其它配置
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      _: 'lodash',
      _join: ['lodahs','join']     // lodash内的join方法
    })
  ]
}
```

在使用$这个变量的时候自动在文件内引入jquery



## this

- js模块内的this指向当前模块

  

  ```sh
  $ npm install imports-loader -D
  ```

  安装完毕后，我们在`webpack.common.js`加一点配置，在`.js`的loader处理中，添加`imports-loader`

   

  ```js
  module.exports = {
    // ... 其它配置
    module: {
      rules: [
        { 
          test: /\.js$/, 
          exclude: /node_modules/, 
          use: [
            {
              loader: 'babel-loader'
            },
            {
              loader: 'imports-loader?this=>window'
            }
          ]
        }
      ]
    }
  }
  ```

  配置完毕后使用`npm run dev`来进行打包，查看`console`控制台输出`true`，证明`this`这个时候已经指向了全局`window`对象，问题解决。 （先将this指向window,在使用babel-loader）



## 迭代和递归

- 迭代：重复执行某个动作直到完成
- 递归：自身调用自身



