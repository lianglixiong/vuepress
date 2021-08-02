## 使用与详解
```js
import Vuex from 'vuex'
Vue.use(Vuex)
```

### 源码

`Vue.use(Vuex)`的时候执行了Vuex里面的`install`方法，即下面的一段代码：

这段代码在每个vue组件实例的`beforeCreate`钩子函数里面注入绑定store实例的代码，所以我们在组件中可以通过`this.$store`拿到实例
```js
Vue.mixin({ beforeCreate: vuexInit })

function vuexInit () {
    const options = this.$options
    // store注入实例属性$store
    // 根组件跑这里
    if (options.store) {
      this.$store = typeof options.store === 'function'
        ? options.store()
        : options.store
    // 子组件跑这里
    } else if (options.parent && options.parent.$store) {
      this.$store = options.parent.$store
    }
}
```