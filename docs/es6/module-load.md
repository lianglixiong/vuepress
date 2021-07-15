# 第23章 Module的加载实现

## 23.1 浏览器加载

### 23.1.1 传统方法

在HTML网页中，浏览器通过`<script>`标签加载JavaScript脚本。
```js
<!-- 页面内嵌的脚本 -->
<script type="application/javascript">
    // module code
</script>

<!-- 外部脚本 -->
<script type="application/javascript" src="path/to/myModule.js">
</script>
```
上面的代码中，由于浏览器脚本的默认语言是JavaScript，因此`type="application/javascript"`可以省略。

默认情况下，浏览器同步加载JavaScript脚本，即渲染引擎遇到`<script>`标签就会停下来，等到脚本执行完毕再继续向下渲染。如果是外部脚本，还必须加入脚本下载的时间。

如果脚本体积很大，下载和执行的时间就会很长，因此造成浏览器堵塞，用户会感觉到浏览器“卡死”了，没有任何响应。这显然是很不好的体验，所以浏览器允许脚本异步加载，下面就是两种异步加载的语法。
```js
<script src="path/to/myModule.js" defer></script>
<script src="path/to/myModule.js" async></script>
```
上面代码中，`<script>`标签打开defer或async属性，脚本就会异步加载。渲染引擎遇到这一行命令就会开始下载外部脚本，但不会等它下载和执行，而是直接执行后面的命令。

defer和async的区别是，前者要等到整个页面正常渲染结束才会执行，而后者一旦下载完成，渲染引擎就会中断渲染，执行这个脚本以后再继续渲染。用一句话来说，defer是“渲染完再执行”，async是“下载完就执行”。另外，如果有多个defer脚本，则会按照它们在页面出现的顺序加载，而多个async脚本是不能保证加载顺序的。

### 23.1.2 加载规则

浏览器加载ES6模块时也使用`<script>`标签，但是要加入`type="module"`属性。
```js
<script type="module" src="foo.js"></script>
```
上面的代码在网页中插入了一个模块foo.js，由于type属性设为module，所以浏览器知道这是一个ES6模块。

对于带有`type="module"`的`<script>`，浏览器都是异步加载的，不会造成浏览器堵塞，即等到整个页面渲染完再执行模块脚本，等于于打开了`<script>`标签的defer属性。
```js
<script type="module" src="foo.js"></script>
// 等同于
<script type="module" src="foo.js" defer></script>
```
`<script>`标签的async属性也可以打开，这时只要加载完成，渲染引擎就会中断渲染立即执行。执行完成后，再恢复渲染、
```js
<script type="module" src="foo.js" async></script>
```

ES6模块也允许内嵌在网页中，语法行为与加载外部脚本完全一致。
```js
<script type="module">
    import utils from './utils.js';
    // other code
</script>
```

对于外部的脚本（上例是foo.js），有几点需要注意。

- 代码是在模块作用域之中运行，而不是在全局作用域中运行。模块内部的顶层变量是外部不可见的。
- 模块脚本自动采用严格模式，无论有没有声明use strict。
- 模块之中可以使用import命令加载其他模块（.js后缀不可省略，需要提供绝对URL或相对URL），也可以使用export命令输出对外接口。
- 在模块之中，顶层的this关键字返回undefined，而不是指向window。也就是说，在模块顶层使用this关键字是无意义的。
- 同一个模块如果加载多次，将只执行一次。

下面是一个示例模块。
```js
import utils from 'https://example.com/js/utils.js';

const x = 1;

console.log(x === window.x); // false
console.log(this === undefined); // true

delete x;  // 句法错误，严格模式禁止删除变量
```
利用顶层的this等于undefined这个语法点，可以检测当前代码是否在ES6模块之中。
```js
const isNotModuleScript = this !== undefined;
```

## 23.2 ES6模块与CommonJS模块的差异

讨论Node加载ES6模块之前，必须了解ES6模块与CommonJS模块的差异，具体的两大差异如下。

- CommonJS模块输出的是一个值的复制，ES6模块输出的是值的引用。
- CommonJS模块是运行时加载，ES6模块是编译时输出接口。

第二个差异是因为CommonJS加载的是一个对象（即module.export属性），该对象只有在脚本运行结束时才会生成。而ES6模块不是对象，它的对外接口只是一种静态定义，在代码静态解析阶段就会生成。

下面重点解释第一个差异。

CommonJS模块输出的是值的复制，也就是说，一旦输出一个值，模块内部的变化就影响不到这个值。请看下面这个模块文件lib.js的例子。
```js
// lib.js
var counter = 3;
function incCounter() {
    counter++;
}
module.exports = {
    counter: counter,
    incCounter: incCounter
}
```
上面的代码输出内部变量counter和改写这个变量的内部方法incCounter。然后，在mian.js里面加载这个模块。
```js
// main.js
var mod = require('./lib');

console.log(mod.counter); // 3
mod.incCounter();

console.log(mod.counter); // 3
```
上面的代码说明，lib.js模块加载以后，它的内部变化就影响不到输出的mod.counter了。这是因为mod.counter是一个原始类型的值，会被缓存。除非写成一个函数，否则得到内部变动后的值。
```js
// lib.js
var counter = 3;
function incCounter() {
    counter++;
}
module.exports = {
    get counter() {
        return counter
    },
    incCounter: incCounter
};
```
上面的代码中，输出的counter属性实际上是一个取值器函数。现在再执行main.js就可以正确读取内部变量counter的变动了
```js
node main.js

// 3
// 4
```

ES6模块的运行机制与CommonJS不一样。JS引擎对脚本静态分析的时候，遇到模块加载命令import就会生成一个只读引用。等到脚本真正执行时，再根据这个只读引用到被加载的模块中取值。换句话说，ES6的import有点像Unix系统的“符号连接”，原始值变了，import加载的值也会跟着变。因此，ES6模块是动态引用，并且不会缓存值，模块里面的变量绑定其所在的模块。

还是以上面的代码为例。
```js
// lib.js
export let counter = 3;
export function incCounter() {
    counter++;
}

// main.js
import { counter, incCounter } from './lib';
console.log(counter); // 3
incCounter();

console.log(counter); // 4
```
上面的代码说明，ES6模块输入的变量counter是活的，完全反应其所在模块lib.js内部的变化。

再举一个出现在export一节中的例子。
```js
// m1.js
export var foo = 'bar';
setTimeout(() => foo = 'baz', 500);

// m2.js
import { foo } from './m1.js';
console.log(foo);
setTimeout(() => {
    console.log(foo);
},500);
```
上面的代码中，m1.js的变量foo在刚加载时是bar，过了500ms又变为baz。

来看一下m2.js能否正确读取这个变化。
```js
$ babel-node m2.js

bar
baz
```
上面的代码表明，ES6模块不会缓存运行结果，而是动态地去被加载的模块取值，并且变量总是绑定其所在的模块。

由于ES6输入的模块变量只是一个“符号连接”，所以这个变量是只读的，对它进行重新赋值会报错。
```js
// lib.js
export let obj = {};

// main.js
import { obj } from './lib';

obj.prop = 123; // ok
obj = {}; // TypeError
```
上面的代码中，main.js从lib.js输入变量obj，可以对obj添加属性，但是重新赋值就会报错。因为变量obj指向的地址是只读的，不能重新赋值，这就好比main.js创造了一个名为obj的const变量。

最后，export通过接口输出的是同一个值。不同的脚本加载这个接口得到的都是同样实例。
```js
// mod.js
function C() {
    this.sum = 0;
    this.add = function() {
        this.sum += 1;
    };
    this.show = function() {
        console.log(this.sum);
    }
}

export let c = new C();
```
上面的脚本mod.js输出的是一个C的实例。不同的脚本加载这个模块得到的都是同一个实例。

```js
// x.js
import { c } from './mod';
c.add();

// y.js
import { c } from './mod';
c.show();

// main.js
import './x';
import './y';
```
现在执行main.js，输出的是1。
```js
$ babel-node main.js
1
```
这就证明了x.js和y.js加载的都是C的同一个实例。

## 23.3 Node加载

### 23.3.1 概述
Node对ES6模块的处理比较麻烦，因为它有自己的CommonJS模块格式，与ES6模块格式是不兼容的。目前的解决方案是，将两者分开，ES6模块和CommonJS采用各自的加载方案。

在静态分析阶段，一个模块脚本只要有一行import和export语句，Node就会认为该脚本为ES6模块，否则就为CommonJS模块。如果不输出任何接口，但是希望被Node认为是ES6模块，可以在脚本中加上如下语句。
```js
export {};
```
上面的命令并不是输出一个空对象，而是不输出任何接口的ES6标准写法。

如果不指定绝对路径，Node加载ES6模块会依次寻找以下脚本，与require()的规则一致。
```js
import './foo';

// 依次寻找
// ./foo.js
// ./foo/package.json
// ./foo/index.js

import 'baz';
// 依次寻找
// ./node_modules/baz.js
// ./node_modules/baz/package.json
// ./node_modules/baz/index.js
// 寻找上一级目录
// ../node_modules/baz.js
// ../node_modules/baz/package.json
// ../node_modules/baz/index.js
// 再寻找上一级目录
```
ES6模块之中，顶层的this指向undefined，CommonJS模块的顶层this指向当前模块，这是两者的一个重大差异。

### 23.3.2 import命令加载CommonJS模块

`Node`采用`ConmonJS`模块格式，模块的输出都定义在`module.exports`属性上面。在Node环境中，使用import命令加载CommonJS模块，Node会自动将`module.exports`属性当作模块的默认输出，即等同于`export default`。

下面是一个CommonJS模块。
```js
// a.js
module.exports = {
    foo: 'hello',
    bar: 'world'
}

// 等同于
export default {
    foo: 'hello',
    bar: 'world'
}
```

`import`命令加载上面的模块，`module.exports`会被视为默认输出。
```js
// 写法一
import baz from './a';
// baz = {foo: 'hello', bar: 'world'}

// 写法二
import { default as baz } from './a';
// baz = {foo: 'hello', bar: 'world'}
```
如果采用整体输入的写法（`import * as from someModule`），`default`会取代`module.exports`作为输入的接口。
```js
import * as baz from './a';
// baz = {
//    get default() {return module.exports},
//    get foo() {return this.default.foo}.bind(baz),
//    get bar() {return this.default.bar}.bind(baz)
//}
```
上面的代码中，this.default取代了module.exports。需要注意的是，Node会自动为baz添加default属性，通过baz.default获取module.exports。
```js
// b.js
module.exports = null;

// es.js
import foo from './b';
// foo = null

import * as bar from './b';
// bar = {default: null}
```
上面的代码中，es.js采用第二种写法时，要通过bar.default这样的写法才能获取`module.exports`。

下面是另一个例子。
```js
// c.js
module.exports = function two() {
    return 2;
}

// es.js
import foo from './c';
foo(); // 2

import * as bar from './c';
bar.default(); // 2
bar(); // throws, bar is not a function
```
上面的代码中，bar本身是一个对象，不能当作函数调用，只能通过bar.default调用。

CommonJS模块的输出缓存机制在ES6加载方式下依然有效。
```js
// foo.js
module.exports = 123
setTimeout(_ => module.exports = null);
```
上面的代码中，对于加载foo.js的脚本，module.exports将一直是123，而不会变成null。

由于ES6模块是编译时确定输出接口，CommonJS模块是运行时确定输出接口，所以采用import命令加载CommonJS模块时，不允许采用下面的写法。
```js
import { readfile } from 'fs';
```
上面的写法不正确，因为fs是CommonJS格式，只有在运行时才能确定readfile接口，而import命令要求编译时就确定这个接口。解决办法就是改为整体输入。
```js
import * as express from 'express';
const app = express.default();
// 或者
import express from 'express';
const app = express();
```

### 23.3.3 require命令加载ES6模块

采用require命令加载ES6模块时，ES6模块的所有输出接口都会成为输入对象的属性。
```js
// es.js
let foo = { bar: 'my-default'};
export default foo;
foo = null;

// cjs.js
const es_namespace = require('./es');
console.log(es_namespace.default);
// { bar: 'my-default'}
```
上面的代码中，default接口变成了es_namespace.default属性。另外，由于存在缓存机制，es.js对foo的重新赋值没有在模块外部反映出来。

下面是另一个例子。
```js
// es.js
export let foo = { bar: 'my-default'};
export { foo as bar};

export function f() {};
export class c {};

// cjs.js
const es_namespace = require('./es')
// es_namespace = {
//    get foo() { return foo;}
//    get bar() { return foo;}
//    get f() { return f;}
//    get c() { return c;}
// }
```

## 23.4 循环加载

“循环加载”（circular dependence）指的是，a脚本的执行依赖b脚本，而b脚本的执行又依赖a脚本。
```js
// a.js
var b = require('b');

// b.js
var a = require('a');
```
通常，“循环加载”表示存在强耦合，如果处理不好，还可能导致递归加载，使得程序无法执行，因此应该避免出现这种现象。

但是实际上，这是很难避免的，尤其是依赖关系复杂的大项目中很容易出现a依赖b，b依赖c，c又依赖a这样的情况。这意味着，模块加载机制必须考虑“循环加载”的情况。

对于JavaScript语言来说，目前最常见的两种模块格式CommonJS和ES6在处理“循环加载”时的方法是不一样的，返回的结果也不一样。

### 23.4.1 CommonJS模块的加载原理

介绍ES6如何处理“循环加载”之前，先介绍目前最流行的CommonJS模块格式的加载原理。

CommonJS的一个模块就是一个脚本文件。require命令第一次加载该脚本时就会执行整个脚本，然后在内存中生成一个对象。
```js
{
    id: '...',
    exports: {},
    loaded: true,
    ...
}
```
上面的代码就是Node内部加载模块后生成的一个对象。该对象的id属性是模块名，exports属性是模块输出的各个接口，loaded属性是一个布尔值，表示该模块的脚本是否执行完毕。其他还有很多属性，这里都省略了。

以后需要用到这个模块时就会到exports属性上面取值。即使再次执行require命令，也不会再次执行该模块，而是到缓存之中取值。也就是说，CommonJS模块无论加载多少次，都只会在第一次加载时运行一次，以后再加载时就返回第一次运行的结果，除非手动清除系统缓存。

### 23.4.2 CommonJS模块的循环加载

CommonJS模块的重要特性是加载时执行，即脚本代码在require的时候就会全部执行。
一旦出现某个模块被“循环加载”，就只输出已经执行的部分，还未执行的部分不会输出。

让我们来看一下Node官方文档里面的例子。脚本文件a.js代码如下。
```js
// a.js
exports.done = false;
var b = require('./b.js');
console.log('在a.js之中，b.done = %j', b.done);
exports.done = true;
console.log('a.js执行完毕');
```
上面的代码之中，a.js脚本先输出一个done变量，然后加载另一个脚本文件b.js。注意，此时a.js代码就停在这里，等待b.js执行完毕再往下执行。

再看b.js的代码。
```js
// b.js
exports.done = false;
var a = require('./a.js');
console.log('在b.js之中，a.done = %j', a.done);
exports.done = true;
console.log('b.js执行完毕');
```
上面的代码中，b.js执行到第二行就会加载a.js，这时就发生了“循环加载”，系统会去a.js模块对应的对象的exports属性中取值，可是因为a.js还没有执行完，因此从exports属性中只能取回已经执行的部分，而不是最后的值。

a.js已经执行的部分只有以下一行。
```js
exports.done = false;
```
因此，对于b.js来说，它从a.js只输入一个变量done，值为false。

然后，b.js接着执行，等到全部执行完毕，再把执行权交还给a.js。于是，a.js接着执行，直到执行完毕。下面，我们来写一个脚本main.js验证这个过程。
```js
// main.js
var a = require('./a.js');
var b = require('./b.js');
console.log('在main.js之中，a.done = %j，b.done = %j', a.done, b.done);
```
执行main.js，运行结果如下。
```js
$ node main.js

// 在b.js之中，a.done = false
// b.js执行完毕
// 在a.js之中，b.done = true
// b.js执行完毕
// 在main.js之中，a.done = true，b.done = true
```
上面的代码证明了两件事。
- 第一，在b.js之中，a.js没有执行完毕，只执行了第一行。
- 第二，main.js执行到第二行时不会再次执行b.js，而是输出缓存的b.js的执行结果，即它的第四行。
```js
exports.done = true;
```
总之，CommonJS输入的是被输出值的复制，而不是引用。

另外，由于CommonJS模块遇到循环加载时返回的是当前已经执行的部分的值，而不是代码全部执行后的值，两者可能会有差异。所以，输入变量的时候必须非常小心。
```js
var a = require('a'); // 安全的写法
var foo = require('a').foo; // 危险的写法

exports.good = function(arg) {
    return a.foo('good', arg); // 使用的是a.foo的最新值
}

exports.bab = function(arg) {
    return foo('bab', arg); // 使用的是一个部分加载时的值
}
```
上面的代码中，如果发生循环加载，require('a').foo的值很可能会被改写，改用require('a')会更保险一点。

### 23.4.3 ES6模块的循环加载
ES6处理“循环加载”与CommonJS有本质的不同。ES6模块是动态引用，如果使用import从一个模块中加载变量（即import foo from 'foo'），那么，变量不会被缓存，而是成为一个指向被加载模块的引用，需要开发者保证在真正取值的时候能够取到值。

请看下面这个例子。
```js
// a.js
import { bar } from './b.js';
console.log('a.js');
console.log(bar);
export let foo = 'foo';

// b.js
import { foo } from './a.js';
console.log('b.js');
console.log(foo);
export let bar = 'bar';
```
上面的代码中，a.js加载b.js，b.js又加载a.js，构成循环加载。执行a.js，结果如下。
```js
$ babel-node a.js

b.js
undefined
a.js
bar
```
上面的代码中，由于a.js的第一行是加载b.js，所以先执行的是b.js。而b.js的第一行又是加载a.js，这时由于a.js已经开始执行，所以不会重复执行，而是继续执行b.js，因此第一行输出的是b.js。

接着，b.js要打印变量foo，这时a.js还没有执行完，娶不到foo的值，因此打印出来的是undefined。b.js执行完便会开始执行a.js，这时便会一切正常。

再来看一个稍微复杂的例子。
```js
// a.js
import { bar } from './b.js';
export function foo() {
    console.log('foo');
    bar();
    console.log('foo函数执行完毕');
}

foo();

// b.js
import { foo } from './a.js';
export function bar() {
    console.log('bar');
    if(Math.random() > 0.5) {
        foo();
    }
}
```
按照CommonJS规范，上面的代码是无法执行的。a先加载b，然后b又加载a，这时a还没有任何执行结果，所以输出结果为null，即对于b.js来说，变量foo的值等于null，后面的foo()就会报错。

但是，ES6可以执行上面的代码。
```js
$ babel-node a.js

foo
bar
执行完毕

// 执行结果也可能是
foo
bar
foo
bar
执行完毕
执行完毕
```
上面的代码中，a.js之所以能够执行，原因就在于ES6加载的变量都是动态引用其所在模块的。只要引用存在，代码就能执行。

下面，我们来详细分析这段代码的运行过程。
```js
// a.js

// 这一行建立一个引用，
// 从`b.js`引用`bar`
import { bar } from './b.js';

export function foo() {
    // 执行时第一行输出foo
    console.log('foo');
    // 到b.js执行bar
    bar();
    console.log('foo函数执行完毕');
}
foo();


// b.js

// 建立`a.js`的`foo`引用
import { foo } from './a.js';

export function bar() {
    // 执行时，第二行输出bar
    console.log('bar');

    // 递归执行foo，一旦随机数
    // 小于等于0.5，就停止执行
    if(Math.random() > 0.5) {
        foo();
    }
}
```
再来看ES6模块加载器SystemJS给出的一个例子。
```js
 // even.js
 import { odd } from './odd';
 export var counter = 0;
 export function even(n) {
     counter++;
     return n == 0 || odd(n - 1);
 }

 // odd.js
 import { even } from './even';
 export function odd(n) {
     return n != 0 && even(n - 1);
 }
 ```
 上面的代码中，even.js里面的函数even有一个参数n，只要该参数不等于0，结果就会减1，传入加载的odd()。odd.js也会进行类似操作。

运行上面这段代码，结果如下。
``` js
$ babel-node 
> import * as m from './even.js';
> m.even(10);
true
> m.counter
6
> m.even(20);
true
> m.counter
17
```
上面的代码中，参数n从10变为0的过程中，even()一共会执行6次，所以变量counter等于6。第二次调用even()时，参数n从20变为0，even()一共会执行11次，加上前面的6次，所以counter等于17。

这个例子要是改写成CommonJS，则会报错，根本无法执行。
```js
// even.js
 var odd = require('./odd');
 var counter = 0;
 exports.counter = counter;
 exports.even =  function(n) {
     counter++;
     return n == 0 || odd(n - 1);
 }

 // odd.js
 var even = require('./even').even;
 module.exports = function(n) {
     return n != 0 && even(n - 1);
 }
```
上面的代码中，even.js加载odd.js，而odd.js又加载even.js，形成“循环加载”。
这时，执行引擎就会输出even.js已经执行的部分（不存在任何结果），所以在odd.js之中，变量even等于null，后面再调用even(n-1)就会报错。
```js
$ node
> var m = require('./even');
> m.even(10)
TypeError: even is not a function
```