# 跨域

## 什么是跨域？
要明白什么是跨域之前，首先要明白什么是`同源策略`？

同源策略就是用来限制从一个源加载的文档或脚本与来自另一个源的资源进行交互。那怎样判断是否是同源呢？

如果协议，端口（如果指定了）和主机对于两个页面是相同的，则两个页面具有相同的源，也就是同源。也就是说，要同时满足以下3个条件，才能叫同源：
- 协议相同
- 端口相同
- 主机相同

举个例子就一目了然了：

我们来看下面的页面是否与 http://store.company.com/dir/index.html 是同源的？

1. http://store.company.com/dir/index2.html 同源
2. http://store.company.com/dir2/index3.html 同源 虽然在不同文件夹下
3. https://store.company.com/secure.html 不同源 不同的协议(https)
4. http://store.company.com:81/dir/index.html 不同源 不同的端口(81)
5. http://news.company.com/dir/other.html 不同源 不同的主机(news)

## 跨域的几种解决方案

### 1、document.domain方法
我们来看一个具体场景：有一个页面 `http://www.example.com/a.html` ，它里面有一个`iframe`，这个`iframe`的源是 `http://example.com/b.html` ，很显然它们是不同源的，所以我们无法在父页面中操控子页面的内容。

解决方案如下：
```html
<!-- b.html -->
<script>
document.domain = 'example.com';
</script>
```

```html
<!-- a.html -->
<script>
document.domain = 'example.com';
var iframe = document.getElementById('iframe').contentWindow.document;

//后面就可以操作iframe里的内容了...
</script>
```
所以我们只要将两个页面的document.domain设置成一致就可以了。
::: warning
要注意的是，document.domain的设置是有限制的，我们只能把document.domain设置成自身或更高一级的父域。但是，这种方法只能解决主域相同的跨域问题。
:::