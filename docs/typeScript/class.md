## class类

### 1. es5中的类通过构造函数实现，es6 和 ts 中通过 class 关键字实现。
es5 中的类
```js
function Person(name) {
  this.name = name;
  this.run = function() {
    alert(this.name + "在运动");
  };
}
var p = new Person();
alert(p.name);
```
ts 中的类定义
```ts
class Person {
  name: string;
  constructor(n: string) {
    this.name = n;
  }
  getName(): string {
    return this.name;
  }
  setName(name: string): void {
    this.name = name;
  }
}
var p1 = new Person("小栗");
p1.setName("xiaoli");
alert(p1.getName());
```

### 2. ts 中实现继承，通过关键字 extends 和 super 实现
```ts
class Person {
  name: string;
  constructor(n: string) {
    this.name = n;
  }
  run(): void {
    alert(`${this.name}在运动`);
  }
}
class Web extends Person {
  constructor(n: string) {
    super(n);
  }
  run(): void {
    //父类与子类有同样的方法的时候，会调用子类的方法
    alert(`${this.name}在运动-子类`);
  }
}
let w = new Web("李四");
w.run();
```

### 3. 类里的修饰符
ts中定义属性的时候给我们提供三种修饰符（默认共有）
- public：共有在类内部、类外部、子类中都可以访问
- protected：保护类型  在类内部、子类可以访问，类外部不可访问
- private：私有 在类内部可以访问，在子类和类外部都不能访问
```ts
class Person {
  protected name: string;
  constructor(n: string) {
    this.name = n;
  }
}
var p = new Person("保护属性");
p.name; //报错
```

### 4. 静态属性，静态方法
es5 中的静态方法、静态属性：
```js
function Person() {}
Person.run = function() {
  alert("静态方法");
}; //静态方法
Person.run();
```
ts 中的静态方法：
```ts
class Person {
  public name: string;
  private static sex = "男"; //静态方法
  constructor(n: string) {
    this.name = n;
  }
  run() {
    //实例方法
    alert(`${this.name}在运动`);
  }
  static print() {
    //静态方法
    alert(`静态方法${Person.sex}`);
  }
}
Person.print();
```

### 5. 多态 
父类定义一个方法不去实现，让继承他的子类去实现。每一个子类有不同的表现，多态属于继承。
```ts
class Animal {
  name: string;
  constructor(n: string) {
    this.name = n;
  }
  eat() {}
}
class Dog extends Animal {
  constructor(n: string) {
    super(n);
  }
  eat() {
    alert(`${this.name}吃骨头`);
  }
}
class Cat extends Animal {
  constructor(n: string) {
    super(n);
  }
  eat() {
    alert(`${this.name}吃罐头`);
  }
}
```

### 6. 抽象类 
ts 中的抽象类它提供其他类继承的基类，不能直接被实例化,用 abstract 关键字定义的抽象类和抽象方法.有几个特点：
- 抽象类中的抽象方法不包含具体实现并且必须在派生类中实现
- abstract抽象方法只能放在抽象类里面
- 抽象类和抽象方法用来定义标准
```ts
abstract class Animale {
  public name: string;
  constructor(name: string) {
    this.name = name;
  }
  abstract eat(): any;
}
class Dog extends Animale {
  constructor(n: string) {
    super(n);
  }
  eat() {
    //抽象类的子类，必须实现抽象类里面的抽象方法
    alert(`${this.name}吃骨头`);
  }
}
```