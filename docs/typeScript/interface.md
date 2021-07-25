# 接口
接口的作用：在面向对象的编程中，接口是一种规范的定义，它定义了行为和动作的规范，在程序设计里面，接口起到了一种限制和规范的作用。

接口定义了某一批类所需要遵守的规范，接口不关心这些类的内部状态数据，也不关心这些类里面的实现细节，它只规定这批类必须提供某些方法。

提供这些方法的类就可以满足实际需求。ts 中的接口类似于 java 。同时还增加了更加灵活的接口类型。包括属性、函数、可索引和类等，接口可分为：

- 属性类接口
- 函数类型接口
- 类类型接口
- 可索引接口
- 接口拓展

### 1. 属性类接口
```ts
interface Config {
  type: string;
  url: string;
  data?: string;
  dataType?: string;
}
//原生js封装ajax
function ajax(config: Config) {
  var xhr = new XMLHttpRequest();
  xhr.open(config.type, config.url, true);
  xhr.send(config.data);
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 && xhr.status == 200) {
      console.log("响应成功");
      if (config.dataType == "json") {
        console.log(JSON.parse(xhr.responseText));
      } else {
        console.log(xhr.responseText);
      }
    }
  };
}
ajax({
  type: "get",
  url: "http://m.jd.com",
  dataType: "json"
});
```

### 2. 函数类型接口
对函数传入的参数以及返回值进行约束
```ts
interface encrypt {
  (key: string, value: string): string;
}
var md5: encrypt = function(k: string, v: string): string {
  return `${k}---${v}`;
};
alert(md5("111", "222"));
```

### 3. 可索引接口
是对数组、对象的约束（不常用）
```ts
//可索引接口对数组的约束
interface UserArr {
  [index: number]: string;
}
var a: UserArr = ["123", "12313"];
//可索引接口对对象的约束
interface UserObj {
  [index: number]: string;
}
var o: UserObj = {
  1: "a",
  "2": "b" //"2"可以转成2 所以不报错
};
```

### 4. 类类型接口
对类的约束和抽象类类似
```ts
interface Animal {
  name: string;
  eat(Str: string): void;
}
class Dog implements Animal {
  name: string;
  constructor(n: string) {
    this.name = n;
  }
  eat() {
    console.log(`${this.name}吃粮食`);
  }
}
```

### 5. 接口扩展
接口可以继承接口
```ts
interface Animal {
  eat(): void;
}
interface Person extends Animal {
  work(): void;
}
class Programmer {
  public name: string;
  constructor(name: string) {
    this.name = name;
  }
  code(): void {
    alert(`${this.name}会coding`);
  }
}
class FE extends Programmer implements Person {
  //既可以继承又可以实现
  constructor(n: string) {
    super(n);
  }
  eat(): void {
    console.log(`${this.name}会吃饭`);
  }
  work(): void {
    console.log(`${this.name}会工作`);
  }
}
let p1 = new FE("小王");
p1.code();
```