# 全局 API(5)

## 入口
> /src/core/global-api/index.js
```js
/**
 * 初始化 Vue 的众多全局 API，比如：
 *   默认配置：Vue.config
 *   工具方法：Vue.util.xx
 *   Vue.set、Vue.delete、Vue.nextTick、Vue.observable
 *   Vue.options.components、Vue.options.directives、Vue.options.filters、Vue.options._base
 *   Vue.use、Vue.extend、Vue.mixin、Vue.component、Vue.directive、Vue.filter
 *   
 */
export function initGlobalAPI (Vue: GlobalAPI) {
  // config
  const configDef = {}
  // Vue 的众多默认配置项
  configDef.get = () => config

  if (process.env.NODE_ENV !== 'production') {
    configDef.set = () => {
      warn(
        'Do not replace the Vue.config object, set individual fields instead.'
      )
    }
  }

  // Vue.config
  Object.defineProperty(Vue, 'config', configDef)

  /**
   * 暴露一些工具方法，轻易不要使用这些工具方法，处理你很清楚这些工具方法，以及知道使用的风险
   */
  Vue.util = {
    // 警告日志
    warn,
    // 类似选项合并
    extend,
    // 合并选项
    mergeOptions,
    // 设置响应式
    defineReactive
  }

  // Vue.set / delete / nextTick
  Vue.set = set
  Vue.delete = del
  Vue.nextTick = nextTick

  // 响应式方法
  Vue.observable = <T>(obj: T): T => {
    observe(obj)
    return obj
  }

  // Vue.options.compoents/directives/filter
  Vue.options = Object.create(null)
  ASSET_TYPES.forEach(type => {
    Vue.options[type + 's'] = Object.create(null)
  })

  // 将 Vue 构造函数挂载到 Vue.options._base 上
  Vue.options._base = Vue

  // 在 Vue.options.components 中添加内置组件，比如 keep-alive
  extend(Vue.options.components, builtInComponents)

  // Vue.use
  initUse(Vue)
  // Vue.mixin
  initMixin(Vue)
  // Vue.extend
  initExtend(Vue)
  // Vue.component/directive/filter
  initAssetRegisters(Vue)
}

```

## Vue.use
> /src/core/global-api/use.js
```js
/**
 * 定义 Vue.use，负责为 Vue 安装插件，做了以下两件事：
 *   1、判断插件是否已经被安装，如果安装则直接结束
 *   2、安装插件，执行插件的 install 方法
 * @param {*} plugin install 方法 或者 包含 install 方法的对象
 * @returns Vue 实例
 */
Vue.use = function (plugin: Function | Object) {
  // 已经安装过的插件列表
  const installedPlugins = (this._installedPlugins || (this._installedPlugins = []))
  // 判断 plugin 是否已经安装，保证不重复安装
  if (installedPlugins.indexOf(plugin) > -1) {
    return this
  }

  // 将 Vue 构造函数放到第一个参数位置，然后将这些参数传递给 install 方法
  const args = toArray(arguments, 1)
  args.unshift(this)

  if (typeof plugin.install === 'function') {
    // plugin 是一个对象，则执行其 install 方法安装插件
    plugin.install.apply(plugin, args)
  } else if (typeof plugin === 'function') {
    // 执行直接 plugin 方法安装插件
    plugin.apply(null, args)
  }
  // 在 插件列表中 添加新安装的插件
  installedPlugins.push(plugin)
  return this
}
```
- 判断`plugin`是否已经安装，已经安装则直接返回`Vue`(保证不重复安装)
- `toArray`函数把类数组转换成数组，等同于 `Array.from(arguments).slice(1)`
- 在数组首位插入Vue，所以`Vue.use( plugin )`中的plugin里面的`install`方法第一个参数是`Vue`
- `plugin`可以是一个函数，也可以是一个含有`install`方法的对象(包括函数对象)
- 保存新安装的插件
- 返回`this`(即Vue)，可以链式调用`Vue.use( plugin ).use( plugin )`