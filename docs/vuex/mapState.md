# mapState

## 用法
```js
// 在单独构建的版本中辅助函数为 Vuex.mapState
import { mapState } from 'vuex'

export default {
  // ...
  computed: mapState({
    // 箭头函数可使代码更简练
    count: state => state.count,

    // 传字符串参数 'count' 等同于 `state => state.count`
    countAlias: 'count',

    // 为了能够使用 `this` 获取局部状态，必须使用常规函数
    countPlusLocalState (state, getters) {
      return state.count + this.localCount
    }
  })
}
```

## 源码解析
- normalizeNamespace格式化命名空间，具体参考mapGetters部分
- normalizeMap 转换入参成规范参数，具体参考mapGetters部分
- getModuleByNamespace函数获取命名空间模块，提取state和getters值
- 传入的参数（这里格式化后是val）如果是函数则执行并传入state和getters参数，否则直接返回

具体代码如下：
```js
export const mapState = normalizeNamespace((namespace, states) => {
  const res = {}
  normalizeMap(states).forEach(({ key, val }) => {
    res[key] = function mappedState () {
      let state = this.$store.state
      let getters = this.$store.getters
      if (namespace) {
          // 获取命名空间模块
        const module = getModuleByNamespace(this.$store, 'mapState', namespace)
        if (!module) {
          return
        }
        state = module.context.state
        getters = module.context.getters
      }
      return typeof val === 'function'
        ? val.call(this, state, getters)
        : state[val]
    }
  })
  return res
})
```