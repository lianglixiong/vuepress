# 第10章 Symbol

## 10.1 概述

ES5的对象属性名都是字符串，这容易造成属性名的冲突。比如，我们使用了一个他人提供的对象，但又想为这个对象添加新的方法（mixin模式）新的方法的名字就有可能与现有的方法产生冲突。如果有一种机制，能够保证每个属性的名字都是独一无二的就好了，这样就能从根本上防止属性名冲突。这就是ES6引入类型Symbol的原因。

ES6引入了一种新的原始数据类型Symbol，表示第一无二的值。它是JavaScript语言的第7种数据类型，前6种分别是：`Undefined`、`Null`、`布尔值（Boolean）`、`字符串（String）`、`数值（Number）`和`对象（Object）`。

Symbol值通过Symbol函数生成。也就是说 ，对象的属性名现在可以有两种类型：一种是原来就有的字符串，另一种就是新增的Symbol类型。只要属性名属于Symbol类型，就是独一无二的，可以保证不会与其他属性名产生冲突。
```js
let s = Symbol();

typeof s
// "symbol"
```
上面的代码中，变量s就是一个独一无二的值。typeof运算符的结果表明变量s是Symbol数据类型，而不是字符串之类的其他类型。

::: warning
Symbol函数前不能使用new命令，否则会报错。这是因为生成的Symbol是一个原始类型的值，不是对象。也就是说，由于Symbol值不是对象，所以不能添加属性。基本上，它是一种类似于字符串的数据类型。
:::

Symbol函数可以接受一个字符串作为参数，表示对Symbol实例的描述，主要是为了在控制台显示，或者转为字符串时比较容易区分。

```js
var s1 = Symbol('foo');
var s2 = Symbol('bar');

s1 // Symbol(foo)
s2 // Symbol(bar)

s1.toString() // "Symbol(foo)"
s2.toString() // "Symbol(bar)"
```
上面的代码中，s1和s2是两个Symbol值。如果不加参数，它们在控制台的输出都是Symbol，不利于区分。有了参数以后，就等于为它们加上了描述，输出时就能够分清到底是哪一个值。

如果Symbol的参数是一个对象，就会调用该对象的toString方法，将其转为字符串，然后才生成一个Symbol值。
```js
const obj = {
    toString() {
        return 'abc';
    }
};
const sym = Symbol(obj);
sym // Symbol(abc)
```
::: warning
Symbol函数的参数只表示对当前Symbol值的描述，因此相同参数的Symbol函数的返回值是不相等的。
:::

```js
// 没有参数的情况
var s1 = Symbol();
var s2 = Symbol();

s1 === s2 // false

// 有参数的情况
var s1 = Symbol('foo');
var s2 = Symbol('foo');

s1 === s2 // false
```
上面的代码中，s1和s2都是Symbol函数的返回值，而且参数相同，但是它们是不相等的。Symbol值不能与其他类型的值进行运算，否则会报错。

```js
var sym = Symbol('My symbol');

"your symbol is " + sym;
// TypeError: Cannot convert a Symbol value to a string
`your symbol is ${sym}`
// TypeError: Cannot convert a Symbol value to a string
```

但是，Symbol值可以显式转为字符串。
```js
var sym = Symbol('My symbol');
String(sym) // 'Symbol(My symbol)'
sym.toString() // 'Symbol(My symbol)'
```

另外，Symbol值也可以转为布尔值，但是不能转为数值。
```js
var sym = Symbol();
Boolean(sym) // true
!sym // false

if (sym) {
    // ...
}

Number(sym) // TypeError
sym + 2; // TypeError
```

## 10.2 作为属性名的Symbol

由于每一个Symbol值都是不相等的，这意味着Symbol值可以作为标识符用于对象的属性名，保证不会出现同名的属性。这对于一个对象由多个模块构成的情况非常有用，能防止某一个键被不小心改写或覆盖。
```js
var mySymbol = Symbol();

// 第一种写法
var a = {};
a[mySymbol] = 'Hello!';

// 第二种写法
var a = {
    [mySymbol]: 'Hello!'
}

// 第三种写法
var a = {};
Object.defineProperty(a, mySymbol, { value: 'Hello!'})

// 以上写法都得到同样的结果
a[mySymbol] // 'Hello!'
```
上面的代码通过方括号结构和`Object.defineProperty`将对象的属性名指定为一个Symbol值。

::: warning
注意，Symbol值作为对象属性名时不能使用点运算符。
:::

```js
var mySymbol = Symbol();
var a = {};

a.mySymbol = 'Hello!';
a[mySymbol] // undefined
a.['mySymbol']// 'Hello!'
```
上面的代码中，因为点运算符后面总是字符串，所以不会读取mySymbol作为标识名所指代的值，导致a的属性名实际上是一个字符串，而不是一个Symbol值。

同理，在对象的内部，使用Symbol值定义属性时，Symbol值必须放在方括号中。
```js
let s = Symbol();

let obj = {
    [s]: function(arg) { console.log(arg)}
}

obj[s](123);
```
上面的代码中，如果s不放在方括号中，该属性的键名就是字符串s，而不是s所代表的Symbol值。

采用增强的对象写法，上面的obj对象可以写得更简洁一些。
```js
let obj = {
    [s](arg) { console.log(arg)}
}
```

Symbol类型还可用于定义一组常量，保证这组常量的值都是不相等的。
```js
log. levels = {
    DEBUG: Symbol('debug'),
    INFO: Symbol('info'),
    WARN: Symbol ('warn')
}

log (log. levels. DEBUG, ' debug message');
log (1og. levels. INFO, ' info message');
```
下面是另外一个例子。
```js
const COLOR_RED = Symbol();
const COLOR_GREEN = Symbol();

function getComplement(color) {
    switch (color) {
        case COLOR_RED:
            return COLOR_GREEN;
        case COLOR_GREEN:
            return COLOR_RED;
        default:
            throw new Error( 'Undefined color') ;
    }
}
```
常量使用Symbol值的最大好处就是，其他任何值都不可能有相同的值了，因此可以保证上面的`switch`语句按设计的方式工作。

::: warning
Symbol值作为属性名时，该属性还是公开属性，不是私有属性。
:::

## 10.3 消除魔术字符串
魔术字符串指的是，在代码之中多次出现、与代码形成强耦合的某一个具体的字符串或数值。风格良好的代码，应该尽量消除魔术字符串，而由含义清晰的变量代替。
```js
function getArea(shape, options) {
    var area = 0;
    switch (shape) {
        case 'Triangle': // 魔术字符串
            area = .5 * options.width * options.height;
            break;
        /* ... more code ... */
    }
    return area;
}

getArea('Triangle', {width: 100, height: 100}); // 魔术字符串
```
上面代码中，字符串`'Triangle'`就是一个魔术字符串。它多次出现，与代码形成“强耦合”，不利于将来的修改和维护。

常用的消除魔术字符串的方法，就是把它写成一个变量。
```js
var  shapeType = {
    triangle: 'Triangle'
}
function getArea(shape, options) {
    var area = 0;
    switch (shape) {
        case shapeType.triangle: // 魔术字符串
            area = .5 * options.width * options.height;
            break;
        /* ... more code ... */
    }
    return area;
}

getArea(shapeType.triangle, {width: 100, height: 100}); // 魔术字符串
```
上面的代码中，我们把`'Triangle'`改写成`shapeType`对象的`triangle`属性，这样就消除了强耦合。

如果仔细分析，可以发现`shapeType.triangle`等于哪个值并不重要，只要确保不会和其他shapeType属性的值冲突即可。因此，这里就很适合改用`Symbol`值。
```js
const shapeType = {
    triangle: Symbol()
}
```
上面的代码中，除了将`shapeType.triangle`的值设为一个`Symbol`，其他地方都不用修改。

## 10.4 属性名的遍历

Symbol作为属性名，该属性不会出现在 `for...in` 、`for...of` 循环中，也不会被`Object.keys()`、`Object.getOwnPropertyNames()`返回。但它也不是私有属性，有一个`Object.getOwnPropertySymbols`方法可以获取指定对象的所有Symbol属性名。

`Object.getOwnPropertySymbols`方法返回一个数组，成员是当前对象的所有用作属性名的Symbol值。
```js
var obj = {};
var a = Symbol('a');
var b = Symbol('b');

obj[a] = 'Hello';
obj[b] = 'World';

var objectSymbols = Object.getOwnPropertySymbols(obj);

objectSymbols
```
下面是另一个例子，将`Object.getOwnPropertySymbols`方法与 `for...in` 循环、`Object.getOwnPropertyNames`方法进行了对比。

```js
var obj = {};
var foo = Symbol("foo");

Object.defineProperty(obj, foo, {
    value: "foobar"
})

for (var i in obj) {
    console.log(i); // 无输出
}

Object.getOwnPropertyNames(obj);
// []

Object.getOwnPropertySymbols(obj);
// [Symbol(foo)]
```
上面的代码中，使用`Object.getOwnPropertyNames`方法得不到Symbol属性名，需要使用`Object.getOwnPropertySymbols`方法。

另一个新的API -> `Reflect.ownkeys`方法可以返回所有类型的键名，包括常规键名和Symbol键名。
```js
let obj = {
    [Symbol('my_key')]: 1,
    enum: 2,
    nonEnum: 3
}

Reflect.ownKeys(obj)
// ["enum", "nonEnum", Symbol(my_key)]
```
以Symbol值作为名称的属性不会被常规方法遍历。我们可以利用这个特性为对象定义一些非私有但又希望只用于内部的方法。
```js
var size = Symbol('size');

class Collection {
    constructor() {
        this[size] = 0;
    }
    add(item) {
        this[this[size]] = item;
        this[size]++;
    }
    static sizeOf(instance) {
        return instance[size];
    }
}

var x = new Collection();
Collection.sizeOf(x) // 0

x.add('foo');
Collection.sizeOf(x) // 1

Object.keys(x) // ["0"]
Object.getOwnPropertyNames(x) // ["0"]
Object.getOwnPropertySymbols(x) // [Symbol(size)]
```
上面的代码中，对象x的size属性是一个Symbol值，所以`Object.keys(x)`、`Object.getOwnPropertyNames(x)`都无法获取它。这就造成了一种非私有的内部方法的效果。

## 10.5 Symbol.for()、Symbol.keyFor()
有时，我们希望重新使用同一个Symbol值，`Symbol.for`方法可以做到这一点。它接受一个字符串作为参数，然后搜索有没有以该参数作为名称的Symbol值。如果有，就返回这个Symbol值，否则就新建并返回一个以该字符串为名称的Symbol值。
```js
var s1 = Symbol.for('foo');
var s2 = Symbol.for('foo');

s1 === s2 // true
```
上面的代码中，s1和s2都是Symbol值，但它们都是同样参数的`Symbol.for`方法生成的，所以实际上是同一个值。

`Symbol.for()`与`Symbol()`这两种写法都会生成新的Symbol。它们的区别是，前者会被登记在全局环境中供搜索，而后者不会。`Symbol.for()`不会在每次调用时都返回一个新的Symbol类型的值，而是会先检查给定的key是否已经存在，如果不存在才会新建一个值。比如，如果调用`Symbol.for("cat")`30次，每次都会返回同一个Symbol值，但是调用`Symbol("cat")`30次则会返回30个不同的Symbol值。

```js
Symbol.for("bar") === Symbol.for("bar")
// true

Symbol("bar") === Symbol("bar")
// false
```
上面的代码中，由于Symbol()写法没有登记机制，所以每次调用都会返回一个不同的值。Symbol.keyFor方法返回一个已登记的Symbol类型值得key。
```js
var s1 = Symbol.for("foo");
Symbol.keyFor(s1) // "foo"

var s2 = Symbol("foo");
Symbol.keyFor(s2) // undefined
```
上面的代码中，变量s2属于未登记的Symbol值，所以返回undefined。

::: warning
`Symbol.for`为Symbol值登记的名字是全局环境的，可以在不同的`iframe`或`service worker`中取到同一个值。
:::

```js
iframe = document.createElement('iframe');
iframe.src = String(window.location);
document.body.appendChild(iframe);

iframe.contentWindow.Symbol.for('foo') === Symbol.for('foo')
// true
```
上面的代码中，`iframe`窗口生成的Symbol值可以在主页面得到。

## 10.6 模块的Singleton模式

`Singleton`模式指的是，调用一个类并且在任何时候都返回同一个实例。

对于Node来说，模块文件可以看成是一个类。怎么保证每次执行这个模块文件返回的都是同一个实例呢？

很容易想到，可以把实例放到顶层对象global中。
```js
// mod.js
function A() {
    this.foo = 'hello';
}

if (!global._foo) {
    global._foo = new A();
}

module.exports = global._foo;
```
然后，加载上面的mod.js。
```js
var a = require('./mod.js');
console.log(a.foo);
```
上面的代码中，变量a任何时候加载的都是A的同一个实例。

但是，这里有一个问题，全局变量`global._foo`是可写的，任何文件都可以修改。
```js
var a = require('./mod.js');
gloal._foo = 123;
```
上面的代码会使别的脚本在加载mod.js时都产生失真。

为了防止这种情况出现，我们可以使用Symbol。
```js
// mod.js
const FOO_KEY = Symbol.for('foo');

function A() {
    this.foo = 'hello';
}

if(!global[FOO_KEY]) {
    global[FOO_KEY] = new A();
}

module.exports = global[FOO_KEY];
```
上面的代码中，可以保证`global[FOO_KEY]`不会被无意间覆盖，但还是可以被改写。

```js
var a = require('./mod.js');
global[Symbol.for('foo')] = 123;
```

如果键名使用Symbol方法生成，那么外部将无法引用这个值，当然也就无法改写。
```js
// mod.js
const FOO_KEY = Symbol('foo');

// 后面代码相同
```
上面的代码将导致其他脚本都无法引用`FOO_KEY`。但这样也有一个问题，多次执行这个脚本时，每次得到的`FOO_KEY`都是不一样的。虽然Node会将脚本的执行结果缓存，一般情况下不会多次执行同一个脚本，但是用户可以手动清除缓存，所以也不是完全可靠。

## 10.7 内置的Symbol值

除了定义自己使用的Symbol值，ES6还提供了11个内置的Symbol值，指向语言内部使用的方法。

### 10.7.1 Symbol.hasInstance

对象的`Symbol.hasInstance`属性指向一个内部方法，对象使用`instanceof`运算符时会调用这个方法，判断该对象是否为某个构造函数的实例。比如，`foo instance Foo`在语言内部实际调用的是`FOO[Symbol.hasInstance](foo)`。
```js
class MyClass {
    [Symbol.hasInstance](foo) {
        return foo instanceof Array;
    }
}

[1,2,3] instanceof new MyClass() // true
```
上面的代码中，MyClass是一个类，`new MyClass()`会返回一个实例。该实例的`Symbol.hasInstance`方法会在进行`instanceof`运算时自动调用，判断左侧的运算子是否为Array的实例。

下面时另一个例子。
```js
class Even {
    static [Symbol.hasInstance](obj) {
        return Number(obj) % 2 === 0;
    }
}

1 instanceof Even // false
2 instanceof Even // true
12345 instanceof Even // false
```

### 10.7.2 Symbol.isConcatSpreadable

对象的`Symbol.isConcatSpreadable`属性等于一个布尔值，表示该对象使用`Array.prototype.concat`时是否可以展开。
```js
let arr1 = ['c', 'd'];
['a', 'b'].concat(arr1,'e'); // ["a", "b", "c", "d", "e"]
arr1[Symbol.isConcatSpreadable] // undefined

let arr2 = ['c', 'd']; 
arr2[Symbol.isConcatSpreadable] = false;
['a', 'b'].concat(arr1,'e'); // ["a", "b", ["c", "d"], "e"]
```
上面的代码说明，数组的默认行为时可以展开的。`Symbol.isConcatSpreadable`属性等于`true`或`undefined`，都有这个效果。

类似数组的对象也可以展开，但它的`Symbol.isConcatSpreadable`属性默认为`false`，必须手动打开。
```js
let obj = { length: 2, 0: 'c', 1: 'd' };
['a', 'b'].concat(obj, 'e') // ["a", "b", obj, "e"]

obj[Symbol.isConcatSpreadable] = true;
['a', 'b'].concat(obj, 'e') // ["a", "b", "c", "d", "e"]
```
对于一个类而言，`Symbol.isConcatSpreadable`属性必须写成实例的属性。
```js
class A1 extends Array {
    constructor(args) {
        super(args);
        this[Symbol.isConcatSpreadable] = true;
    }
}
class A2 extends Array {
    constructor(args) {
        super(args);
        this[Symbol.isConcatSpreadable] = false;
    }
}
let a1 = new A1();
a1[0] = 3;
a1[1] = 4;

let a2 = new A2();
a2[0] = 5;
a2[1] = 6;

[1, 2].concat(a1).concat(a2); // [1, 2, 3, 4, [5, 6]]
```
上面的代码中，类A1是可扩展的，类A2是不可扩展的，所以使用`concat`时有不一样的结果。