 

## 响应式对象

### Object.defineProperty

[MDN]: https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty	"Object.defineProperty"

::: tip

`Object.defineProperty`方法可以在对象上定义或者修改属性

```js
Object.defineProperty(obj, prop, descriptor)
```

:::

### observe(value, asRootData)

```js
export function observe (value: any, asRootData: ?boolean): Observer | void {
  // value为对象，且不能为VNode示例
  if (!isObject(value) || value instanceof VNode) {
    return
  }
  let ob: Observer | void
  // 如果有__ob__属性，并且该属性是Observer实例，直接返回__ob__属性
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__
  } else if (
    // shouldObserve：全局控制调用observe后是否需要new Oberser
    // 数组或者可拓展的对象
    shouldObserve &&
    !isServerRendering() &&
    (Array.isArray(value) || isPlainObject(value)) &&
    Object.isExtensible(value) &&
    !value._isVue
  ) {
    ob = new Observer(value)
  }
  if (asRootData && ob) {
    ob.vmCount++
  }
  return ob
}
```

### class Observer

```js
export class Observer {
  value: any;
  dep: Dep;
  vmCount: number; // number of vms that have this object as root $data

  constructor (value: any) {
    this.value = value
    this.dep = new Dep()
    this.vmCount = 0
    // 给value对象添加一个__ob__属性,第四个参数enumerable不传默认为false,
    // 不可枚举的属性不会出现在Object.keys(value)数组中
    def(value, '__ob__', this)
    if (Array.isArray(value)) {
      if (hasProto) {
        protoAugment(value, arrayMethods)
      } else {
        copyAugment(value, arrayMethods, arrayKeys)
      }
      // 对于数组递归调用observe方法
      this.observeArray(value)
    } else {
      // 遍历对象的所有属性(Object.keys(...))，defineReactive(obj, kes[i])
      this.walk(value)
    }
  }
}
/**
 * Define a property.
 */
export function def (obj: Object, key: string, val: any, enumerable?: boolean) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  })
}
```

### defineReactive

```js
/**
 * Define a reactive property on an Object.
 */
export function defineReactive (
  obj: Object,
  key: string,
  val: any,
  customSetter?: ?Function,
  shallow?: boolean
) {
  const dep = new Dep()
  // 通过Object.getOwnPropertyDescriptor拿到对象属性的定义
  const property = Object.getOwnPropertyDescriptor(obj, key)
  if (property && property.configurable === false) {
    return
  }

  // cater for pre-defined getter/setters
  const getter = property && property.get
  const setter = property && property.set
  // walk方法里面的defineReactive(obj, keys[2])的参数长度就是2
  if ((!getter || setter) && arguments.length === 2) {
    val = obj[key]
  }

  // 如果对象属性的值是对象，会递归调用变成响应式对象(有getter, setter)
  // getter:依赖收集， setter:派发更新
  let childOb = !shallow && observe(val)
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      const value = getter ? getter.call(obj) : val
      if (Dep.target) {
        dep.depend()
        if (childOb) {
          childOb.dep.depend()
          if (Array.isArray(value)) {
            dependArray(value)
          }
        }
      }
      return value
    },
    set: function reactiveSetter (newVal) {
      const value = getter ? getter.call(obj) : val
      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      /* eslint-enable no-self-compare */
      if (process.env.NODE_ENV !== 'production' && customSetter) {
        customSetter()
      }
      // #7981: for accessor properties without setter
      if (getter && !setter) return
      if (setter) {
        setter.call(obj, newVal)
      } else {
        val = newVal
      }
      childOb = !shallow && observe(newVal)
      dep.notify()
    }
  })
}
```

