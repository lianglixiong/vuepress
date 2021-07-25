

JavaScript 作为弱类型语言或者说动态语言，具有灵活、简洁的特点。但是在大型项目中由于没有强制类型定义，导致代码可读性较差，且只有在执行时才会检测出错误。

相反，像 Java 这样的强类型语言，在编译阶段既可以发现类型不匹配的错误，同时类型信息也有利于编辑器做优化。JavaScript 为了弥补语言自身的问题，TypeScript就应运而生。


## 安装/运行
安装：
```js
npm install -g typeScript
```
运行：
```js
tsc XXX.ts
```

## 数据类型
ts 为了使编写的代码更规范，更有利于维护，增加类型校验, ts 中的数据类型又分为：`布尔类型（boolean）`、`数字类型(number)`、`字符串类型(string)`、`数组类型(array)`、`元祖类型(tuple)`、`枚举类型(enum)`、`任意类型(any)`、`null` 和 `undefined`、`void类型`、`never类型`。下面依次进行介绍：

### 1. boolean类型
```ts
var flag: boolean = true;
flag = 123; //❌
```

### 2. number类型
```ts
var num: number = 123;
num = 345;
num = "sdds"; //❌
```

### 3. 数组类型
```ts
//方式1
var arr: number[] = [1, 223, 343];
//方式2
var arr2: Array<number> = [22, 33, 423];
//方式3
var arr3: any[] = ["1213", 22, 333];
```

### 4. 元祖类型（tuple）
属于数组的一种,定义数组中具体的类型
```ts
let arr: [number, string] = [122, "22222"];
```

### 5. 枚举类型 enum
可以指定索引值，当 blue 指定索引值为 3 时，后面值的索引值依次递增，所以 pink 的索引值为 4，green 为 5，而red 则还是 0.
```ts
enum Color {
  red,
  blue = 3,
  pink,
  green
}
var c: Color = Color.pink;
console.log(c);//4

enum Err {
  "undefined" = 1,
  "null" = -1,
  "success" = -2
}
var e: Err = Err.null;
console.log(e);//-1
```

### 6. 任意类型
相当于放弃类型定义
```ts
var oBox: any = document.getElementById("box");
oBox.style.color = "red";
```

### 7.  undefined 和 null,
是其他数据类型（ never 类型）的子类型
```ts
var num: number | undefined;
console.log(num);
```

### 8.  void类型
ts 中的 void 表示没有任何类型，一般用于方法定义的时候方法没有返回值
```js
function run(): void {
  console.log("run");
}
run();
```

### 9.  never类型
never类型表示的是那些永不存在的值的类型。never是其他类型（包括 null 和 undefiend ）的子类型，代表从不出现的值,意味着声明 never 的变量，只能被 never 类型所赋值
```ts
// 返回never的函数必须存在无法达到的终点
function error(message: string): never {
    throw new Error(message);
}

// 推断的返回值类型为never
function fail() {
    return error("Something failed");
}

// 返回never的函数必须存在无法达到的终点
function infiniteLoop(): never {
    while (true) {
    }
}
```

## 函数
es5中函数定义如下：
```js
//函数声明式
function fun1() {
  return "fun1";
}
//匿名函数式
var fun2 = function() {
  return "fun2";
};
```
在ts中函数定义如下：
```ts
//函数声明式
function getInfo(name: string, age: string): string {
  return `${name}---${age}`;
}
//匿名函数式
var fun4 = function(): string {
  return "123";
};
```

### 1. 可选参数？
?表示可选参数，注意可选参数必须配置到参数最后面
```ts
function getInfo2(name: string, age?: number): string {
  return `${name}---${age}`;
}
getInfo2("aaa", 123);
```

### 2. 默认参数
es5中无法设置默认参数，es6和ts中都可以设置默认参数
```ts
function getInfo(name: string, age: number = 20): string {
  return `${name}${age}`;
}
getInfo("张三", 40);
```

### 3. 剩余参数...
```ts
function fun(a: number, ...result: Array<number>) {
  let sum = a;
  result.forEach((i, index) => {
    sum += i;
  });
  return sum;
}
alert(fun(1, 2, 3, 4, 5, 6));
```

### 4. 重载机制
java 中方法的重载指两个或两个以上同名方法，但他们的参数列表不同，就会出现重载的情况。

ts 中的重载，通过为同一个函数提供多个函数类型定义来实现多种功能的目的，ts 为了兼容 es5 以及 es6，重载的写法和 java 中有所区别

#### 4.1 参数个数相同的重载
```ts
function getInfo(name: string): string;
function getInfo(age: number): number;
function getInfo(str: any): any {
  if (typeof str === "string") {
    return `姓名：${str}`;
  } else if (typeof str === "number") {
    return str;
  }
}
alert(getInfo("小明"));
```

#### 4.2 参数个数不同的重载
```ts
function getInfo(name: string): string;
function getInfo(name: string, age: number): string;
function getInfo(name: any, age?: any): any {
  if (age) {
    return `名字是：${name}，年龄是：${age}岁`;
  } else {
    return `姓名：${name}`;
  }
}
alert(getInfo("java", 10));
```

### 5. 箭头函数 与 es6 一致
```js
setTimeout(() => {
  alert("this指向上下文");
}, 1000);
```

## 接口与抽象类
1. 抽象类的使用原则：
- 抽象类不能被实例化，需要依靠子类采用向上转型的方式处理；
- 抽象类必须有子类去继承，一个子类只能继承一个继承抽象类；
- 抽象方法必须是 public 和 protected（因为如果是 private，则不能被子类继承，子类就不能实现此方法）；
- 如果子类继承了此抽象类，则子类必须要重写抽象类中的全部抽象方法（如果子类没有全部重写父类中的抽象方法，则子类也需要定义为abstract的）
- 抽象类不能用 final 声明，因为抽象类必须有子类；

2. 抽象类和接口的区别：
- 抽象类里面可以有方法的实现，但是接口完全都是抽象的，不存在方法的实现；
- 子类只能继承一个抽象类，而接口可以被多个实现；
- 抽象方法可以是 public ，protected ，但是接口只能是 public，默认的；
- 抽象类可以有构造器，而接口不能有构造器；
- 抽象类当做父类，被继承。且抽象类的派生类的构造函数中必须调用super()；接口可以当做“子类”继承其他类