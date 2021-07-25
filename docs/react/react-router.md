# React路由

## 介绍
现代的前端应用程序大多都是SPA（单页应用程序），也就是只有一个HTML页面的应用程序。因为它的用户体验更好，对服务器的压力更小，所以更受欢迎。为了有效的使用单个页面来管理原来多页面的功能，前端路由应运而生。

- 前端路由的功能：让用户从一个视图（页面）导航到另一个视图。
- 前端路由是一套映射规则，在React中，是URL路径与组件的对应关系
- 使用React路由简单来说，就是配置路径和组件（配对）

## 基本使用
1. 安装 yarn add react-router-dom
2. 导入路由的三个核心组件：Router、Route、Link
```js
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
```
3. 使用Router组件包裹整个应用（重要）
```jsx
// Router只使用一次
<Router>
    <div className="App">
        ...
    </div>
</Router>
```
4. 使用Link组件作为导航菜单（路由入口）
```jsx
<Link to="/first">页面一<Link>
```
5. 使用Route组件配置路由规则和要展示的组件（路由出口）
```jsx
// Demo1表示要显示的组件
<Route path="/first" component={Demo1}></Route>
```
