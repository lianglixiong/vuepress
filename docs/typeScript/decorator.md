# 装饰器
> 装饰器是一种特殊类型的声明，它能够被附加到类声明、方法、属性或者参数上，可以修改类的行为。

通俗的讲装饰器就是一个方法，可以注入到类、方法、属性参数上来拓展类、属性、方法、参数的功能。

常见的装饰器有：`类装饰器`、`属性装饰器`、`方法装饰器`、`参数装饰器`。

装饰器的写法又分：`普通装饰器（无法传参）`、`装饰器工厂（可以传参）`。

装饰器是过去几年中 js 最大的成就之一，已经是 ES7 的标准特性之一！

## 1. 类装饰器
类装饰器在类声明之前被声明（紧靠着类），类装饰器应用于类构造函数，可以用来监视、修改或者替换类定义。

### 1.1 不带参数类装饰器
```ts
function logClass(params: any) {
  console.log(params);
  //params代表的就是被装饰的类
  params.prototype.apiUrl = "XXXXXXX";
  params.prototype.run = function() {
    console.log("我是一个run方法");
  };
}
@logClass
class HttpClient {
  constructor() {}
  getData() {}
}

var http: any = new HttpClient();
console.log(http.apiUrl);
http.run();
```

### 1.2 带参数的装饰器（装饰器工厂）
```ts
function logClass(params: string) {
  return function(target: any) {
    console.log(params, target);
    target.prototype.apiUrl = params;
  };
}
@logClass("https://m.jd.com/api/")
class HttpClient {
  constructor() {}
  getData() {}
}
var http: any = new HttpClient();
console.log(http.apiUrl);
```

### 1.3 通过类装饰器实现对构造函数重载：
类装饰器表达式会在运行时当作函数被调用，类的构造函数作为其唯一的参数被调用,如果类装饰器返回一个值，他会使用提供的构造函数来替换类的声明
```ts
function logClass(target: any) {
  return class extends target {
    apiUrl: string = "我是修改后的apiUrl";
    getData() {
      this.apiUrl = this.apiUrl + "----";
      console.log(this.apiUrl);
    }
  };
}
@logClass
class HttpClient {
  public apiUrl: string | undefined;
  constructor() {
    this.apiUrl = "这是构造函数中的apiUrl";
  }
  getData() {
    console.log(this.apiUrl);
  }
}
var http = new HttpClient();
http.getData();
```

## 2.属性装饰器
属性装饰器表达式会在运行时当作函数被调用。传入下列两个参数：
- 对应静态成员来说是类的构造函数，对于实例成员是类的原型对象
- 成员的名字

### 2.1 属性装饰器
```ts

function logClass(params: string) {
  return function(target: any) {
    console.log(params, target);
  };
}
function logProperty(params: string) {
  return function(target: any, attr: string) {
    console.log(params, target, attr);
    target[attr] = params;
  };
}
@logClass("XXXX")
class HttpClient {
  @logProperty("http://api.jd.com/")
  public url: string | undefined;
  constructor() {}
  getData() {
    console.log(this.url);
  }
}
var http: any = new HttpClient();
http.getData();
```

## 3 方法装饰器
他会被应用到方法的属性描述符上，可以用来监视、修改或者替换方法，方法修饰符会在运行时传入以下三个参数：
- 对于静态成员来说是类的构造函数，对于实例对象来说是类的原型对象
- 成员的名字
- 成员的属性描述符

### 3.1 普通方法装饰器
```ts
function get(params: string): any {
  return function(target: any, attr: any, desc: any) {
    console.log(target);
    console.log(attr);
    console.log(desc);
    target.apiUrl = params;
    target.run = function() {
      console.log(this.apiUrl);
    };
  };
}
class HttpClient {
  public url: string | undefined;
  @get("https://api.jd.com")
  getData() {}
}
var http: any = new HttpClient();
http.run();
```

### 3.2 修改方法参数
```ts
function get(params: string): any {
  return function(target: any, attr: any, desc: any) {
    // console.log(target);
    // console.log(attr);
    // console.log(desc);
    let oMethod = desc.value;
    desc.value = function(...args: any[]) {
      args = args.map(item => {
        return item + "老师李老师";
      });
      oMethod.apply(this, args);
    };
  };
}
class HttpClient {
  public url: string | undefined;
  @get("https://api.jd.com")
  getData(...args: any) {
    console.log(args);
  }
}
var http: any = new HttpClient();
http.getData(1, 2, 3);
```

## 4. 方法参数装饰器
参数装饰器表达式会在运行时当作函数来被调用，可以使用参数装饰器为类的原型增加一些参数数据，传入下列三个参数：
- 对于静态成员来说是类的构造函数，对于实例对象来说是类的原型对象
- 方法的名字
- 参数在函数列表中的索引
```ts
function logParam(params: any): any {
  return function(target: any, paramName: any, paramIndex: any) {
    console.log(params);
    console.log(target);
    console.log(paramName);
    console.log(paramIndex);
    target.apiUrl = params;
  };
}
class HttpClient {
  public url: string | undefined;
  constructor() {}
  getData(@logParam("xxxx") uuid: any) {
    console.log(uuid);
  }
}
var http: any = new HttpClient();
http.getData(123456);
console.log("啦啦啦：", http.apiUrl);
```

## 5. 各类装饰器的执行顺序：
属性装饰器 > 方法装饰器 > 方法参数装饰器 > 类装饰器

如果有多个同一类别装饰器，从后往前执行