# Vue 初始化过程

## Vue
> /src/core/instance/index.js
```js
import { initMixin } from './init'

// Vue 构造函数
function Vue (options) {
  // 调用 Vue.prototype._init 方法，该方法是在 initMixin 中定义的
  this._init(options)
}

// 定义 Vue.prototype._init 方法
initMixin(Vue)

export default Vue
```

## Vue.prototype._init
> /src/core/instance/init.js
```js
/**
 * 定义 Vue.prototype._init 方法 
 * @param {*} Vue Vue 构造函数
 */
export function initMixin (Vue: Class<Component>) {
  // 负责 Vue 的初始化过程
  Vue.prototype._init = function (options?: Object) {
    // vue 实例
    const vm: Component = this
    // 每个 vue 实例都有一个 _uid，并且是依次递增的
    vm._uid = uid++

    // a flag to avoid this being observed
    vm._isVue = true
    // 处理组件配置项
    if (options && options._isComponent) {
      /**
       * 每个子组件初始化时走这里，这里只做了一些性能优化
       * 将组件配置对象上的一些深层次属性放到 vm.$options 选项中，以提高代码的执行效率
       */
      initInternalComponent(vm, options)
    } else {
      /**
       * 初始化根组件时走这里，合并 Vue 的全局配置到根组件的局部配置，比如 Vue.component 注册的全局组件会合并到 根实例的 components 选项中
       * 至于每个子组件的选项合并则发生在两个地方：
       *   1、Vue.component 方法注册的全局组件在注册时做了选项合并
       *   2、{ components: { xx } } 方式注册的局部组件在执行编译器生成的 render 函数时做了选项合并，包括根组件中的 components 配置
       */
      vm.$options = mergeOptions(
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
      )
    }
    /* istanbul ignore else */
    if (process.env.NODE_ENV !== 'production') {
      // 设置代理，将 vm 实例上的属性代理到 vm._renderProxy
      initProxy(vm)
    } else {
      vm._renderProxy = vm
    }
    // expose real self
    vm._self = vm
    // 初始化组件实例关系属性，比如 $parent、$children、$root、$refs 等
    initLifecycle(vm)
    /**
     * 初始化自定义事件，这里需要注意一点，所以我们在 <comp @click="handleClick" /> 上注册的事件，监听者不是父组件，
     * 而是子组件本身，也就是说事件的派发和监听者都是子组件本身，和父组件无关
     */
    initEvents(vm)
    // 解析组件的插槽信息，得到 vm.$slot，处理渲染函数，得到 vm.$createElement 方法，即 h 函数
    initRender(vm)
    // 调用 beforeCreate 钩子函数
    callHook(vm, 'beforeCreate')
    // 初始化组件的 inject 配置项，得到 result[key] = val 形式的配置对象，然后对结果数据进行响应式处理，并代理每个 key 到 vm 实例
    initInjections(vm) // resolve injections before data/props
    // 数据响应式的重点，处理 props、methods、data、computed、watch
    initState(vm)
    // 解析组件配置项上的 provide 对象，将其挂载到 vm._provided 属性上
    initProvide(vm) // resolve provide after data/props
    // 调用 created 钩子函数
    callHook(vm, 'created')

    // 如果发现配置项上有 el 选项，则自动调用 $mount 方法，也就是说有了 el 选项，就不需要再手动调用 $mount，反之，没有 el 则必须手动调用 $mount
    if (vm.$options.el) {
      // 调用 $mount 方法，进入挂载阶段
      vm.$mount(vm.$options.el)
    }
  }
}

```

## resolveConstructorOptions
> /src/core/instance/init.js
```js
/**
 * 从组件构造函数中解析配置对象 options，并合并基类选项
 * @param {*} Ctor 
 * @returns 
 */
export function resolveConstructorOptions (Ctor: Class<Component>) {
  // 配置项目
  /**
   *  options = { 
   *    components: {KeepAlive: {…}, Transition: {…}, TransitionGroup: {…}, button-counter: ƒ}
        directives: {model: {…}, show: {…}}
        filters: {}
        ...
      }
   */
  let options = Ctor.options
  if (Ctor.super) {
    // 存在基类，递归解析基类构造函数的选项
    const superOptions = resolveConstructorOptions(Ctor.super)
    const cachedSuperOptions = Ctor.superOptions
    if (superOptions !== cachedSuperOptions) {
      // 说明基类构造函数选项已经发生改变，需要重新设置
      Ctor.superOptions = superOptions
      // 检查 Ctor.options 上是否有任何后期修改/附加的选项（＃4976）
      const modifiedOptions = resolveModifiedOptions(Ctor)
      // 如果存在被修改或增加的选项，则合并两个选项
      if (modifiedOptions) {
        extend(Ctor.extendOptions, modifiedOptions)
      }
      // 选项合并，将合并结果赋值为 Ctor.options
      options = Ctor.options = mergeOptions(superOptions, Ctor.extendOptions)
      if (options.name) {
        options.components[options.name] = Ctor
      }
    }
  }
  return options
}

```

## resolveModifiedOptions
> /src/core/instance/init.js
```js
/**
 * 解析构造函数选项中后续被修改或者增加的选项
 */
function resolveModifiedOptions (Ctor: Class<Component>): ?Object {
  let modified
  // 构造函数选项
  const latest = Ctor.options
  // 密封的构造函数选项，备份
  const sealed = Ctor.sealedOptions
  // 对比两个选项，记录不一致的选项
  for (const key in latest) {
    if (latest[key] !== sealed[key]) {
      if (!modified) modified = {}
      modified[key] = latest[key]
    }
  }
  return modified
}

```

## mergeOptions
> /src/core/util/options.js
```js
/**
 * 合并两个选项，出现相同配置项时，子选项会覆盖父选项的配置
 */
export function mergeOptions (
  parent: Object,
  child: Object,
  vm?: Component
): Object {
  if (process.env.NODE_ENV !== 'production') {
    checkComponents(child)
  }

  if (typeof child === 'function') {
    child = child.options
  }

  // 标准化 props、inject、directive 选项，方便后续程序的处理
  normalizeProps(child, vm)
  normalizeInject(child, vm)
  normalizeDirectives(child)

  // 处理原始 child 对象上的 extends 和 mixins，分别执行 mergeOptions，将这些继承而来的选项合并到 parent
  // mergeOptions 处理过的对象会含有 _base 属性
  if (!child._base) {
    if (child.extends) {
      parent = mergeOptions(parent, child.extends, vm)
    }
    if (child.mixins) {
      for (let i = 0, l = child.mixins.length; i < l; i++) {
        parent = mergeOptions(parent, child.mixins[i], vm)
      }
    }
  }

  const options = {}
  let key
  // 遍历 父选项
  for (key in parent) {
    mergeField(key)
  }

  // 遍历 子选项，如果父选项不存在该配置，则合并，否则跳过，因为父子拥有同一个属性的情况在上面处理父选项时已经处理过了，用的子选项的值
  for (key in child) {
    if (!hasOwn(parent, key)) {
      mergeField(key)
    }
  }

  // 合并选项，childVal 优先级高于 parentVal
  function mergeField (key) {
    // strats = Object.create(null)
    const strat = strats[key] || defaultStrat
    // 值为如果 childVal 存在则优先使用 childVal，否则使用 parentVal
    options[key] = strat(parent[key], child[key], vm, key)
  }
  return options
}

```

## initInjections
> /src/core/instance/inject.js
```js
/**
 * 初始化 inject 配置项
 *   1、得到 result[key] = val
 *   2、对结果数据进行响应式处理，代理每个 key 到 vm 实例
 */
export function initInjections (vm: Component) {
  // 解析 inject 配置项，然后从祖代组件的配置中找到 配置项中每一个 key 对应的 val，最后得到 result[key] = val 的结果
  const result = resolveInject(vm.$options.inject, vm)
  // 对 result 做 数据响应式处理，也有代理 inject 配置中每个 key 到 vm 实例的作用。
  // 不不建议在子组件去更改这些数据，因为一旦祖代组件中 注入的 provide 发生更改，你在组件中做的更改就会被覆盖
  if (result) {
    toggleObserving(false)
    Object.keys(result).forEach(key => {
      /* istanbul ignore else */
      if (process.env.NODE_ENV !== 'production') {
        defineReactive(vm, key, result[key], () => {
          warn(
            `Avoid mutating an injected value directly since the changes will be ` +
            `overwritten whenever the provided component re-renders. ` +
            `injection being mutated: "${key}"`,
            vm
          )
        })
      } else {
        defineReactive(vm, key, result[key])
      }
    })
    toggleObserving(true)
  }
}

```

## resolveInject
> /src/core/instance/inject.js
```js
/**
 * 解析 inject 配置项，从祖代组件的 provide 配置中找到 key 对应的值，否则用 默认值，最后得到 result[key] = val
 * inject 对象肯定是以下这个结构，因为在 合并 选项时对组件配置对象做了标准化处理
 * @param {*} inject = {
 *  key: {
 *    from: provideKey,
 *    default: xx
 *  }
 * }
 */
export function resolveInject (inject: any, vm: Component): ?Object {
  if (inject) {
    // inject is :any because flow is not smart enough to figure out cached
    const result = Object.create(null)
    // inject 配置项的所有的 key
    const keys = hasSymbol
      ? Reflect.ownKeys(inject)
      : Object.keys(inject)

    // 遍历 key
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      // 跳过 __ob__ 对象
      // #6574 in case the inject object is observed...
      if (key === '__ob__') continue
      // 拿到 provide 中对应的 key
      const provideKey = inject[key].from
      let source = vm
      // 遍历所有的祖代组件，直到 根组件，找到 provide 中对应 key 的值，最后得到 result[key] = provide[provideKey]
      while (source) {
        if (source._provided && hasOwn(source._provided, provideKey)) {
          result[key] = source._provided[provideKey]
          break
        }
        source = source.$parent
      }
      // 如果上一个循环未找到，则采用 inject[key].default，如果没有设置 default 值，则抛出错误
      if (!source) {
        if ('default' in inject[key]) {
          const provideDefault = inject[key].default
          result[key] = typeof provideDefault === 'function'
            ? provideDefault.call(vm)
            : provideDefault
        } else if (process.env.NODE_ENV !== 'production') {
          warn(`Injection "${key}" not found`, vm)
        }
      }
    }
    return result
  }
}

```

## initProvide
> /src/core/instance/inject.js
```js
/**
 * 解析组件配置项上的 provide 对象，将其挂载到 vm._provided 属性上 
 */
export function initProvide (vm: Component) {
  const provide = vm.$options.provide
  if (provide) {
    vm._provided = typeof provide === 'function'
      ? provide.call(vm)
      : provide
  }
}

```