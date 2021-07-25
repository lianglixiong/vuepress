# React

## 4 组件性能优化

### 4.1 减轻state
跟渲染无关的数据不必绑定在state上面，直接绑定在实例上面

### 4.2 避免不必要的重新渲染
- 组件更新机制：父组件更新会引起子组件也被更新，这种思路很清晰
- 问题：子组件没有任何变化时也会重新渲染
- 如何避免不必要的重新渲染呢？
- 解决方式：使用钩子函数`shouldComponentUpdate(nextProps,nextState)`
- 作用：通过返回值决定该组件是否重新渲染，返回true表示重新渲染，false表示不重新渲染
- 触发时机：更新阶段的钩子函数，组件重新渲染前执行（shouldComponentUpdate -> render）
```js
class Counter extends React.Component {
    // 组件初始挂载后
    componentDidUpdate(prevProps) {
        console.log("上一次的数据",prevProps)
    }
    // 组件卸载前
    componentWillUnmount() {
        console.log("--Counter组件-- 生命周期钩子函数：componentWillUnmount")
    }
    shouldComponentUpdate(nextProps,nextState) {
        // 根据条件决定是否重新渲染组件
    }
    render() {
        console.log("--Counter组件-- 生命周期钩子函数：render")
        return (
            <div>
                <h1>统计豆豆被打次数：{this.props.count}</h1>
                <h2>{this.props.name}</h2>
            </div>
        );
    }
}
```

### 4.3 纯组件
- 说明：纯组件内部的对比时shallow compare（浅层对比，例如pureComponent）
- 对于值类型来说：比较两个值是否相同（直接赋值即可，没有坑）
- 对于引用类型来说：只比较对象的引用（地址）是否相同

::: warning
state或props中属性值为引用类型时，应该创建新数据，不要直接修改原数据！
:::

## 5 虚拟DOM和Diff算法

**执行过程**
1. 初次渲染时，React会根据初始数据state（Model），创建一个虚拟DOM对象（树）。
2. 根据虚拟DOM生成真正的DOM，渲染到页面中。
3. 当数据变化后（setState()），重新根据新的数据创建新的虚拟DOM对象（树）。
4. 与上一次得到的虚拟DOM对象，使用Diff算法对比（找不同），得到需要更新的内容。
5. 最终，React只将变化的内容更新（patch）到DOM中，重新渲染到页面。
