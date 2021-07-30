# 原型、原型链

## 四个规则
我们先来了解下面引用类型的四个规则：
1. 引用类型，都具有对象特性，即可自由扩展属性。
2. 引用类型，都有一个隐式原型 `__proto__` 属性，属性值是一个普通的对象。
3. 引用类型，隐式原型 `__proto__` 的属性值指向它的构造函数的显式原型 prototype 属性值。
4. 当你试图得到一个对象的某个属性时，如果这个对象本身没有这个属性，那么它会去它的隐式原型 `__proto__`（也就是它的构造函数的显式原型 `prototype`）中寻找。

> 引用类型：Object、Array、Function、Date、RegExp。这里我姑且称 proto 为隐式原型

下面我们逐一验证上面几个规则，就会慢慢地理解原型和原型链。

#### 规则一
引用类型，都具有对象特性，即可自由扩展属性：
```js
const obj = {}
const arr = []
const fn = function () {}

obj.a = 1
arr.a = 1
fn.a = 1

console.log(obj.a) // 1
console.log(arr.a) // 1
console.log(fn.a) // 1
```
> 这个规则应该比较好理解，Date 和 RegExp 也一样，就不赘述了。

#### 规则二
引用类型，都有一个隐式原型 `__proto__` 属性，属性值是一个普通的对象：
```js
const obj = {};
const arr = [];
const fn = function() {}

console.log('obj.__proto__', obj.__proto__);
console.log('arr.__proto__', arr.__proto__);
console.log('fn.__proto__', fn.__proto__);
```

#### 规则三
引用类型，隐式原型 `__proto__` 的属性值指向它的构造函数的显式原型 `prototype` 属性值：
```js
const obj = {};
const arr = [];
const fn = function() {}

obj.__proto__ == Object.prototype // true
arr.__proto__ === Array.prototype // true
fn.__proto__ == Function.prototype // true
```

#### 规则四
当你试图得到一个对象的某个属性时，如果这个对象本身没有这个属性，那么它会去它的隐式原型 `__proto__`（也就是它的构造函数的显式原型 `prototype`）中寻找：
```js
const obj = { a:1 }
obj.toString
// ƒ toString() { [native code] }
```
首先， obj 对象并没有 toString 属性，之所以能获取到 toString 属性，是遵循了第四条规则，从它的构造函数 Object 的 prototype 里去获取。

## 一个特例
我试图想推翻上面的规则，看下面这段代码：
```js
function Person(name) {
  this.name = name
  return this // 其实这行可以不写，默认返回 this 对象
}

var nick = new Person("nick")
nick.toString
// ƒ toString() { [native code] }
```
按理说， nick 是 Person 构造函数生成的实例，而 Person 的 prototype 并没有 toString 方法，那么为什么， nick 能获取到 toString 方法？

这里就引出 原型链 的概念了， nick 实例先从自身出发检讨自己，发现并没有 `toString` 方法。找不到，就往上走，找 Person 构造函数的 `prototype` 属性，还是没找到。构造函数的 `prototype` 也是一个对象嘛，那对象的构造函数是 `Object` ，所以就找到了 `Object.prototype` 下的 `toString` 方法。

> 上述寻找的过程就形成了原型链的概念


## 一张图片
用图片描述原型链：

![Image from alias](~@assets/img/640.png)

最后一个 `null`，设计上是为了避免死循环而设置的, `Object.prototype` 的隐式原型指向 `null`。


## 一个方法
`instanceof` 运算符用于测试构造函数的 `prototype` 属性是否出现在对象原型链中的任何位置。`instanceof` 的简易手写版，如下所示：


```js
// 变量R的原型 存在于 变量L的原型链上
function instance_of (L, R) {    
  // 验证如果为基本数据类型，就直接返回 false
  const baseType = ['string', 'number', 'boolean', 'undefined', 'symbol']
  if(baseType.includes(typeof(L))) { return false }

  let RP = R.prototype;  // 取 R 的显示原型
  L = L.__proto__; // 取 L 的隐式原型
  while (true) {
    if (L === null) { // 找到最顶层
      return false;
    }
    if (L === RP) { // 严格相等
      return true;
    }
    L = L.__proto__;  // 没找到继续向上一层原型链查找
  }
}
```
我们再来看下面这段代码：
```js
function Foo(name) {
  this.name = name;
}
var f = new Foo('nick')

f instanceof Foo // true
f instanceof Object // true
```
上述代码判断流程大致如下：

1. `f instanceof Foo`：f 的隐式原型 `__proto__` 和 Foo.prototype ，是相等的，所以返回 true 。

2. `f instanceof Object`：f 的隐式原型 `__proto__` ，和 Object.prototype 不等，所以继续往上走。f 的隐式原型 `__proto__` 指向 Foo.prototype ，所以继续用 `Foo.prototype.__proto__` 去对比 `Object.prototype` ，这会儿就相等了，因为 `Foo.prototype` 就是一个普通的对象。

## 总结
通过四个特性、一个例子、一张图片、一个方法，大家应该对原型和原型链的关系有了大概的认知。我的认知就是，原型链就是一个过程，原型是原型链这个过程中的一个单位，贯穿整个原型链。