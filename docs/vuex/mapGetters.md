# mapGetters
> vuex官方解释：mapGetters 辅助函数仅仅是将 store 中的 getter 映射到局部计算属性：


## 用法
- 数组用法
```js
import { mapGetters } from 'vuex'

export default {
  // ...
  computed: {
  // 使用对象展开运算符将 getter 混入 computed 对象中
    ...mapGetters([
      'doneTodosCount',
      'anotherGetter',
      // ...
    ])
  }
}
```
- 对象用法
```js
...mapGetters({
  // 把 `this.doneCount` 映射为 `this.$store.getters.doneTodosCount`
  doneCount: 'doneTodosCount'
})
```

## 源码解析

解析传入的参数，返回res对象，里面有对应参数的方法
```js
export const mapGetters = normalizeNamespace((namespace, getters) => {
  const res = {}
//   if (__DEV__ && !isValidMap(getters)) {
//     console.error('[vuex] mapGetters: mapper parameter must be either an Array or an Object')
//   }
  normalizeMap(getters).forEach(({ key, val }) => {
    val = namespace + val
    res[key] = function mappedGetter () {
    //   if (namespace && !getModuleByNamespace(this.$store, 'mapGetters', namespace)) {
    //     return
    //   }
    //   if (__DEV__ && !(val in this.$store.getters)) {
    //     console.error(`[vuex] unknown getter: ${val}`)
    //     return
    //   }
      return this.$store.getters[val]
    }
  })
  return res
})
```
normalizeNamespace函数作用如下：

规范化命名空间
- 当传入的namespace是字符串时，说明该模块设置namespaced为true,需要给namespace判断拼接'/'
- 当传入的不是字符串，说明没有命名空间，该参数就是map，需要设置map为namespace，并且重置namespace为空
```js
function normalizeNamespace (fn) {
  return (namespace, map) => {
    if (typeof namespace !== 'string') {
      map = namespace
      namespace = ''
    } else if (namespace.charAt(namespace.length - 1) !== '/') {
      namespace += '/'
    }
    return fn(namespace, map)
  }
}
```

normalizeMap函数作用如下：

- 把这种类型参数[1, 2, 3] 转换成 [ { key: 1, val: 1 }, { key: 2, val: 2 }, { key: 3, val: 3 } ]
- 或者把这种类型参数{a: 1, b: 2, c: 3} 转换成 [ { key: 'a', val: 1 }, { key: 'b', val: 2 }, { key: 'c', val: 3 } ]
```js
function normalizeMap (map) {
//   if (!isValidMap(map)) {
//     return []
//   }
  return Array.isArray(map)
    ? map.map(key => ({ key, val: key }))
    : Object.keys(map).map(key => ({ key, val: map[key] }))
}
```