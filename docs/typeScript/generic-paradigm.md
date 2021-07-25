# 泛型
> 泛型：软件工程中我们不仅要创建一致的定义良好的API,同时也要考虑可重用性。组件不仅能够支持当前的数据类型也支持未来的数据类型。这在创建大型系统时，为你提供了十分灵活的功能。

在 c# 和 java 中使用泛型来创建可重用的组件。一个组件可以支持多种类型的数据。这样用户就可以以自己的数据类型来使用组件。

通俗理解，泛型就是解决类、接口、方法的复用性，以及对不特定类型的数据的支持。

那么问题来了，如果方法的参数和返回值都支持两种类型如何实现呢？

可以通过设置类型是 any 进行实现，但是设置 any 其实是放弃了类型检查，参数和返回值是什么类型都可以。

```ts
function getInfo(a: any): any {
  return a;
}
getInfo(123);
```
如果想要实现在调用方法的时候临时决定改方法的参数类型就可以使用泛型控制。

## 1. 泛型函数
```ts
function getInfo<T>(value: T): any {
  return value;
}
getInfo<number>(1112); //正确
getInfo<string>(1112); //错误
```

## 2. 类的泛型
```ts
//泛型类也有类似形状的通用接口。泛型类在尖括号泛型类型参数列表
//--T
class GenericNumber<T> {
    zeroValue: T;
    constructor(str: T) {
        // 属性要初始化
        this.zeroValue = str;
        // 方法要做实现
        this.add = function(x: T, y: T): any {

        }
    }
    add: (x: T, y: T) => T;
    // 或者
    // add: ((x: T, y: T) => T) | undefined;
    // 或者
    // add?: ((x: T, y: T) => T);
    // 或者
    // add<T>(x: T, y: T):T {
    //     return x + y;
    // }
}

/*------number 数字类型-----*/
var myGenericNumber = new GenericNumber<number>();
myGenericNumber.zeroValue = 0;
myGenericNumber.add = function(x, y) { return x + y; };

/*------string 字符串类型-----*/
var stringNumeric = new GenericNumber<string>();
stringNumeric.zeroValue = "";
stringNumeric.add = function(x, y) { return x + y; };
alert(stringNumeric.add(stringNumeric.zeroValue, "test"));


//-----------------Generic Constraints----
/*****声明一个接口,来约束**********/
interface ILength {
    length: number;//声明一个 number 类型
}
//-function 用 extends 关键继承这个 ILength 接口约束。。
function loggingIdentity<T extends ILength>(arg: T): T {
    console.log(arg.length); //获取这个 length 值
    return arg;
}
//调用这个 loggingIdentity 方法
var object=loggingIdentity({length: 10, value: 3});


/**
*在使用泛型类的类型
*当我们用 typescript 去创建工厂的时候，因此有必要通过其构造函数来引用类类型
*/
function create<T>(c: {new(): T; }): T {
    return new c();
}

/**
* *使用:一个更高级的示例使用原型属性来推断和约束的构造函数和类类型的实例侧之间的关系
*/
//养蜂人
class BeeKeeper {
    hasMask: boolean;
}
//动物管理人.
class ZooKeeper {
    nametag: string;
}
//动物
class Animals {
    numLegs: number;
}
//蜜蜂
class Bee extends Animals {
    keeper: BeeKeeper;
}
//狮子
class Lion extends Animals {
    keeper: ZooKeeper;
}
//管理人.
function findKeeper<A extends Animals, K> (a: {new(): A;
prototype: {keeper: K}}): K {
    return a.prototype.keeper;
}
//findKeeper(Lion).nametag; // 检查类型!
/**
*jQuery----
*
*/
$(function(){
    var len=$(object).attr("length");//获取这个 length 值
    var value=$(object).attr("value");//获取这个 value 值
    //alert(len);
    //alert(value);
    //var obj1:Animals=Lion;
    //console.log( findKeeper(Lion).nametag);//检查类型!
});
```

## 3. 泛型接口

写法1:
```ts
interface ConfigFn {
  <T>(value: T): T;
}
var getData: ConfigFn = function<T>(value: T): T {
  return value;
};
getData<string>("20");
```
写法2:
```ts
interface ConfigFn<T> {
  (value: T): T;
}
function getData<T>(value: T): T {
  return value;
}
var myGetData: ConfigFn<string> = getData;
myGetData("20"); /*正确*/
myGetData(20); //错误
```

## 4. 泛型应用案例：
需求：定义一个封装操作数据库的库，支持 mysql , MsSql , MongoDB

要求：三种数据库都有 增删改查的功能

注意：统一的规范已经代码重用

解决方案：需要约束规范所以定义接口，需要代码重用所以用到泛型
- 接口，在面向对象的编程中，接口是一种规范的定义，它定义了行为和动作的规范
- 泛型：通俗理解，泛型就是解决类、接口、方法的复用性
```ts
interface DBI<T> {
  add(info: T): boolean;
  update(info: T, id: number): boolean;
  delete(id: number): boolean;
  get(id: number): boolean;
}
```

```ts

//定义一个操作mySqls数据库的类
class MysqlDB<T> implements DBI<T> {
  constructor() {
    console.log("假装数据库建立连接");
  }
  add(info: T): boolean {
    console.log("MySql实现逻辑", info);
    return true;
  }
  update(info: T, id: number): boolean {
    throw new Error("Method not implemented.");
  }
  delete(id: number): boolean {
    throw new Error("Method not implemented.");
  }
  get(id: number): boolean {
    throw new Error("Method not implemented.");
  }
}
//定一一个msSql的数据库类
class MsSqlDB<T> implements DBI<T> {
  constructor() {
    console.log("假装数据库建立连接");
  }
  add(info: T): boolean {
    console.log("msSql实现逻辑", info);
    return true;
  }
  update(info: T, id: number): boolean {
    throw new Error("Method not implemented.");
  }
  delete(id: number): boolean {
    throw new Error("Method not implemented.");
  }
  get(id: number): boolean {
    throw new Error("Method not implemented.");
  }
}
```

```ts
//操作用户
class User {
  userName: string | undefined;
  password: string | undefined;
}
var u = new User();
u.userName = "张三";
u.password = "123456";

var oMysql = new MysqlDB<User>();
oMysql.add(u);
```