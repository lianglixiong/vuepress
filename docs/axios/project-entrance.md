# 入口文件

``` js
// lib/axios.js

'use strict';

var utils = require('./utils');
var bind = require('./helpers/bind');
var Axios = require('./core/Axios');
var mergeConfig = require('./core/mergeConfig');
var defaults = require('./defaults');

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
	/**
	 * 创建axios实例
	 * 原型对象上有一些用来发请求的方法：get()/post()/put()/delete/request()
	 * 自身上有两个重要属性：defaults/interceptors
	 */
    var context = new Axios(defaultConfig);
    var instance = bind(Axios.prototype.request, context);

    // 将axios.prototype复制到实例
    utils.extend(instance, Axios.prototype, context);

    // 将上下文复制到实例
    utils.extend(instance, context);

    return instance;
}

// 创建要导出的默认实例
var axios = createInstance(defaults);

// 公开Axios类以允许类继承
axios.Axios = Axios;

// 用于创建新实例的工厂
axios.create = function create(instanceConfig) {
    return createInstance(mergeConfig(axios.defaults, instanceConfig));
};

// Expose Cancel & CancelToken
axios.Cancel = require('./cancel/Cancel');
axios.CancelToken = require('./cancel/CancelToken');
axios.isCancel = require('./cancel/isCancel');

// Expose all/spread
axios.all = function all(promises) {
    return Promise.all(promises);
};
axios.spread = require('./helpers/spread');

// Expose isAxiosError
axios.isAxiosError = require('./helpers/isAxiosError');

module.exports = axios;

window.axios = axios; //设置全局属性给script标签引用

// 允许在TypeScript中使用默认导入语法
module.exports.default = axios;

```

入口文件主要做了以下几件事：
1. 创建aioxs实例

## 创建axios函数

``` js
function createInstance(defaultConfig) {
	/**
	 * 创建axios实例
	 * 原型对象上有一些用来发请求的方法：get()/post()/put()/delete/request()
	 * 自身上有两个重要属性：defaults/interceptors
	 */
    var context = new Axios(defaultConfig);
    var instance = bind(Axios.prototype.request, context);

    // 将axios.prototype复制到实例
    utils.extend(instance, Axios.prototype, context);

    // 将上下文复制到实例
    utils.extend(instance, context);

    return instance;
}

// 创建要导出的默认实例
var axios = createInstance(defaults);
```
createInstance函数主要实现了：
1. 创建Axios构造函数实例
``` js
var context = new Axios(defaultConfig);
```
2. 返回一个绑定Axios.prototype.request的函数,为了能axios(config)调用,等同于axios.request(config)
``` js
var instance = bind(Axios.prototype.request, context);
```
3. 拷贝Axios.prototype上的可枚举属性和方法到instance(aioxs)函数,实现aioxs.get、axios.post等调用
``` js
utils.extend(instance, Axios.prototype, context);
```
4. 拷贝Axios构造函数实例上的属性和方法到instance(axios)
``` js
utils.extend(instance, context);
```
5. 返回一个新函数

## 给axios函数挂载属性和方法

``` js
// 公开Axios类以允许类继承
axios.Axios = Axios;

// Factory for creating new instances
axios.create = function create(instanceConfig) {
    return createInstance(mergeConfig(axios.defaults, instanceConfig));
};

// Expose Cancel & CancelToken
axios.Cancel = require('./cancel/Cancel');
axios.CancelToken = require('./cancel/CancelToken');
axios.isCancel = require('./cancel/isCancel');

// Expose all/spread
axios.all = function all(promises) {
    return Promise.all(promises);
};
axios.spread = require('./helpers/spread');

// Expose isAxiosError
axios.isAxiosError = require('./helpers/isAxiosError');
```
### 挂载Axios类
``` js
axios.Axios = Axios;
```
公开Axios类以允许类继承

### 挂载create方法
``` js
axios.create = function create(instanceConfig) {
    return createInstance(mergeConfig(axios.defaults, instanceConfig));
};
```
看到这里或许会有疑问？不是已经有个aioxs(config)方法了吗,为什么还多此一举，且看下面用法：

用axios发送请求：
``` js
axios({
    method:'POST',
    url:'http://localhost:8000/login',
    data
})
```

用axios.create()创建一个新的axios发请求：
``` js
cosnt requset = axios.create({
    //基础路径
    baseURL:'http://localhost:8000/'
})

requset({
    method:'POST',
    url:'/login',
    data
})
```
可以看到是可以简化路径写法，当基础路径发生变化时方便修改，有利于维护