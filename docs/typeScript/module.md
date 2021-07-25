# 模块
> typeScript1.5里术语名已经发生了变化。“内部模块”现在称作“命名空间”，外部模块则简称“模块”。模块在其自身的作用域里执行，而不是在全局作用域里。
> 这意味着定义在一个模块里面的变量、函数、类等等在模块外部是不可见的。除非你明确的使用 export 形式之一导出它们。
>相反，如果想使用其他模块导出的变量、函数、类，接口等的时候。你必须导入他们，可以使用 import 形式之一。

通俗理解就是：
- 我们可以把一些公共的功能，单独抽离成一个文件作为模块。
- 模块里面的变量、类、函数默认都是私有的。如果我们要在外部访问私有的模块里面数据（函数、类、接口）,我们需要通过 export 暴露模块里面的数据（变量、函数、类）
- 暴露后我们使用 import 引入模块就可以使用模块里面暴露的数据（变量、函数、类）

## 1. 外部模块

### 1.1 export 导出
```ts
// modules/db.ts
export var dbUrl = "XXXXXX";
export function getData(): any[] {
  console.log("获取数据库的数据");
  return [{ title1: "11231321" }, { title2: "3234535" }];
}
export function save() {
  console.log("保存数据成功");
}
```

```ts
//index.ts
import { getData as get, save, dbUrl } from "./modules/db";
console.log(dbUrl);
get();
save();
```

### 1.2 default 默认导出:
每个模块都可以又一个默认导出。默认导出使用 default 关键字标记，并且一个模块只能有一个 default 导出，需要使用一种特殊的导出形式。
```ts
// modules/db.ts
export default function getData(): any[] {
  console.log("获取数据库的数据");
  return [{ title1: "11231321" }, { title2: "3234535" }];
}
```

```ts
// index.ts
import getData from "./modules/db";
getData();
```

### 1.3 模块化应用实例：
需求：实现数据库的工具类，并对数据库对应对象实现增删改查功能

要求：应用模块化思想。
- 编写数据库工具类
```ts

// modules/db.ts
//操作数据库实例demo
interface DBI<T> {
  add(info: T): boolean;
  update(info: T, id: number): boolean;
  delete(id: number): boolean;
  get(id: number): boolean;
}
//定义一个操作mySqls数据库的类
class MysqlDB<T> implements DBI<T> {
  constructor() {
    console.log("数据库建立连接");
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
export { MysqlDB, MsSqlDB };
```
- 编写对象操作类
```ts
// model/user.ts
import { MsSqlDB } from "../modules/db";
//操作用户
class UserClass {
  userName: string | undefined;
  password: string | undefined;
}
var UserModel = new MsSqlDB<UserClass>();
export { UserClass, UserModel };
```
- 引用对象操作类进行操作
```ts
//index.ts
import { UserClass, UserModel } from "./model/User";
//增加数据
var user = new UserClass();
user.userName = "张三";
user.password = "123";
UserModel.add(user);
//获取数据
UserModel.get(123);
```
直接导入 User 模块，通过封装 UserClass 进行类的实例化，通过 UserModel是先对数据对象的增删改查。

## 2. 内部模块(命名空间)
在代码量较大的情况下，为了避免各种变量命名相冲突，可将相似功能的函数、类、接口等放置到命名空间中

同 java 的包，.net 的命名空间一样，typeScript 的命名空间可以将代码包裹起来，只对外暴露需要在外部访问的对象，命名空间内容的对象通过 export 让外部引用

命名空间和模块的区别：
- 命名空间:内部模块主要用于组织代码，避免命名冲突
- 模块：ts 的外部模块的简称，侧重代码的复用，一个模块里可能有多个命名空间
```ts

//命名空间A
namespace A {
  interface Animal {
    name: string;
    eat(): void;
  }
  export class Dog implements Animal {
    name: string;
    constructor(name: string) {
      this.name = name;
    }
    eat(): void {
      console.log(`${this.name}在吃狗粮`);
    }
  }
  export class Cat implements Animal {
    name: string;
    constructor(name: string) {
      this.name = name;
    }
    eat(): void {
      console.log(`${this.name}在吃猫粮`);
    }
  }
}
//命名空间B
namespace B {
  interface Animal {
    name: string;
    eat(): void;
  }
  export class Dog implements Animal {
    name: string;
    constructor(name: string) {
      this.name = name;
    }
    eat(): void {
      console.log(`${this.name}在吃狗粮`);
    }
  }
  export class Cat implements Animal {
    name: string;
    constructor(name: string) {
      this.name = name;
    }
    eat(): void {
      console.log(`${this.name}在吃猫粮`);
    }
  }
}
let dog1 = new A.Dog("小黄");
let cat1 = new B.Cat("小花");
```
在模块外部引用模块内部命名空间里面的变量、函数、类时，将命名空间通过export 导出，即可引用.