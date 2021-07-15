# 第12章 Proxy
## 12.1 概述

Proxy用于修改某些操作的默认行为，等同于在语言层面做出修改，所以属于一种“元编程”（meta programming），即对编程语言进行编程。

Proxy可以理解成在目标对象前架设一个“拦截”层，外界对该对象的访问都必须先通过这层拦截，因此提供了一种机制可以对外界的访问进行过滤和改写。Proxy这个词的原意是代理，用在这里表示由它来“代理”某些操作，可以译为“代理器”。
```js
var obj = new Proxy({}, {
    get: function(target, key, receiver) {
        console.log(`getting ${key}!`);
        return Reflect.get(target, key, receiver);
    },
    set: function(target, key, value, receiver) {
        console.log(`setting ${key}!`);
        return Reflect.set(target, key, value, receiver);
    }
});
```
上面的代码对一个空对象进行了一层拦截，重定义了属性的读取（get）和设置（set）行为。这里暂时先不解释具体的语法，只看运行结果。读取设置了拦截行为的对象obj的属性就会得到下面的结果。
```js
obj.count = 1;
// setting count!

++obj.count
// getting count!
// setting count!
// 2
```
上面的代码说明，Proxy实际上重载（overload）了点运算符，即用自己的定义覆盖了语言的原始定义。

ES6原生提供Proxy构造函数，用于生成Proxy实例。
```js
var proxy = new Proxy(target, handler);
```
Proxy对象的所有用法都是上面这种形式，不同的只是handler参数的写法。其中，new Proxy()表示生成一个proxy实例，target参数表示所要拦截的目标对象，handler参数也是一个对象，用来定制拦截行为。

下面是另一个拦截读取属性行为的例子。
```js
var proxy = new Proxy({}, {
    get:function(target, property) {
        return 35
    }
});

proxy.time // 35
proxy.name // 35
proxy.title // 35
```
上面的代码中，构造函数Proxy接受两个参数；第一个参数是所要代理的目标对象（上例中是一个空对象），即如果没有Proxy介入，操作原来要访问的就是这个对象；第二个参数是一个配置对象，对于每一个被代理的操作，需要提供一个对应的处理函数，该函数将拦截对应的操作。比如，上面的代码中，配置对象有一个get方法用来拦截对目标对象属性的访问请求。get方法的两个参数分别是目标对象和所要访问的属性。可以看到，由于拦截函数总是返回35，所以访问任何属性都将得到35。

::: warning
要使Proxy起作用，必须针对Proxy实例（上例中是proxy对象）进行操作，而不是针对目标对象（上例中是空对象）进行操作。
:::

如果handler没有设置任何拦截，那就等同于直接通向原对象。
```js
var target = {};
var handler = {};

var proxy = new Proxy(target, handler);
proxy.a = 'b';
target.a // "b"
``` 
上面的代码中，handler是一个空对象，没有任何拦截效果，访问handler就等同于访问target。

一个技巧是将Proxy对象设置到object.proxy属性，从而可以在object对象上调用。
```js
var object = { proxy: new Proxy(target, handler)};
```
Proxy实例也可以作为其他对象的原型对象。
```js
var proxy = new Proxy({}, {
    get:function(target, property) {
        return 35;
    }
})

let obj = Object.create(proxy);
obj.time // 35
```
上面的代码中，proxy对象是obj对象的原型，obj对象本身并没有time属性，所以根据原型链会在proxy对象上读取该属性，导致被拦截。

同一个拦截器函数可以设置拦截多个操作。
```js
var handler = {
    get: function(target, name) {
        if(name === 'prototype') {
            return Object.prototype;
        }
        return 'Hello， ' + name;
    },
    apply:function(target, thisBinding, args) {
        return args[0]
    },
    construct: function(target, args) {
        return { value: args[1]};
    }
}

var fproxy = new Proxy(function(x, y) {
    return x + y;
}, handler);

fproxy(1,2) // 1
new fproxy(1,2) // {value: 2}
fproxy.prototype === Object.prototype // true
fproxy.foo // "Hello， foo"
```
下面是Proxy支持的所有拦截操作。

对于可以设置但没有设置拦截的操作，则直接落在目标对象上，按照原先的方式产生结果。

### get(target,propKey,receiver)
拦截对象属性的读取，比如`proxy.foo`和`proxy['foo']`。最后一个参数`receiver`是一个可选对象，参见下面`Reflect.get`的部分。

### set(target,propKey,value,receiver)
拦截对象属性的设置，比如`proxy.foo = v`或`proxy['foo'] = v`,返回一个布尔值。

### has(target,propKey)
拦截`propKey in proxy`的操作，返回一个布尔值。

### deleteProperty(target,propKey)
拦截delete proxy[propKey]的操作，返回一个布尔值。

### ownKeys(target)
拦截`Object.getOwnPropertyNames(proxy)`、`Object.getOwnPropertySymbols(proxy)`、`Object.keys(proxy)`，返回一个数组。该方法返回目标对象所有自身属性的属性名，而`Object.keys()`的返回结果仅包括目标对象自身的可遍历属性。

### getOwnPropertyDescriptor(target,propKey)
拦截`Object.getOwnPropertyDescriptor(proxy,propKey)`，返回属性的描述对象。

### defineProperty(target,propKey,propDesc)
拦截`Object.defineProperty(proxy,propKey,propDesc)`、`Object.defineProperties(proxy,propDescs)`，返回一个布尔值。

### preventExtensions(target)
拦截`Object.preventExtensions(proxy)`，返回一个布尔值。

### getPrototypeOf(target)
拦截`Object.getPrototypeOf(proxy)`，返回一个对象。

### isExtensible(target)
拦截`Object.isExtensible(proxy)`，返回一个布尔值。

### setPrototypeOf(target,proto)
拦截`Object.setPrototypeOf(proxy,proto)`，返回一个布尔值。如果目标对象是函数，那么还有两种额外操作可以拦截。

### apply(target,object,args)
拦截Proxy实例，并将其作为函数调用的操作，比如`proxy(...args)`、`proxy.call(object,...args)`、`proxy.apply(...)`。

### construct(target,args)
拦截proxy实例作为构造函数调用的操作，比如`new proxy(...args)`。

## 12.2 Proxy实例的方法
下面是上述拦截方法的详细介绍。

### 12.2.1 get()
get方法用于拦截某个属性的读取操作。前面已经有一个例子，下面是另一个拦截读取操作的例子。
```js
var person = {
    name: "张三"
};

var proxy = new Proxy(person, {
    get: function(target, property) {
        if(property in target) {
            return target[property];
        }else {
            throw new ReferenceError("Property \"" + property + "\" does not exist.");
        }
    }
})

proxy.name // proxy.name
proxy.age // 抛出一个错误
```
上面的代码表示，如果访问目标对象不存在的属性，会抛出一个错误。如果没有这个拦截器函数，访问不存在的属性只会返回undefined。

get方法可以继承
```js
let proto = new Proxy({}, {
    get(target, propertyKey, receiver) {
        console.log('GET' + propertyKey);
        return target[propertyKey];
    }
})

let obj = Object.create(proto);
obj.xxx // "GET xxx"
```
上面的代码中，拦截操作定义在Prototype对象上，所以如果读取obj对象继承的属性，拦截会生效。

下面的例子使用get拦截实现数组读取负数索引。
```js
function createArray(...elements) {
    let handler = {
        get(target, propKey, receiver) {
            let index = Number(propKey);
            if(index < 0) {
                propKey = String(target.length + index);
            }
            return Reflect.get(target, propKey, receiver);
        }
    }

    let target = [];

    target.push(...elements);
    return new Proxy(target, handler);
}

let arr = createArray('a', 'b', 'c');
arr[-1] // "c"
```
上面的代码中，如果数组的位置参数是-1，就会输出数组的最后一个成员。

利用Proxy，可以将读取属性的操作（get）转变为执行某个函数，从而实现属性的链式操作。
```js
var pipe = (function() {
    return function(value) {
        var funcStack = [];
        var oproxy = new Proxy({}, {
            get: function(pipeObject, fnName) {
                if(fnName === 'get') {
                    return funcStack.reduce(function(val, fn) {
                        return fn(val);
                    }, value)
                }
                funcStack.push(window[fnName]);
                return oproxy;
            }
        })

        return oproxy;
    }
}());

var double = n => n * 2;
var pow = n => n * n;
var reverseInt = n => n.toString().split("").reverse().join("") | 0;

pipe(3).double.pow.reverseInt.get; // 63
```
上面的代码设置Proxy后达到了链式使用函数名的效果。

下面的例子则是利用get拦截实现一个生成各种DOM节点的通用函数dom。
```js
const dom = new Proxy({}, {
    get(target, property) {
        return function(attrs = {}, ...children) {
            const el = document.createElement(property);
            for(let prop of Object.keys(attrs)) {
                el.setAttribute(prop, attrs[prop]);
            }
            for(let child of children) {
                if(typeof child === 'string') {
                    child = document.createTextNode(child);
                }
                el.appendChild(child)
            }
            return el;
        }
    }
});

const el = dom.div(
    {},
    'Hello，my name is ',
    dom.a({href: '//example.com'}, 'Mark'),
    '. I like:',
    dom.ul(
        {},
        dom.li({}, 'The web'),
        dom.li({}, 'Food'),
        dom.li({}, '...actually that\'s it')
    )
);

document.body.appendChild(el);
```
如果一个属性不可配置（configurable）或不可写（writable），则该属性不能被代理，通过Proxy对象访问该属性将会报错。
```js
const target = Object.defineProperties({}, {
    foo: {
        value: 123,
        writable: false,
        configurable: false
    }
});

const handler = {
    get(target, propKey) {
        return 'abc';
    }
};

const proxy = new Proxy(target, handler);

proxy.foo 
//TypeError: 'get' on proxy: property 'foo' is a read-only and 
//non-configurable data property on the proxy target but the proxy 
//did not return its actual value (expected '123' but got 'abc')
```

### 12.2.2 set()
`set`方法用于拦截某个属性的赋值操作。

假定Person对象有一个age属性，该属性应该是一个不大于200的整数，那么可以使用`Proxy`对象保证age的属性值符合要求。
```js
let validator = {
    set: function(obj, prop, value) {
        if(prop === 'age') {
            if(!Number.isInteger(value)) {
                throw new TypeError('The age is not an integer')
            }
        }
        if(value > 200) {
            throw new TypeError('The age seems invalid')
        }

        // 对于age以外的属性，直接保存
        obj[prop] = value;
    }
}

let person = new Proxy({}, validator);

person.age = 100;
person.age // 100
person.age = 'young' //报错
person.age = 300 //报错
```
上面的代码中，由于设置了存值函数`set`，任何不符合要求的age属性赋值都会抛出一个错误，这是数据验证的一中实现方法。利用`set`方法还可以实现数据绑定，即每当对象发生变化时，会自动更新DOM。

有时，我们会在对象上设置内部属性，属性名的第一个字符使用下划线开头，表示这些属性不应该被外部使用。结合`get`和`set`方法，就可以做到防止这些内部属性被外部读/写。
```js
var handler = {
    get(target, key) {
        invariant(key, 'get');
        return target[key];
    },
    set(target, key, value) {
        invariant(key, 'set');
        target[key] = value;
        return true;
    }
}
function invariant(key, action) {
    if(key[0] === '_') {
        throw new Error(`Invalid attempt to ${action} private "${key}" property`)
    }
}

var target = {};
var proxy = new Proxy(target, handler);
proxy._prop 
// Error: Invalid attempt to get private "_prop" property
proxy._prop = 'c' 
// Error: Invalid attempt to set private "_prop" property
```
上面的代码中，只要读/写的属性名的第一个字符是下画线，一律抛出错误，从而达到禁止读/写内部属性的目的。
::: warning
如果目标对象自身的某个属性不可写也不可配置，那么set不得改变这个属性的值，只能返回同样的值，否则报错。
:::

### 12.2.3 apply()
`apply`方法拦截函数的调用、`call`和`apply`操作。

`apply`方法可以接受3个参数，分别是`目标对象`、`目标对象的上下文对象（this）`和`目标对象的参数数组`。
```js
var handler = {
    apply(target, ctx, args) {
        return Reflect.apply(...arguments);
    }
}
```
下面是一个例子。
```js
var target = function() {
    return 'I am target';
}
var handler = {
    apply: function() {
        return 'I am the proxy';
    }
}

var p = new Proxy(target, handler);

p() // "I am the proxy"
```
上面的代码中，变量p是`Proxy`的实例，作为函数调用时（p()）就会被`apply`方法拦截，返回一个字符串。

下面时另外一个例子。
```js
var twice = {
    apply(target, ctx, args) {
        return Reflect.apply(...arguments) * 2;
    }
}

function sum(left, right) {
    return left + right;
}
var proxy = new Proxy(sum, twice);
proxy(1, 2) // 6
proxy.call(null, 5, 6) // 22
proxy.apply(null, [7, 8]) // 30
```
上面的代码中，每当执行`proxy`函数（`直接调用或call和apply调用`）就会被`apply`方法拦截。

另外，直接调用`Reflect.apply`方法也会被拦截。
```js
Reflect.apply(proxy, null, [9, 10]) // 38
```

### 12.2.4 has()
has方法用来拦截HasProperty操作，即判断对象是否具有某个属性时，这个方法会生效。典型的操作就是in运算符。

下面的例子使用has方法隐藏了某些属性，使其不被in运算符发现。
```js
var handler = {
    has(target, key) {
        if(key[0] === '_') {
            return false;
        }
        return key in target;
    }
};
var target = { _prop: 'foo', prop: 'foo'};
var proxy = new Proxy(target, handler);
'_prop' in proxy // false
```
上面代码中，如果原对象的属性名的第一个字符时下划虚，proxy.has就会返回false，从而不会被in运算符发现。

如果原对象不可配置或者禁止扩展，那么这时has拦截会报错。
```js
var obj = { a: 10 };
Object.preventExtensions(obj);

var p = new Proxy(obj, {
    has: function(target, prop) {
        return false;
    }
});

'a' in p 
// TypeError: 'has' on proxy: trap returned falsish for property 'a' 
//but the proxy target is not extensible
```
上面的代码中，obj对象禁止扩展，结果使用has拦截就会报错。也就是说，如果某个属性不可配置（或者目标对象不可扩展），则has方法就不得“隐藏”（即返回false）目标对象的该属性。
::: warning
has方法拦截的是HasProperty操作，而不是HasOwnProperty操作，即has方法不判断一个属性是对象自身的属性还是继承的属性。
:::

另外，虽然for...in循环也用到了in运算符，但是has拦截对for...in循环不生效。
```js
let stu1 = {name: '张三', score: 59};
let stu2 = {name: '李四', score: 99};

let handler = {
    has(target, prop) {
        if(prop === 'score' && target[prop] < 60) {
            console.log(`${target.name} 不及格`)
            return false;
        }
        return prop in target;
    }
}

let oproxy1 = new Proxy(stu1, handler);
let oproxy2 = new Proxy(stu2, handler);

'score' in oproxy1;
// 张三 不及格
// false

'score' in oproxy2;
// true

for(let a in oproxy1) {
    console.log(oproxy1[a]);
}
// 张三
// 59

for(let b in oproxy2) {
    console.log(oproxy2[b]);
}
// 李四
// 99
```
上面的代码中，has拦截只对in循环生效，对for...in循环不生效，导致不符合要求的属性没有被排除在for...in循环之外。

### 12.2.5 construct()

construct方法用于拦截new命令，下面是拦截对象的写法。
```js
var handler = {
    construct(target, args, newTarget) {
        return new Target(...args);
    }
}
```
construct方法可以接受两个参数。
- target: 目标对象。
- args: 构建函数的参数对象。

下面是一个例子。
```js
var p = new Proxy(function(){}, {
    construct:function(target, args) {
        console.log('called: ' + args.join('，'));
        return {
            value: args[0] * 10
        }
    }
});

(new p(1)).value
// called: 1
// 10
```

construct方法返回的必须是一个对象，否则会报错。
```js
var p = new Proxy(function(){}, {
    construct:function(target, argumentsList) {
        return 1;
    }
})

new p();
// TypeError: 'construct' on proxy: trap returned non-object ('1')
```

### 12.2.6 deleteProperty()

deleteProperty方法用于拦截delete操作，如果这个方法抛出错误或者返回false，当前属性就无法被delete命令删除。
```js
var handler = {
    deleteProperty(target, key) {
        invariant(key, 'delete');
        return true;
    }
};
function invariant(key, action) {
    if(key[0] === '_') {
        throw new Error(`Invalid attempt to ${action} private "${key}" property`);
    }
}

var target = { _prop: 'foo'};
var proxy = new Proxy(target, handler);
delete proxy._prop;
// Error: Invalid attempt to delete private "_prop" property
```
上面的代码中，deleteProperty方法拦截了delete操作符，删除第一个字符为下划线的属性会报错。

::: warning
目标对象自身的不可配置（configurable）的属性不能被deleteProperty方法删除，否则会报错。
:::

### 12.2.7 defineProperty()
`defineProperty`方法拦截了`Object.defineProperty`操作。
```js
var handler = {
    defineProperty(target, key, descriptor) {
        return false;
    }
};
var target = {};
var proxy = new Proxy(target, handler);
// proxy.foo = 'bar';
Object.defineProperty(proxy, 'foo', {value:'bar'})
// TypeError: 'defineProperty' on proxy: trap returned falsish for property 'foo'
```
上面的代码中，`defineProperty`方法返回false，导致添加新属性会抛出错误。
::: warning
如果目标对象不可扩展（`extensible`）则`defineProperty`不能增加目标对象中不存在的属性，否则会报错。另外，如果目标对象的某个属性不可写（`writable`）或不可配置（`configurable`），则`defineProperty`方法不得改变这两个设置。
:::