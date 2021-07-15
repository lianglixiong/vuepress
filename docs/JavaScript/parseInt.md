# parseInt()详解

`parseInt(string, radix)`   解析一个字符串并返回指定基数的十进制整数， `radix` 是2-36之间的整数，表示被解析字符串的基数。

#### 语法

```js
parseInt(string, radix);
```

| 参数          | 描述           | 
| ------------- |:-------------| 
| string      | 要被解析的值。如果参数不是一个字符串，则将其转换为字符串(使用[ToString](https://262.ecma-international.org/6.0/#sec-tostring)内部抽象操作)。字符串开头的空符将会被忽略。 | 
| radix      | 可选。表示要解析的数字的基数。该值介于2~36之间。<br><br>如果省略该参数或其值为0，则数字将以10为基础来解析。如果它以“0x”或“0X开头”，将以16为基数。<br><br>如果该参数小于2或者大于36，则parseInt()将返回NaN。      |  

#### 返回值
返回解析后的数字

#### 说明

::: tip
当参数radix的值为0，或没有设置该参数时，parseInt()会根据string来判断数字的基数。<br><br>
举例，如果string以“0x”开头，parseInt()会把string的其余部分解析为十六进制的整数。如果string以0开头，那么ECMAScript v3允许parseInt()的一个实现把其后的字符解析为八进制或十六进制的数字。如果string以1~9的数字开头，parseInt()将把它解析为十进制的整数。
:::

::: warning
如果字符串的第一个字符不能被转换为数字，那么parseInt()会返回NaN。
:::

看上面的这些可能不太好理解，先来看几组样例：
```js
parseInt("10"); // 返回 10
parseInt("19",10); // 返回 19 (10+9)
parseInt("11",2); // 返回 3 (2+1)
parseInt("17",8); // 返回 15 (8+7)
parseInt("1f",16); // 返回 31 (16+15)
parseInt("010"); // 未定：返回 10 或 8
```

`parseInt(string,radix)`
- 其中的基数radix(不代表着进制) 很多人都误以为它代表着要转换的进制数。
- string:要转换的字符串
    1. string 以 “`0x`” 开头，parseInt() 会把 string 的其余部分解析为`十六进制`的整数。
    2. 如果 string 以` 0` 开头，那么会把其后的字符解析为`八进制`或`十六进制`的数字。
    3. 如果 string 以 `1 ~ 9 `的数字开头，parseInt() 将把它解析为`十进制`的整数。

由此可知：
```js
// 默认radix为10，string为数字1开头，则解析为10进制的整数，
// 则parseInt("10") = 1 * 10^1 + 0 * 10^0 = 10
parseInt("10"); // 10; 

// radix为2， string为1数字开头，
// 则 parseInt("11",2) = 1*2^1 + 1*2^0 = 3; 其中2为基数
parseInt("11",2); // 3;

// string为1f，解析为16进制。radix为16，
// 则parseInt("1f",16) = 1*16^1 + 15*16^0 = 31;其中16为基数，f=15；
parseInt("1f",16); // 31;
```

::: tip
```js
parseInt("17",6); // 1;
parseInt("17"，9); // 16;
// 当解析17时，1属于6进制范围，7不属于6进制范围，
// 当string的数字大于radix时(7＞6)，它会只解析到它的上一位，
// 即 parseInt("17",6) = parseInt("1",6) = 1；
```
:::

示例：
```js
var a = ["1", "2", "3", "4","5",6,7,8,9,10,11,12,13,14,15]; 
a.map(parseInt);
// 结果 [1,NaN,NaN,NaN,NaN,NaN,NaN,NaN,NaN,9,11,13,15,17,19]

parseInt("1",0);
// 等于
parseInt("1",10) // 1;

parseInt("2",1) // 因为radix最小为2，最大为36，所以NAN
parseInt("4",3) // 因为3进制范围为（0-2） 4不在3进制范围，所以NaN

// 同理；
parseInt("10", 9); // 1*9^1 + 0*9^0 = 9
parseInt("11", 10); // 11
```
