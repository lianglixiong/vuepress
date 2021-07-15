# HTTP


## 什么是 HTTP 报文

#### 定义
HTTP 全称 Hypertext Transfer Protocol，超文本传输协议，是应用层协议

HTTP 报文由从客户端到服务器的请求和从服务器到客户端的响应构成

#### 组成
- 起始行：报文描述
- 头部：报文属性
- 主体：报文数据

#### 分类

- 请求报文：客户端到服务端发送请求
    1. 请求行：方法 + URL + HTTP协议版本
    2. 通用信息头：`Connection`等
    3. 请求头
    4. 实体头：POST / PUT / PATCH 的`Content-Type` `Content-Length`等
    5. 报文主体

- 响应报文：服务端到客户端返回数据
    1. 状态行：状态码 + 原因
    2. 通用信息头：`Connection`等
    3. 响应头
    4. 实体头：`Content-Type` `Content-Length`等
    5. 报文主体


## 常见的 HTTP 状态码有哪些？

| 状态码          | 原因           | 说明  |
| :------------- |:-------------| :-----|
| **100-199** | **信息响应** |  |
| 100 | Continue | 已收到请求，客户端应继续 |
| 101 | Switching Protocol | 响应客户端Upgrade列出协议，服务端正在切换协议 |
| 102 | Processing | 服务端正在处理请求，无响应可用 |
| 103 | Early Hints | 与Link一起使用，客户端应在服务端继续响应前开始预加载资源 |
| **200-299** | **成功响应** |  |
| 200 | OK | 请求成功，常见于GET、HEAD、POST、TRACE |
| 201 | Created | 请求成功，新资源已创建，常见于POST、PUT |
| 202 | Accepted | 请求已收到，但未响应 |
| 203 | Non-Authoritative Information | 响应经过了代理服务器修改 |
| 204 | No Content | 请求已处理，无返回，客户端不更新视图 |
| 205 | Reset Content | 请求已处理，无返回，客户端应更新视图 |
| 206 | Partial Content | 请求已处理，返回部分内容，常见于视频点播、分段下载、断点续传 |
| **300-399** | **重定向** ||
| 300 | Multiple Choice | 提供一系列地址供客户端选择重定向 |
| 301 | Moved Permanently | 永久重定向，默认可缓存，搜索引擎应更新链接 |
| 302 | Found | 临时重定向，默认不缓存，除非显示指定 |
| 303 | See Other | 临时重定向，必须GET请求 |
| 304 | Not Modified | 未修改，不含响应体 |
| 307 | Temporary Redirect | 临时重定向，默认不缓存，除非显示指定，不改变请求方法和请求体 |
| 308 | Permanent Redirect | 永久重定向，默认可缓存，搜索引擎应更新链接，不改变请求方法和请求体 |
| **400-499** | **客户端错误** ||
| 400 | Bad Request | 请求语义或参数有误，不应重复请求 |
| 401 | Unauthorized | 请求需身份验证或验证失败 |
| 403 | Forbidden | 拒绝，不应重复请求 |
| 404 | Not Found | 未找到，无原因 |
| 405 | Method Not Allowed | 不允许的请求方法，并返回Allow允许的请求方法列表 |
| 406 | Not Acceptable | 无法根据请求条件，返回响应体 |
| 407 | Proxy Authentication Required | 请求需在代理服务器上身份验证 |
| 408 | Request Timeout | 请求超时 |
| 409 | Conflict | 请求冲突，响应应包含冲突原因 |
| 410 | Gone | 资源已被永久移除 |
| 411 | Length Required | 请求头需添加Content-Length |
| 412 | Precondition Failed | 非GET、POST请求外，If-Unmodified-Since或If-None-Match规定先决条件无法满足 |
| 413 | Payload Too Large | 请求体数据大小超过服务器处理范围 |
| 414 | URI Too Long | URL过长，查询字符串过长时，应使用POST请求 |
| 415 | Unsupported Media Type | 请求文件类型服务端不支持 |
| 416 | Range Not Satisfiable | 请求头Range与资源可用范围不重合 |
| 417 | Expectation Failed | 服务端无法满足客户端通过Expect设置的期望响应 |
| 421 | Misdirected Request | HTTP2下链接无法复用时返回 |
| 425 | Too Early | 请求有重放攻击风险 |
| 426 | 426 | 客端应按响应头Upgrade的协议列表中的协议重新请求 |
| 428 | Precondition Required | 没有符合If-Match的资源 |
| 429 | Too Many Requests | 请求频次超过服务端限制 |
| 431 | Request Header Fields Too Large | 请求头字段过大 |
| 451 | Unavailable For Legal Reasons | 因法律原因该资源不可用 |
| **500-511** | **服务端响应** ||
| 500 | Internal Server Error | 服务端报错，通常是脚本错误 |
| 501 | Not Implemented | 请求方法不被服务器支持 |
| 502 | Bad Gateway | 网关无响应，通常是服务端环境配置错误 |
| 503 | Service Unavailable | 服务端临时不可用，建议返回Retry-After，搜索引擎爬虫应一段时间再次访问这个URL |
| 504 | Gateway Timeout | 网关超时，通常是服务端过载 |
| 505 | HTTP Version Not Supported | 请求的 HTTP 协议版本不被支持 |
| 506 | Variant Also Negotiates | 内部服务器配置错误 |
| 510 | Not Extended | 不支持 HTTP 扩展 |
| 511 | Network Authentication Required | 需要身份验证，常见于公用 WIFI |


## 常用的 HTTP 方法有哪些，GET 和 POST 的区别是什么？

- 安全：请求方法不会影响服务器上的资源
- 幂等：多次执行相同操作，结果相同
- 显示声明缓存：响应头包含Expires Cache-Control: max-age等时缓存

| 方法          | 描述           | 请求含主体  | 响应含主体 | 支持表单 | 安全 | 幂等 | 可缓存 |
| ------------- |:-------------:| -----:|-----:|-----:|-----:|-----:|-----:|
| GET | 请求资源 | 否 | 是 | 是 | 是 | 是 | 是 |
| HEAD | 请求资源头部 | 否 | 否 | 否| 是 | 是 | 是 |
| POST | 发送数据，主体类型由Content-Type指定 | 是 | 是 | 是 | 否 | 否 | 显示声明缓存 |
| PUT | 发送负载创建或替换目标资源 | 是 | 否 | 否 | 否 | 是 | 否 |
| DELETE | 删除资源 | 不限 | 不限 | 否 | 否 | 是 | 否 |
| CONNECT | 创建点到点沟通隧道 | 否 | 是 | 否 | 否 | 否 | 否 |
| OPTIONS | 检测服务端支持方法 | 否 | 是 | 否 | 是 | 是 | 否 |
| TRACE | 消息环回测试，多用于路由检测 | 否 | 否 | 否 | 是 | 是 | 否 |
| PATCH | 部分修改资源 | 是 | 是 | 否 | 否 | 否 | 否 |



## 常见的 HTTP 请求头和响应头有哪些？

| 请求头          | 描述           | 示例  |
| :------------- |:------------- | :----- |
| Accept | 用户代理支持的MIME类型列表 | Accept: <br>text/html,application/xhtml+xml,application/xml;<br>q=0.9,image/avif,image/webp,image/apng,/;<br>q=0.8,application/signed-exchange;v=b3;<br>q=0.9 |
| Accept-Encoding | 用户代理支持的压缩方法（优先级）| Accept-Encoding: br, gzip, deflate |
| Accept-Language | 用户代理期望的语言（优先级）| Accept-Language: zh-CN,zh;q=0.9 |
| Cache-Control    | 缓存机制 | Cache-Control: max-age=0 |
| Connection       | 是否持久连接 | Connection: keep-alive |
| Cookie           | HTTP cookies | 服务器通过Set-Cookie存储到客户端的 Cookie |
| Host | 主机名 + 端口号 | Host: 127.0.0.1:8080 |
| If-Match | 请求指定标识符资源 | If-Match: "56a88df57772gt555gr5469a32ee75d65dcwq989" |
| If-Modified-Since| 请求指定时间修改过的资源 | If-Modified-Since: Wed, 19 Oct 2020 17:32:00 GMT |
| If-None-Match | 请求非指定标识符资源 | If-None-Match: "56a88df57772gt555gr5469a32ee75d65dcwq989" |
| Upgrade-Insecure-Requests | 客户端优先接受加密和有身份验证的响应，支持CSP | Upgrade-Insecure-Requests: 1 |
| User-Agent | 用户代理 | User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36 |
| Vary | 缓存策略 | Vary: User-Agent 常用于自适应缓存配置和 SEO|


| 响应头          | 描述           | 示例  |
| :------------- |:-------------| :-----|
| Cache-Control | 缓存机制 | Cache-Control: public, max-age=3600 |
| Connection | 是否持久连接 | Connection: keep-alive |
| Content-Encoding | 内容编码方式 | Content-Encoding: br |
| Content-Type | 内容的MIME类型 | Content-Type: text/html; charset=UTF-8 |
| Date | 报文创建时间 | 支持 |
| Expires | 资源过期时间 | Expires: Sun, 28 Feb 2021 12:52:51 GMT |
| ETag | 资源标识符 | ETag: "56a88df57772gt555gr5469a32ee75d65dcwq989" |
| Set-Cookie | 服务端向客户端发送Cookie | Set-Cookie: __yjs_duid=1_7a24a73cae0e4926e7604ec1fd9277eb1614513171854; <br>expires=Tue, 30-Mar-21 11:52:51 GMT; <br>Path=/; Domain=baidu.com; HttpOnly |



## 什么是 HTTPS，与 HTTP 的区别？

### 什么是 HTTPS？
HTTPS 的全称是 Hyper Text Transfer Protocol over SecureSocket Layer，基于安全套接字协议 SSL，提供传输加密和身份认证保证传输的安全性，通过证书确认网站的真实性

HTTP2.0 和 HTTP3.0 都只用于https://网址

### HTTPS 三次握手
![Image from alias](~@assets/img/1616745009-Dqjpkm-image.png)

① **Client Hello**：客户端将支持 SSL 版本、加密算法、密钥交换算法等发送服务端

② **Server Hello**：服务端确定 SSL 版本、算法、会话 ID 发给客户端

③ **Certificate**：服务端将携带公钥的数字证书发给客户端

④ **Server Hello Done**：通知客户端版本和加密套件发完，准备交换密钥

⑤ **Client Key Exchange**：客户端验证证书合法性，随机生成premaster secret用公钥加密发给服务端

⑥ **Change Cipher Spec**：通知服务端后续报文采用协商好的密钥和加密套件

⑦ **Finished**：客户端用密钥和加密套件计算已交互消息的 Hash 值发给服务端。服务端进行同样计算，与收到的客户端消息解密比较，相同则协商成功

⑧ **Change Cipher Spec**：通知客户端后续报文采用协商好的密钥和加密套件

⑨ **Finished**：服务端用密钥和加密套件计算已交互消息的 Hash 值发给服务端。客户端进行同样计算，与收到的服务端消息解密比较，相同则协商成功

### HTTP 与 HTTPS 对比

| 项目          | HTTP           | HTTPS  |
| ------------- |:-------------:| -----:|
| 默认端口      | 80             | 443 |
| HTTP 版本      | 1.0 - 1.1      |   2 - 3 |
| 传输          | 明文，易被劫持   |   加密，不易劫持 |
| 浏览器标识    | 不安全            | 安全 |
| CA 认证       | 不支持            | 支持 |
| SEO           | 无优待            | 优先 |


## 对比 HTTP1.0/HTTP1.1/HTTP2.0/HTTP3.0

#### HTTP1.0
无状态，无连接的应用层协议

- <font color="Green">**无法复用连接**</font>
    - 每次发送请求，都要新建连接
- <font color="Green">**队头阻塞**</font>
    - 下个请求必须在上个请求响应到达后发送。如果上个请求响应丢失，则后面请求被阻塞

#### HTTP1.1
HTTP1.1 继承了 HTTP1.0 简单，克服了 HTTP1.0 性能上的问题

- <font color="Green">**长连接**</font>
    - 新增Connection: keep-alive保持永久连接
- <font color="Green">**管道化**</font>
    - 支持管道化请求，请求可以并行传输，但响应顺序应与请求顺序相同。实际场景中，浏览器采用建立多个TCP会话的方式，实现真正的并行，通过域名限制最大会话数量
- <font color="Green">**缓存处理**</font>
    - 新增Cache-control，支持强缓存和协商缓存
- <font color="Green">**断点续传**</font>
- <font color="Green">**主机头**</font>
    - 新增Host字段，使得一个服务器创建多个站点

#### HTTP2.0
HTTP2.0进一步改善了传输性能

- <font color="Green">**二进制分帧**</font>
    - 在应用层和传输层间增加二进制分帧层
- <font color="Green">**多路复用**</font>
    - 建立双向字节流，帧头部包含所属流 ID，帧可以乱序发送，数据流可设优先级和依赖。从而实现一个 TCP 会话上进行任意数量的HTTP请求，真正的并行传输
- <font color="Green">**头部压缩**</font>
    - 压缩算法编码原来纯文本发送的请求头，通讯双方各自缓存一份头部元数据表，避免传输重复头
- <font color="Green">**服务器推送**</font>
    - 服务端可主动向客户端推送资源，无需客户端请求


#### HTTP3.0
当一个 TCP 会丢包时，整个会话都要等待重传，后面数据都被阻塞。这是由于 TCP 本身的局限性导致的。HTTP3.0 基于 UDP 协议，解决 TCP 的局限性

- <font color="Green">**0-RTT**</font>
    - 缓存当前会话上下文，下次恢复会话时，只需要将之前缓存传递给服务器，验证通过，即可传输数据
- <font color="Green">**多路复用**</font>
    - 一个会话的多个流间不存在依赖，丢包只需要重发包，不需要重传整个连接
- <font color="Green">**更好的移动端表现**</font>
    - 移动端 IP 经常变化，影响 TCP 传输，HTTP3.0 通过 ID 识别连接，只要 ID 不变，就能快速连接
- <font color="Green">**加密认证的根文**</font>
    - TCP 协议头没有加密和认证，HTTP3.0 的包中几乎所有报文都要经过认证，主体经过加密，有效防窃听，注入和篡改
- <font color="Green">**向前纠错机制**</font>
    - 每个包还包含其他数据包的数据，少量丢包可通过其他包的冗余数据直接组装而无需重传。数据发送上限降低，但有效减少了丢包重传所需时间


## Cookie 和 Session 的区别

| 项目          | Cookie           | Session  |
| :------------- |:-------------| :----- |
| 存取值类型 | 字符串 | 大多数类型 |
| 存取位置 | 客户端 | 服务端，sessionId 非主动传参时，依赖 Cookie |
| 存取方式 | 文件 | 文件、内存、关系或非关系型数据库等 |
| 大小 | 受客户端限制 | 自行配置 |
| 过期时间 | 写入时设置，用户可清除 | 自行配置，用户可清除对应Cookie，服务端自动清除过期 Session |
| 兼容性 | 需浏览器开启，用户同意 | 不依赖 Cookie 时，通过 Get 或自定请求字段传入 |
| 作用范围 | 可设置跨子域，不可跨主域 | 用户身份唯一标识符不变时，可跨域，跨服务器。默认受限于 Cookie，仅限会话期间有效 |